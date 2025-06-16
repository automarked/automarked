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
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from '../ui/dialog';
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
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from '../ui/label';
import { Colors } from '@/constants/colors';
import useBrands from '@/hooks/useBrands';
import { Brand } from '@/models/brand';
import { useInventoryContext } from '@/contexts/InventoryContext';
import { toast } from '@/hooks/use-toast';

// Vehicle update schema
const vehicleUpdateSchema = z.object({
    brand: z.string({ message: "Selecione uma marca." }),
    model: z.string({ message: "Selecione um modelo." }),
    condition: z.enum(["Novo", "Usado"], { message: "Informe a condição do carro!" }),
    licensePlate: z.string({ message: "Digite a matrícula." }),
    manufactureYear: z
        .string()
        .regex(/^\d{4}$/, "Ano de fabricação deve ter 4 dígitos.")
        .refine((value) => {
            const year = parseInt(value, 10);
            return year <= new Date().getFullYear();
        }, "Ano de fabricação não pode ser no futuro.")
        .refine((value) => parseInt(value, 10) > 0, "Ano inválido."),
    price: z
        .string()
        .regex(/^\d+(\.\d{1,2})?$/, "Preço deve ser um número positivo, podendo ter até 2 casas decimais.")
        .refine((value) => parseFloat(value) > 0, "Preço deve ser maior que 0."),
    vehicleType: z.enum(["car", "moto"]),
    mileage: z
        .string()
        .regex(/^\d+$/, "Quilometragem deve ser um número inteiro.")
        .refine((value) => parseInt(value, 10) >= 0, "Quilometragem não pode ser negativa."),
    color: z.string({ message: "Digite a cor." }),
    bar_code: z.string({ message: "Digite o código de barras." }),
    internal_code: z.string({ message: "Digite o código interno." }),
    description: z.string().min(10, "A descrição deve ter pelo menos 10 caracteres."),
    fuel: z.enum(["Gasolina", "Diesel", "Elétrico", "Híbrido"], { message: "Selecione o tipo de combustível." }),
    transmission: z.enum(["Manual", "Automática", "CVT"], { message: "Selecione o tipo de transmissão." }),
    enginePower: z
        .string()
        .regex(/^\d+$/, "Potência do motor deve ser um número inteiro.")
        .refine((value) => parseInt(value, 10) > 0, "Potência do motor deve ser maior que 0."),
    location: z.string().min(3, "Informe uma localização válida."),
});

type VehicleUpdateFormData = z.infer<typeof vehicleUpdateSchema>;

