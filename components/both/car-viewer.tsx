'use client'

import { FC, useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaComment, FaHeart, FaShare, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import { Vehicle } from '@/models/vehicle';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
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
import useShoppingCart from '@/hooks/useShoppingCart';
import { useUser } from '@/contexts/userContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { Star, Wallet, Eye, Calendar, Gauge, Fuel, Settings, Shield, Award, ChevronLeft, ChevronRight, Trash2, Edit3, MoreVertical } from "lucide-react"
import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { Button } from '../ui/button';
import useWishlist from '@/hooks/useWishList';
import { InventoryItem } from '@/models/inventory';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { formatCurrency } from '@/scripts/format-price';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { motion, AnimatePresence } from 'framer-motion';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const CarViewer: FC<{
    onDelete?: (item: Vehicle) => void,
    vehicle: Vehicle,
    user: { name: string, email: string, uid: string },
    onUpdate: (item: Vehicle) => void,
    type: "customer" | "seller" | "collaborator"
}> = ({ vehicle, user, type, onDelete, onUpdate }) => {
    const router = useRouter()
    const { profile: chatWith } = useUser(vehicle.userId)
    const [isExpanded, setIsExpanded] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string>(vehicle.gallery[0]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);

    const truncatedDescription = vehicle.description?.length > 150
        ? vehicle.description.slice(0, 150) + '...'
        : vehicle.description;

    const handleRemoveVehicle = useCallback(async () => {
        if (onDelete && vehicle) {
            onDelete(vehicle)
            router.push('/seller/inventory')
        }
    }, [vehicle, onDelete]);

    const nextImage = () => {
        const nextIndex = (currentImageIndex + 1) % vehicle.gallery.length;
        setCurrentImageIndex(nextIndex);
        setSelectedImage(vehicle.gallery[nextIndex]);
    };

    const prevImage = () => {
        const prevIndex = currentImageIndex === 0 ? vehicle.gallery.length - 1 : currentImageIndex - 1;
        setCurrentImageIndex(prevIndex);
        setSelectedImage(vehicle.gallery[prevIndex]);
    };

    const getSpecIcon = (label: string) => {
        const iconMap: { [key: string]: React.ReactNode } = {
            'Combustível': <Fuel className="w-4 h-4" />,
            'Transmissão': <Settings className="w-4 h-4" />,
            'Quilometragem': <Gauge className="w-4 h-4" />,
            'Ano': <Calendar className="w-4 h-4" />,
            'Condição': <Shield className="w-4 h-4" />,
        };
        return iconMap[label] || <Award className="w-4 h-4" />;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
         
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Images */}
                    <div className="lg:col-span-2 space-y-4">
                        {/* Main Image */}
                        <motion.div
                            className="relative aspect-video rounded-2xl overflow-hidden bg-gray-900 group cursor-pointer"
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.2 }}
                            onClick={() => setIsImageDialogOpen(true)}
                        >
                            <Image
                                src={selectedImage}
                                alt={`${vehicle.brand} ${vehicle.model}`}
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                                priority
                            />

                            {/* Image Navigation Overlay */}
                            <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                    variant="secondary"
                                    size="icon"
                                    className="rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        prevImage();
                                    }}
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant="secondary"
                                    size="icon"
                                    className="rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        nextImage();
                                    }}
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </Button>
                            </div>

                            {/* Image Counter */}
                            <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
                                {currentImageIndex + 1} / {vehicle.gallery.length}
                            </div>

                            {/* Zoom Icon */}
                            <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                <Eye className="w-4 h-4" />
                            </div>
                        </motion.div>

                        {/* Thumbnail Gallery */}
                        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                            {vehicle.gallery.map((image, index) => (
                                <motion.div
                                    key={index}
                                    className={`aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${selectedImage === image
                                            ? 'border-blue-500 ring-2 ring-blue-200'
                                            : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => {
                                        setSelectedImage(image);
                                        setCurrentImageIndex(index);
                                    }}
                                >
                                    <Image
                                        src={image}
                                        alt={`${vehicle.brand} ${vehicle.model} - ${index + 1}`}
                                        width={100}
                                        height={100}
                                        className="w-full h-full object-cover"
                                    />
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column - Details */}
                    <div className="space-y-6">
                        {/* Vehicle Header */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                                        {vehicle.brand} {vehicle.model}
                                    </h1>
                                    <div className="flex items-center gap-2 mb-3">
                                        <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                                            {vehicle.condition}
                                        </Badge>
                                        {vehicle.color && (
                                            <Badge variant="outline">
                                                {vehicle.color}
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="text-3xl font-bold text-blue-600 mb-4">
                                {formatCurrency(vehicle.price)}
                            </div>

                            {/* Quick Specs */}
                            <div className="grid grid-cols-2 gap-3 mb-6">
                                {vehicle.specifications.slice(0, 4).map((spec, index) => (
                                    <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                                        {getSpecIcon(spec.label)}
                                        <div>
                                            <p className="text-xs text-gray-500">{spec.label}</p>
                                            <p className="text-sm font-medium text-gray-900">{spec.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Action Buttons */}
                            {type === 'seller' && onDelete && (
                                <div className="space-y-3">
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="secondary" className="w-full">
                                                <Edit3 className="w-4 h-4 mr-2" />
                                                Editar
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent className="max-w-md rounded-2xl">
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Confirmar edição</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Tem a certeza que deseja apagar este veículo? Esta ação não pode ser desfeita.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel className="rounded-xl">Cancelar</AlertDialogCancel>
                                                <AlertDialogAction
                                                    className="rounded-xl bg-red-600 hover:bg-red-700"
                                                    onClick={handleRemoveVehicle}
                                                >
                                                    Eliminar
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                    
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="destructive" className="w-full">
                                                <Trash2 className="w-4 h-4 mr-2" />
                                                Eliminar do inventário
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent className="max-w-md rounded-2xl">
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Confirmar eliminação</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Tem a certeza que deseja apagar este veículo? Esta ação não pode ser desfeita.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel className="rounded-xl">Cancelar</AlertDialogCancel>
                                                <AlertDialogAction
                                                    className="rounded-xl bg-red-600 hover:bg-red-700"
                                                    onClick={handleRemoveVehicle}
                                                >
                                                    Eliminar
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            )}
                        </div>

                    
                    </div>
                </div>

                {/* Description Section */}
                <div className="mt-8">
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
                            Descrição
                        </h2>
                        <div className="prose prose-gray max-w-none">
                            <p className="text-gray-700 leading-relaxed">
                                {isExpanded ? vehicle.description : truncatedDescription}
                            </p>
                            {vehicle.description?.length > 150 && (
                                <Button
                                    variant="link"
                                    onClick={() => setIsExpanded(!isExpanded)}
                                    className="p-0 h-auto text-blue-600 hover:text-blue-700 mt-2"
                                >
                                    {isExpanded ? 'Mostrar menos' : 'Mostrar mais'}
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Specifications Section */}
                <div className="mt-8">
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                            <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
                            Especificações Técnicas
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {vehicle.specifications.map((spec, index) => (
                                <motion.div
                                    key={index}
                                    className="group p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all duration-200"
                                    whileHover={{ y: -2 }}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                                            {getSpecIcon(spec.label)}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900 mb-1">{spec.label}</p>
                                            <p className="text-sm text-gray-600">{spec.description}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Additional Vehicle Info */}
                {(vehicle.licensePlate || vehicle.mileage) && (
                    <div className="mt-8">
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                                <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
                                Informações Adicionais
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {vehicle.licensePlate && (
                                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                                        <div className="p-2 bg-white rounded-lg shadow-sm">
                                            <Shield className="w-5 h-5 text-gray-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Matrícula</p>
                                            <p className="font-semibold text-gray-900">{vehicle.licensePlate}</p>
                                        </div>
                                    </div>
                                )}
                                {vehicle.mileage && (
                                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                                        <div className="p-2 bg-white rounded-lg shadow-sm">
                                            <Gauge className="w-5 h-5 text-gray-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Quilometragem</p>
                                            <p className="font-semibold text-gray-900">{vehicle.mileage} km</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Image Dialog */}
            <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
                <DialogContent className="max-w-4xl w-full h-[80vh] p-0 bg-black">
                    <div className="relative w-full h-full flex items-center justify-center">
                        <Image
                            src={selectedImage}
                            alt={`${vehicle.brand} ${vehicle.model}`}
                            fill
                            className="object-contain"
                        />

                        {/* Navigation Controls */}
                        <Button
                            variant="secondary"
                            size="icon"
                            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30"
                            onClick={prevImage}
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </Button>
                        <Button
                            variant="secondary"
                            size="icon"
                            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30"
                            onClick={nextImage}
                        >
                            <ChevronRight className="w-6 h-6" />
                        </Button>

                        {/* Image Counter */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full">
                            {currentImageIndex + 1} de {vehicle.gallery.length}
                        </div>

                        {/* Close Button */}
                        <Button
                            variant="secondary"
                            size="icon"
                            className="absolute top-4 right-4 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30"
                            onClick={() => setIsImageDialogOpen(false)}
                        >
                            ✕
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>         

            {/* Spacer for mobile bottom actions */}
            <div className="h-20 lg:hidden"></div>
        </div>
    );
};

export default CarViewer;
