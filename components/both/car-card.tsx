import { InventoryItem } from "@/models/inventory";
import { formatCurrency } from "@/scripts/format-price";
import { HeartIcon, ShoppingCartIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import useVehicle from "@/hooks/useVehicle";
import { Button } from "../ui/button";
import { FaTrash } from "react-icons/fa";
import Image from "next/image";

const CarCard: React.FC<{ vehicle: InventoryItem, onDelete: React.Dispatch<React.SetStateAction<InventoryItem | undefined>> }> = ({
    vehicle,
    onDelete
}) => {
    const router = useRouter()
    const {
        actions: {
            checkOcurrencesOnWishList,
            checkOcurrencesOnShoppingCart
        }
    } = useVehicle()
    const { vehicles } = vehicle

    const [ocurrencyOnWishlist, setOcurrencyOnWishlist] = useState<number>(0)
    const [ocurrencyOnShoppingCart, setOcurrencyOnShoppingCart] = useState<number>(0)
    useEffect(() => {
        (async () => {
            const ocurrenciesOnWishlist = await checkOcurrencesOnWishList(vehicles.vehicleId)
            const ocurrenciesOnShoppingCart = await checkOcurrencesOnShoppingCart(vehicles.vehicleId)
            if (ocurrenciesOnWishlist && ocurrenciesOnShoppingCart) {
                setOcurrencyOnWishlist(ocurrenciesOnWishlist.count)
                setOcurrencyOnShoppingCart(ocurrenciesOnShoppingCart.count)
            }
        })()
    }, [])
    return (
        <div className="z-10 shadow-sm flex flex-col items-start space-y-2 relative border">
            <div className="relative w-full overflow-hidden border h-36">
                <Image
                    width={100}
                    height={100}
                    src={vehicles.gallery[0]}
                    alt={vehicles.vehicleId}
                    className="w-full h-full object-cover"
                />
                <Button onClick={() => onDelete(vehicle)} className="absolute top-3 right-3 bg-white rounded-full p-1 w-8 h-8 shadow text-black hover:bg-gray-100">
                    <FaTrash />
                </Button>
            </div>
            <div className="relative cursor-pointer h-24 p-2 bg-white w-full" onClick={() => router.push(`/seller/inventory/car-detail/${vehicles.vehicleId}`)}>
                <h3 className="font-semibold text-gray-800 text-base">{vehicles.brand} {vehicles.model}</h3>
                <div className="mb-2 text-sm font-bold text-gray-800"> {formatCurrency(vehicles.price)}</div>
                <div className="flex items-center justify-between w-full absolute bottom-0 left-0 right-0 p-1.5">
                    <span data-condition={vehicles.condition === 'Novo'} className="px-2 data-[condition=true]:bg-[var(--orange-dark)] data-[condition=false]:border data-[condition=true]:text-white data-[condition=false]:bg-gray-100 text-xs font-medium rounded">
                        {vehicles.condition}
                    </span>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                            <HeartIcon className="w-4 h-4 text-yellow-500" />
                            <span>{ocurrencyOnWishlist}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <ShoppingCartIcon className="w-4 h-4 text-yellow-500" />
                            <span>{ocurrencyOnShoppingCart}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CarCard;