const CarViewer: FC<{
    onDelete?: (item: Vehicle) => void,
    vehicle: Vehicle,
    user: { name: string, email: string, uid: string },
    onUpdate: (item: Vehicle) => void,
    type: "customer" | "seller" | "collaborator"
}> = ({ vehicle, user, type, onDelete, onUpdate }) => {
    const router = useRouter()
    const [isExpanded, setIsExpanded] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string>(vehicle.gallery[0]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    // Update form related states
    const { brandsList } = useBrands();
    const { updateVehicle } = useInventoryContext();
    const [selectedBrand, setSelectedBrand] = useState<Brand>();
    const [priceValue, setPriceValue] = useState("");

    // Extract current specifications
    const getCurrentSpecValue = (label: string) => {
        const spec = vehicle.specifications.find(s => s.label === label);
        return spec?.description || '';
    };

    const getCurrentFuel = (): "Gasolina" | "Diesel" | "Elétrico" | "Híbrido" => {
        const fuel = getCurrentSpecValue('Combustível');
        return (fuel as "Gasolina" | "Diesel" | "Elétrico" | "Híbrido") || "Gasolina";
    };

    const getCurrentTransmission = (): "Manual" | "Automática" | "CVT" => {
        const transmission = getCurrentSpecValue('Transmissão');
        return (transmission as "Manual" | "Automática" | "CVT") || "Manual";
    };

    const getCurrentEnginePower = (): string => {
        const power = getCurrentSpecValue('Potência do Motor');
        return power.replace(' CV', '') || '0';
    };

    const getCurrentLocation = (): string => {
        return getCurrentSpecValue('Localização') || '';
    };

    const {
        control,
        handleSubmit,
        formState: { errors },
        setValue,
        reset,
        watch
    } = useForm<VehicleUpdateFormData>({
        resolver: zodResolver(vehicleUpdateSchema),
        defaultValues: {
            brand: vehicle.brand,
            model: vehicle.model,
            condition: vehicle.condition,
            licensePlate: vehicle.licensePlate,
            manufactureYear: vehicle.manufactureYear,
            price: vehicle.price.toString(),
            vehicleType: vehicle.vehicleType,
            mileage: vehicle.mileage?.toString() || "0",
            color: vehicle.color || "",
            bar_code: vehicle.bar_code || "",
            internal_code: vehicle.internal_code || "",
            description: vehicle.description || "",
            fuel: getCurrentFuel(),
            transmission: getCurrentTransmission(),
            enginePower: getCurrentEnginePower(),
            location: getCurrentLocation(),
        },
    });

    // Initialize form when dialog opens
    useEffect(() => {
        if (isEditDialogOpen) {
            // Find and set the current brand
            const currentBrand = brandsList.find(b => b.brandName === vehicle.brand);
            setSelectedBrand(currentBrand);

            // Format price for display
            const formattedPrice = new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
            }).format(parseFloat(vehicle.price.toString()));
            setPriceValue(formattedPrice.replace('R$', 'AOA'));
        }
    }, [isEditDialogOpen, vehicle, brandsList]);

    const formatLicensePlate = (value: string) => {
        const cleanValue = value.replace(/[^A-Z0-9]/gi, '').toUpperCase();
        return cleanValue
            .replace(/^([A-Z]{2})/, '$1-')
            .replace(/^([A-Z]{2}-\d{2})/, '$1-')
            .replace(/^([A-Z]{2}-\d{2}-\d{2})/, '$1-')
            .substring(0, 11);
    };

    const onUpdateSubmit = useCallback(async (data: VehicleUpdateFormData) => {
        try {
            const specifications = [
                { label: 'Combustível', description: data.fuel },
                { label: 'Transmissão', description: data.transmission },
                { label: 'Potência do Motor', description: `${data.enginePower} CV` },
                { label: 'Localização', description: data.location },
            ];

            const { transmission, enginePower, fuel, location, ...rest } = data;

            const updatedVehicle: Vehicle = {
                ...vehicle,
                ...rest,
                specifications,
                price: data.price,
                mileage: data.mileage,
            };

            await updateVehicle(updatedVehicle);
            onUpdate(updatedVehicle);
            setIsEditDialogOpen(false);

            toast({
                title: "Sucesso!",
                description: "Veículo atualizado com sucesso!",
            });
        } catch (error) {
            toast({
                title: "Erro!",
                description: "Erro ao atualizar o veículo. Tente novamente.",
            });
        }
    }, [vehicle, updateVehicle, onUpdate]);

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
                                    {/* Edit Button with Dialog */}
                                    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                                        <DialogTrigger asChild>
                                            <Button variant="secondary" className="w-full">
                                                <Edit3 className="w-4 h-4 mr-2" />
                                                Editar
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                                            <DialogHeader>
                                                <DialogTitle>Editar Veículo</DialogTitle>
                                            </DialogHeader>

                                            <form onSubmit={handleSubmit(onUpdateSubmit)} className="space-y-6">
                                                {/* Basic Information */}
                                                <div className="space-y-4">
                                                    <h3 className="text-lg font-semibold">Informações Básicas</h3>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        {/* Brand */}
                                                        <div className="space-y-2">
                                                            <Label>Marca *</Label>
                                                            <Controller
                                                                name="brand"
                                                                control={control}
                                                                render={({ field }) => (
                                                                    <Select
                                                                        value={field.value}
                                                                        onValueChange={(value) => {
                                                                            const selectedBrand = brandsList.find(
                                                                                (b) => b.brandName === value
                                                                            );
                                                                            setSelectedBrand(selectedBrand);
                                                                            setValue("brand", value);
                                                                        }}
                                                                    >
                                                                        <SelectTrigger>
                                                                            <SelectValue placeholder="Selecione a marca" />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            {brandsList.map((brandItem, index) => (
                                                                                <SelectItem key={index} value={brandItem.brandName}>
                                                                                    {brandItem.brandName}
                                                                                </SelectItem>
                                                                            ))}
                                                                        </SelectContent>
                                                                    </Select>
                                                                )}
                                                            />
                                                            {errors.brand && (
                                                                <p className="text-red-500 text-sm">{errors.brand.message}</p>
                                                            )}
                                                        </div>

                                                        {/* Model */}
                                                        <div className="space-y-2">
                                                            <Label>Modelo *</Label>
                                                            <Controller
                                                                name="model"
                                                                control={control}
                                                                render={({ field }) => (
                                                                    <Select
                                                                        value={field.value}
                                                                        onValueChange={(value) => setValue("model", value)}
                                                                        disabled={!selectedBrand}
                                                                    >
                                                                        <SelectTrigger>
                                                                            <SelectValue placeholder="Selecione o modelo" />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            {selectedBrand?.models.map((model, index) => (
                                                                                <SelectItem key={index} value={model.modelName}>
                                                                                    {model.modelName}
                                                                                </SelectItem>
                                                                            ))}
                                                                        </SelectContent>
                                                                    </Select>
                                                                )}
                                                            />
                                                            {errors.model && (
                                                                <p className="text-red-500 text-sm">{errors.model.message}</p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        {/* Condition */}
                                                        <div className="space-y-2">
                                                            <Label>Condição *</Label>
                                                            <Controller
                                                                name="condition"
                                                                control={control}
                                                                render={({ field }) => (
                                                                    <Select
                                                                        value={field.value}
                                                                        onValueChange={(value) => setValue("condition", value === "Novo" ? "Novo" : "Usado")}
                                                                    >
                                                                        <SelectTrigger>
                                                                            <SelectValue placeholder="Selecione a condição" />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            <SelectItem value="Novo">Novo</SelectItem>
                                                                            <SelectItem value="Usado">Usado</SelectItem>
                                                                        </SelectContent>
                                                                    </Select>
                                                                )}
                                                            />
                                                            {errors.condition && (
                                                                <p className="text-red-500 text-sm">{errors.condition.message}</p>
                                                            )}
                                                        </div>

                                                        {/* Vehicle Type */}
                                                        <div className="space-y-2">
                                                            <Label>Tipo de Veículo *</Label>
                                                            <Controller
                                                                name="vehicleType"
                                                                control={control}
                                                                render={({ field }) => (
                                                                    <Select
                                                                        value={field.value}
                                                                        onValueChange={(value) => setValue("vehicleType", value === "car" ? "car" : "moto")}
                                                                    >
                                                                        <SelectTrigger>
                                                                            <SelectValue placeholder="Selecione o tipo" />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            <SelectItem value="car">🚗 Carro</SelectItem>
                                                                            <SelectItem value="moto">🏍️ Moto</SelectItem>
                                                                        </SelectContent>
                                                                    </Select>
                                                                )}
                                                            />
                                                            {errors.vehicleType && (
                                                                <p className="text-red-500 text-sm">{errors.vehicleType.message}</p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        {/* License Plate */}
                                                        <div className="space-y-2">
                                                            <Label>Matrícula *</Label>
                                                            <Controller
                                                                name="licensePlate"
                                                                control={control}
                                                                render={({ field }) => (
                                                                    <Input
                                                                        {...field}
                                                                        placeholder="XX-00-00-XX"
                                                                        onChange={(e) => {
                                                                            const formattedValue = formatLicensePlate(e.target.value);
                                                                            field.onChange(formattedValue);
                                                                        }}
                                                                    />
                                                                )}
                                                            />
                                                            {errors.licensePlate && (
                                                                <p className="text-red-500 text-sm">{errors.licensePlate.message}</p>
                                                            )}
                                                        </div>

                                                        {/* Manufacture Year */}
                                                        <div className="space-y-2">
                                                            <Label>Ano de Fabricação *</Label>
                                                            <Controller
                                                                name="manufactureYear"
                                                                control={control}
                                                                render={({ field }) => (
                                                                    <Input
                                                                        {...field}
                                                                        placeholder="2024"
                                                                        maxLength={4}
                                                                    />
                                                                )}
                                                            />
                                                            {errors.manufactureYear && (
                                                                <p className="text-red-500 text-sm">{errors.manufactureYear.message}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Details */}
                                                <div className="space-y-4">
                                                    <h3 className="text-lg font-semibold">Detalhes</h3>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        {/* Price */}
                                                        <div className="space-y-2">
                                                            <Label>Preço *</Label>
                                                            <Controller
                                                                name="price"
                                                                control={control}
                                                                render={({ field }) => (
                                                                    <div className="relative">
                                                                        <Input
                                                                            className="pl-16"
                                                                            placeholder="0,00"
                                                                            value={priceValue}
                                                                            onChange={(e) => {
                                                                                const numbersOnly = e.target.value.replace(/\D/g, '');
                                                                                const numberValue = Number(numbersOnly) / 100;
                                                                                const formattedValue = new Intl.NumberFormat('pt-BR', {
                                                                                    style: 'currency',
                                                                                    currency: 'BRL',
                                                                                }).format(numberValue);

                                                                                setPriceValue(formattedValue.replace('R$', 'AOA'));
                                                                                setValue("price", numberValue.toString());
                                                                            }}
                                                                        />
                                                                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                                                                            AOA
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            />
                                                            {errors.price && (
                                                                <p className="text-red-500 text-sm">{errors.price.message}</p>
                                                            )}
                                                        </div>

                                                        {/* Mileage */}
                                                        <div className="space-y-2">
                                                            <Label>Quilometragem *</Label>
                                                            <Controller
                                                                name="mileage"
                                                                control={control}
                                                                render={({ field }) => (
                                                                    <div className="relative">
                                                                        <Input
                                                                            {...field}
                                                                            className="pr-12"
                                                                            placeholder="0"
                                                                        />
                                                                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                                                                            km
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            />
                                                            {errors.mileage && (
                                                                <p className="text-red-500 text-sm">{errors.mileage.message}</p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Color */}
                                                    <div className="space-y-2">
                                                        <Label>Cor *</Label>
                                                        <Controller
                                                            name="color"
                                                            control={control}
                                                            render={({ field }) => (
                                                                <Select
                                                                    value={field.value}
                                                                    onValueChange={(value) => setValue("color", value)}
                                                                >
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Selecione a cor" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {Colors.map((color) => (
                                                                            <SelectItem key={color.hex} value={color.nome}>
                                                                                <div className="flex items-center space-x-3">
                                                                                    <div
                                                                                        style={{ backgroundColor: color.hex }}
                                                                                        className="w-5 h-5 rounded-full border border-gray-200"
                                                                                    />
                                                                                    <span>{color.nome}</span>
                                                                                </div>
                                                                            </SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>
                                                            )}
                                                        />
                                                        {errors.color && (
                                                            <p className="text-red-500 text-sm">{errors.color.message}</p>
                                                        )}
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        {/* Bar Code */}
                                                        <div className="space-y-2">
                                                            <Label>Código de Barras *</Label>
                                                            <Controller
                                                                name="bar_code"
                                                                control={control}
                                                                render={({ field }) => (
                                                                    <Input
                                                                        {...field}
                                                                        placeholder="Digite o código de barras"
                                                                    />
                                                                )}
                                                            />
                                                            {errors.bar_code && (
                                                                <p className="text-red-500 text-sm">{errors.bar_code.message}</p>
                                                            )}
                                                        </div>

                                                        {/* Internal Code */}
                                                        <div className="space-y-2">
                                                            <Label>Código Interno *</Label>
                                                            <Controller
                                                                name="internal_code"
                                                                control={control}
                                                                render={({ field }) => (
                                                                    <Input
                                                                        {...field}
                                                                        placeholder="Digite o código interno"
                                                                    />
                                                                )}
                                                            />
                                                            {errors.internal_code && (
                                                                <p className="text-red-500 text-sm">{errors.internal_code.message}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Technical Specifications */}
                                                <div className="space-y-4">
                                                    <h3 className="text-lg font-semibold">Especificações Técnicas</h3>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        {/* Fuel */}
                                                        <div className="space-y-2">
                                                            <Label>Combustível *</Label>
                                                            <Controller
                                                                name="fuel"
                                                                control={control}
                                                                render={({ field }) => (
                                                                    <Select
                                                                        value={field.value}
                                                                        onValueChange={(value) => setValue("fuel", value as "Gasolina" | "Diesel" | "Elétrico" | "Híbrido")}
                                                                    >
                                                                        <SelectTrigger>
                                                                            <SelectValue placeholder="Selecione o combustível" />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            <SelectItem value="Gasolina">⛽ Gasolina</SelectItem>
                                                                            <SelectItem value="Diesel">🛢️ Diesel</SelectItem>
                                                                            <SelectItem value="Elétrico">🔋 Elétrico</SelectItem>
                                                                            <SelectItem value="Híbrido">🔄 Híbrido</SelectItem>
                                                                        </SelectContent>
                                                                    </Select>
                                                                )}
                                                            />
                                                            {errors.fuel && (
                                                                <p className="text-red-500 text-sm">{errors.fuel.message}</p>
                                                            )}
                                                        </div>

                                                        {/* Transmission */}
                                                        <div className="space-y-2">
                                                            <Label>Transmissão *</Label>
                                                            <Controller
                                                                name="transmission"
                                                                control={control}
                                                                render={({ field }) => (
                                                                    <Select
                                                                        value={field.value}
                                                                        onValueChange={(value) => setValue("transmission", value as "Manual" | "Automática" | "CVT")}
                                                                    >
                                                                        <SelectTrigger>
                                                                            <SelectValue placeholder="Selecione a transmissão" />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            <SelectItem value="Manual">🎛️ Manual</SelectItem>
                                                                            <SelectItem value="Automática">⚙️ Automática</SelectItem>
                                                                            <SelectItem value="CVT">🔧 CVT</SelectItem>
                                                                        </SelectContent>
                                                                    </Select>
                                                                )}
                                                            />
                                                            {errors.transmission && (
                                                                <p className="text-red-500 text-sm">{errors.transmission.message}</p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        {/* Engine Power */}
                                                        <div className="space-y-2">
                                                            <Label>Potência do Motor *</Label>
                                                            <Controller
                                                                name="enginePower"
                                                                control={control}
                                                                render={({ field }) => (
                                                                    <div className="relative">
                                                                        <Input
                                                                            {...field}
                                                                            className="pr-12"
                                                                            placeholder="150"
                                                                        />
                                                                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                                                                            CV
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            />
                                                            {errors.enginePower && (
                                                                <p className="text-red-500 text-sm">{errors.enginePower.message}</p>
                                                            )}
                                                        </div>

                                                        {/* Location */}
                                                        <div className="space-y-2">
                                                            <Label>Localização *</Label>
                                                            <Controller
                                                                name="location"
                                                                control={control}
                                                                render={({ field }) => (
                                                                    <Input
                                                                        {...field}
                                                                        placeholder="Luanda, Angola"
                                                                    />
                                                                )}
                                                            />
                                                            {errors.location && (
                                                                <p className="text-red-500 text-sm">{errors.location.message}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Description */}
                                                <div className="space-y-2">
                                                    <Label>Descrição *</Label>
                                                    <Controller
                                                        name="description"
                                                        control={control}
                                                        render={({ field }) => (
                                                            <Textarea
                                                                {...field}
                                                                className="min-h-[120px] resize-none"
                                                                placeholder="Descreva as características do veículo..."
                                                            />
                                                        )}
                                                    />
                                                    {errors.description && (
                                                        <p className="text-red-500 text-sm">{errors.description.message}</p>
                                                    )}
                                                </div>

                                                {/* Form Actions */}
                                                <div className="flex justify-end space-x-4 pt-4">
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() => setIsEditDialogOpen(false)}
                                                    >
                                                        Cancelar
                                                    </Button>
                                                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                                                        Atualizar Veículo
                                                    </Button>
                                                </div>
                                            </form>
                                        </DialogContent>
                                    </Dialog>

                                    {/* Delete Button */}
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

