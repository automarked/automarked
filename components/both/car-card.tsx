import { apiBaseURL } from "@/constants/api";
import { InventoryItem } from "@/models/inventory";
import { formatCurrency } from "@/scripts/format-price";
import { HeartIcon, ShoppingCartIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { FaTrash } from "react-icons/fa";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import useVehicle from "@/hooks/useVehicle";
import { Vehicle } from "@/models/vehicle";
import Link from "next/link";
import Image from "next/image";

const CarCard: React.FC<{ vehicle: Vehicle }> = ({
    vehicle,
}) => {
    const router = useRouter()
    const {
        actions: {
            checkOcurrencesOnWishList,
            checkOcurrencesOnShoppingCart
        }
    } = useVehicle()
    const [ocurrencyOnWishlist, setOcurrencyOnWishlist] = useState<number>(0)
    const [ocurrencyOnShoppingCart, setOcurrencyOnShoppingCart] = useState<number>(0)
    useEffect(() => {
        (async () => {
            const ocurrenciesOnWishlist = await checkOcurrencesOnWishList(vehicle.vehicleId)
            const ocurrenciesOnShoppingCart = await checkOcurrencesOnShoppingCart(vehicle.vehicleId)
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
                    width={300}
                    height={300}
                    src={vehicle.gallery[0]}
                    alt={vehicle.vehicleId}
                    className="w-full h-full object-cover"
                />

            </div>
            <div className="relative cursor-pointer h-24 p-2 bg-white w-full" onClick={() => router.push(`/seller/inventory/car-detail/${vehicle.vehicleId}`)}>
                <h3 className="font-semibold text-gray-800 text-base">{vehicle.brand} {vehicle.model}</h3>
                <div className="text-sm font-bold text-gray-800"> {formatCurrency(vehicle.price)}</div>
                <div className="flex items-center justify-between w-full absolute bottom-0 left-0 right-0 p-1.5">
                    <span data-condition={vehicle.condition === 'Novo'} className="px-2 data-[condition=true]:bg-[var(--orange-dark)] data-[condition=false]:border data-[condition=true]:text-white data-[condition=false]:bg-gray-100 text-xs font-medium rounded">
                        {vehicle.condition}
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
