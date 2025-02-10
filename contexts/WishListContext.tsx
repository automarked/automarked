import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { Vehicle } from "@/models/vehicle";
import { toast } from "@/hooks/use-toast";
import { createdInstance } from "@/hooks/useApi";

// Tipagem do contexto
interface WishlistContextData {
    wishList: Vehicle[];
    addOnWishList: (vehicle: Vehicle) => Promise<void>;
    deleteFromWishList: (vehicleId: string) => Promise<void>;
    getWishList: () => Promise<void>;
    getFrom: (id: string) => boolean
}

// Criando o contexto
const WishlistContext = createContext<WishlistContextData | undefined>(undefined);

// Componente provedor
interface WishlistProviderProps {
    userId: string;
    children: ReactNode;
}

export const WishlistProvider: React.FC<WishlistProviderProps> = ({ userId, children }) => {
    const [wishList, setWishList] = useState<Vehicle[]>([]);

    const showToast = (title: string, description: string) => {
        toast({
            title,
            description,
        });
    };

    if (!userId) {
        throw new Error("O ID do usuário é obrigatório para inicializar o WishlistProvider.");
    }

    const addOnWishList = useCallback(async (vehicle: Vehicle) => {
        try {
            const response = await createdInstance.post<Vehicle[]>(`/wishlist/${userId}/vehicles`, vehicle);
            if (response.status === 201) {
                setWishList(response.data);
                console.log(response.data);
                
                showToast("Sucesso!", `${vehicle.brand + " " + vehicle.model} adicionado à lista de desejos!`);
            }
        } catch (error) {
            console.error(error);
            showToast("Erro ao adicionar!", `${vehicle.brand + " " + vehicle.model} não pode ser adicionado à lista de desejos!`);
        }
    }, [userId]);

    const getWishList = useCallback(async () => {
        try {
            const response = await createdInstance.get<Vehicle[]>(`/wishlist/${userId}/vehicles`);
            if (response.status === 200) {
                setWishList(response.data);
            }
        } catch (error) {
            console.error("Erro ao buscar lista de desejos:", error);
        }
    }, [userId]);

    const deleteFromWishList = useCallback(async (vehicleId: string) => {
        try {
            const response = await createdInstance.delete<Vehicle[]>(`/wishlist/${userId}/vehicles/${vehicleId}`);
            if (response.status === 200) {
                setWishList(response.data);
                showToast("Sucesso!", "Veículo removido com sucesso!");
            }
        } catch (error) {
            console.error("Erro ao remover veículo:", error);
            showToast("Erro ao remover!", "Não foi possível remover o veículo da lista de desejos.");
        }
    }, [userId]);

    const getFrom = useCallback((id: string) => {
        return wishList.some(vehicle => vehicle.licensePlate === id)
    }, [wishList])

    useEffect(() => {
        getWishList();
    }, []);

    return (
        <WishlistContext.Provider value={{ wishList, addOnWishList, deleteFromWishList, getWishList, getFrom }}>
            {children}
        </WishlistContext.Provider>
    );
};

// Hook para acessar o contexto
export const useWishlist = (): WishlistContextData => {
    const context = useContext(WishlistContext);
    if (!context) {
        throw new Error("useWishlist deve ser usado dentro de um WishlistProvider.");
    }
    return context;
};
