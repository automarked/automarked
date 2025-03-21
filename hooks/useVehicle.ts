import { Vehicle } from "@/models/vehicle";
import { useCallback, useEffect, useState } from "react";
/* import { Alert } from "react-native"; */
import { createdInstance } from "./useApi";
import { toast } from "./use-toast";
import { useAuth } from "@/contexts/AuthContext";

export default function useVehicle() {
    const { user } = useAuth()
    const [vehicleList, setVehicleList] = useState<Vehicle[]>([])
    const showToast = (title: string, description: string) => {
        toast({
            title,
            description,
        });
    };
    const [vehicleData, setVehicleData] = useState<Vehicle>({
        vehicleId: '',
        brand: '',
        model: '',
        userId: user?.uid ?? '',
        dealershipId: user?.uid ?? '', // Certifique-se de que user?.uid seja válido
        licensePlate: '',
        manufactureYear: '', // Se você deseja que o ano seja string, deixe como string
        price: '0', // Deve ser um número
        vehicleType: 'car', // 'car' ou 'moto'
        mileage: '0', // Deve ser um número
        color: '',
        gallery: [],
        bar_code: '',
        internal_code: '',
        photo: '',
        condition: 'Usado', // "Novo" ou "Usado"
        specifications: [],
        description: ''
    });


    const addOnGallery = useCallback(async (imageURL: string) => {
        setVehicleData({
            ...vehicleData,
            gallery: [
                ...vehicleData.gallery,
                imageURL
            ]
        });
    }, [vehicleData, setVehicleData])

    const handleInputChange = (key: string, value: any) => {
        setVehicleData(prevState => ({
            ...prevState,
            [key]: value,
        }));
    };

    const checkOcurrencesOnWishList = useCallback(async (vehicleId: string) => {
        const response = await createdInstance.get<{ vehicleId: string, count: number }>(`wishlist/vehicle/${vehicleId}/count`)

        if (response.status === 200) {
            return response.data
        }
    }, [])

    const checkOcurrencesOnShoppingCart = useCallback(async (vehicleId: string) => {
        const response = await createdInstance.get<{ vehicleId: string, count: number }>(`/shoppingCart/vehicle/${vehicleId}/count`)

        if (response.status === 200) {
            return response.data
        }
    }, [])

    const getAllVehicles = useCallback(async () => {
        const response = await createdInstance.get<{ record: Vehicle[] }>('/vehicles')

        if (response.status === 200) setVehicleList(response.data.record)
    }, [])

    const handleSubmit = useCallback(async (vehicle: Vehicle) => {
        const response = await createdInstance.post('/vehicles', vehicle)

        if (response.status === 201) {
            showToast("Sucesso!", `Seu ${vehicle.brand} ${vehicle.model} foi adicionando com sucesso ao seu inventário!`)
        }
    }, [vehicleData]);

    useEffect(() => {
        getAllVehicles()
    }, [])

    useEffect(() => {
        console.log(vehicleData);
    }, [vehicleData])

    return {
        vehicle: vehicleData,
        vehicleList,
        actions: {
            handleInputChange,
            checkOcurrencesOnWishList,
            checkOcurrencesOnShoppingCart,
            handleSubmit,
            addOnGallery,
            getAllVehicles
        }
    }
}