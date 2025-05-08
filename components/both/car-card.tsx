import { InventoryItem } from "@/models/inventory";
import { formatCurrency } from "@/scripts/format-price";
import { HeartIcon, ShoppingCartIcon, MapPinIcon, CalendarIcon, GaugeIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import useVehicle from "@/hooks/useVehicle";
import { Button } from "../ui/button";
import { FaTrash } from "react-icons/fa";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { useUser } from "@/contexts/userContext";
import { motion } from "framer-motion";
import { Badge } from "../ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
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
} from "@/components/ui/alert-dialog";

const CarCard: React.FC<{ vehicle: InventoryItem, onDelete: React.Dispatch<React.SetStateAction<InventoryItem | undefined>> }> = ({
    vehicle,
    onDelete
}) => {
    const router = useRouter();
    const {
        actions: {
            checkOcurrencesOnWishList,
            checkOcurrencesOnShoppingCart
        }
    } = useVehicle();
    const { vehicles } = vehicle;
    const { user } = useAuth();
    const { profile } = useUser(user?.uid ?? '');
    const [isHovered, setIsHovered] = useState(false);

    const [ocurrencyOnWishlist, setOcurrencyOnWishlist] = useState<number>(0);
    const [ocurrencyOnShoppingCart, setOcurrencyOnShoppingCart] = useState<number>(0);
    
    useEffect(() => {
        (async () => {
            const ocurrenciesOnWishlist = await checkOcurrencesOnWishList(vehicles.vehicleId);
            const ocurrenciesOnShoppingCart = await checkOcurrencesOnShoppingCart(vehicles.vehicleId);
            if (ocurrenciesOnWishlist && ocurrenciesOnShoppingCart) {
                setOcurrencyOnWishlist(ocurrenciesOnWishlist.count);
                setOcurrencyOnShoppingCart(ocurrenciesOnShoppingCart.count);
            }
        })();
    }, []);

    const handleCardClick = () => {
        router.push(`/seller/inventory/car-detail/${vehicles.vehicleId}`);
    };

    return (
        <motion.div
            whileHover={{
                y: -5,
                transition: { duration: 0.2 }
            }}
            className="group relative rounded-xl overflow-hidden bg-white shadow-md hover:shadow-xl transition-all duration-300"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div
                onClick={handleCardClick}
                className="cursor-pointer"
            >
                {/* Image Container */}
                <div className="relative w-full h-48 overflow-hidden">
                    {vehicles.gallery && vehicles.gallery.length > 0 ? (
                        <Image
                            width={400}
                            height={300}
                            src={vehicles.gallery[0]}
                            alt={`${vehicles.brand} ${vehicles.model}`}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                    ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-400">Sem imagem</span>
                        </div>
                    )}
                    
                    {/* Condition Badge */}
                    <Badge
                        className={`absolute top-3 left-3 ${
                            vehicles.condition === 'Novo'
                                ? 'bg-green-500 hover:bg-green-600'
                                : 'bg-blue-500 hover:bg-blue-600'
                        }`}
                    >
                        {vehicles.condition}
                    </Badge>
                    
                    {/* Price Badge */}
                    <div className="absolute bottom-3 right-3">
                        <Badge className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-3 py-1">
                            {formatCurrency(vehicles.price)}
                        </Badge>
                    </div>
                </div>
                
                {/* Content */}
                <div className="p-4">
                    <h3 className="font-bold text-gray-800 text-lg mb-1 line-clamp-1">
                        {vehicles.brand} {vehicles.model}
                    </h3>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                        <div className="flex items-center text-xs text-gray-500">
                            <CalendarIcon size={14} className="mr-1" />
                            <span>{vehicles.manufactureYear}</span>
                        </div>
                        
                        <div className="flex items-center text-xs text-gray-500">
                            <GaugeIcon size={14} className="mr-1" />
                            <span>{vehicles.mileage} km</span>
                        </div>
                        
                        <div className="flex items-center text-xs text-gray-500">
                            <MapPinIcon size={14} className="mr-1" />
                            <span>Angola</span>
                        </div>
                    </div>
                    
                    {/* Stats and Actions */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <div className="flex items-center space-x-3">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div className="flex items-center space-x-1 text-gray-500">
                                            <HeartIcon className="w-4 h-4 text-orange-500" />
                                            <span className="text-xs">{ocurrencyOnWishlist}</span>
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Na lista de desejos</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div className="flex items-center space-x-1 text-gray-500">
                                            <ShoppingCartIcon className="w-4 h-4 text-orange-500" />
                                            <span className="text-xs">{ocurrencyOnShoppingCart}</span>
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>No carrinho</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                        
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs text-orange-500 hover:text-orange-600 hover:bg-orange-50 p-0 h-auto"
                            onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/seller/inventory/car-detail/${vehicles.vehicleId}`);
                            }}
                        >
                            Ver detalhes
                        </Button>
                    </div>
                </div>
            </div>
            
            {/* Hover Overlay with Quick Actions */}
            <div
                className={`absolute inset-0 bg-black/60 flex items-center justify-center transition-opacity duration-300 ${
                    isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
            >
                <div className="flex flex-col gap-3">
                    <Button
                        className="bg-white text-orange-500 hover:bg-orange-50 hover:text-orange-600"
                        onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/seller/inventory/car-detail/${vehicles.vehicleId}`);
                        }}
                    >
                        Ver Detalhes
                    </Button>
                    
                    {profile?.type === "seller" && (
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    className="bg-red-500 hover:bg-red-600 text-white"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <FaTrash className="mr-2" /> Remover
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Tem certeza que deseja remover este veículo do inventário? Esta ação não pode ser desfeita.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel onClick={(e) => e.stopPropagation()}>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDelete(vehicle);
                                        }}
                                        className="bg-red-500 hover:bg-red-600"
                                    >
                                        Confirmar
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default CarCard;
