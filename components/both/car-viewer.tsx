'use client'

import { FC, useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaComment } from 'react-icons/fa';
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
import { Star, Wallet } from "lucide-react"
// Dados Mockados
const car = {
    vehicleId: '1',
    brand: 'Toyota',
    model: 'Corolla',
    description: 'Um carro confortável e confiável, perfeito para a cidade e viagens longas.',
    price: '20,000',
    gallery: ['/images/audi.png', '/images/carro-7.png', '/images/carro-6.png'],
};

const user = {
    userId: '2',
    type: 'customer', // Pode ser 'seller' ou 'customer'
};

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

export function CarouselSpacing() {
    return (
        <Carousel
            opts={{
                align: "start",
            }}
            className="w-full max-w-sm"
        >
            <CarouselContent>
                {Array.from({ length: 5 }).map((_, index) => (
                    <CarouselItem key={index} className="md:basis-1/2 basis-1/3">
                        <div className="p-1">
                            <Card>
                                <CardContent className="flex aspect-square items-center justify-center p-6">
                                    <span className="text-3xl font-semibold">{index + 1}</span>
                                </CardContent>
                            </Card>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
    )
}


const CarViewer: FC<{ onDelete?: (item: Vehicle) => void, vehicle: Vehicle, user: { name: string, email: string, uid: string }, onUpdate: (item: Vehicle) => void, type: "customer" | "seller" | "collaborator" }> = ({ vehicle, user, type, onDelete, onUpdate }) => {
    const router = useRouter()
    const { profile: chatWith } = useUser(vehicle.userId)
    const [isExpanded, setIsExpanded] = useState(false);
    const [image, setImage] = useState<string | null>(null);

    const truncatedDescription = vehicle.description?.length > 200
        ? vehicle.description.slice(0, 200) + '...'
        : vehicle.description;

    const handleRemoveVehicle = useCallback(async () => {
        if (onDelete && vehicle) {
            onDelete(vehicle)
            router.push('/seller/inventory')
        }
    }, [vehicle, onDelete]);

    // const handleUpdateVehicle = useCallback(async () => {
    //     if (onUpdate && vehicle) {
    //         onUpdate(vehicle)
    //     }
    // }, [vehicle, onUpdate]);


    return (
        <div className="flex flex-col items-center h-screen bg-white p-0 mb-32">
            {/* Car Image */}

            <Dialog>
                <DialogTrigger className="w-full h-72 relative">
                    <Image
                        src={(image || vehicle.gallery[0])}
                        alt={`Imagem do ${vehicle.brand} ${vehicle.model}`}
                        width={500}
                        height={300}
                        className="w-full h-full absolute inset-0 object-cover"
                    />
                </DialogTrigger>
                <DialogContent className="w-full max-w-md rounded-none bg-white p-1 shadow-lg">
                    <Image
                        src={(image || vehicle.gallery[0])}
                        alt={`Imagem do ${vehicle.brand} ${vehicle.model}`}
                        width={500}
                        height={300}
                        className="w-full h-72 object-cover"
                    />
                </DialogContent>
            </Dialog>

            {/* Car Details */}
            <div className="w-full max-w-2xl p-4">
                <h1 className="text-2xl font-bold mb-4">
                    {vehicle.brand} {vehicle.model}
                </h1>
                {/* <div className="flex items-center gap-2 mb-4">
                    <span className="text-yellow-500">⭐⭐⭐⭐⭐</span>
                    <span className="text-gray-600">4.8 (86 avaliações)</span>
                </div> */}
                <div className="my-4">
                    <h2 className="text-xl font-semibold mb-2">Descrição</h2>
                    <p className='font-light'>
                        {isExpanded ? vehicle.description : truncatedDescription}
                        {vehicle.description?.length > 200 && (
                            <button
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="text-blue-500 mt-2"
                            >
                                {isExpanded ? 'Ler menos' : 'Ler mais'}
                            </button>
                        )}
                    </p>
                </div>

                <h3 className="text-xl font-semibold mb-2">Galeria de Fotos</h3>
                <Carousel
                    opts={{
                        align: "start",
                    }}
                    className="w-full md:max-w-screen-md z-10"
                >
                    <CarouselContent>
                        {vehicle.gallery.map((galleryImage, index) => (
                            <CarouselItem key={index} className="md:basis-2/6 md:h-max-38 max-h-28 basis-2/6 cursor-pointer" onClick={() => setImage(galleryImage)}>
                                <Image
                                    src={galleryImage}
                                    alt={`Galeria de ${vehicle.brand} ${vehicle.model}`}
                                    width={100}
                                    height={100}
                                    className="w-full h-full rounded-lg object-cover"
                                />
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className='-left-4' />
                    <CarouselNext className='-right-4' />
                </Carousel>
                <br />

                <div className=" mb-4">
                    <div className="flex justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-xl font-bold text-gray-900">{formatCurrency(vehicle.price)}</span>
                        </div>
                        <Drawer>
                            <DrawerTrigger>Mais detalhes</DrawerTrigger>
                            <DrawerContent>
                                <div className='px-6'>
                                    {chatWith && (
                                        <div className="flex items-center gap-4 mt-4">
                                            <Image
                                                src={chatWith?.photo}
                                                alt="Logo da loja"
                                                width={50}
                                                height={50}
                                                className="rounded-md"
                                            />
                                            <div className="space-y-1">
                                                <p className="font-semibold">{chatWith.firstName + ' ' + chatWith.lastName}</p>
                                                <div className="flex items-center gap-1">
                                                    <Star size={16} className="text-yellow-500" />
                                                    <p className="text-sm text-gray-500">{chatWith.phone ?? ''}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Especificações */}
                                    <h3 className="mt-6 text-lg font-bold">Especificações</h3>
                                    <div className="grid grid-cols-2 gap-4 mt-2">
                                        {vehicle.specifications.map((spec, index) => (
                                            <div key={index} className="space-y-1 border flex flex-col items-center py-2 rounded-md">
                                                <p className="text-sm font-semibold">{spec.label}</p>
                                                <p className="text-sm text-gray-500">{spec.description}</p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Price and Action */}
                                    <div className="flex items-center justify-between mt-6">
                                        <div className="flex items-center gap-2">
                                            <p className="text-xl font-bold">{formatCurrency(vehicle.price)}</p>
                                        </div>
                                    </div>
                                </div>
                                <DrawerFooter>
                                    <DrawerClose className='w-full'>
                                        <Button variant="outline" className='w-full'>Fechar detalhes</Button>
                                    </DrawerClose>
                                </DrawerFooter>
                                <br />
                            </DrawerContent>
                        </Drawer>
                    </div>
                </div>

                {type === 'seller' && onDelete && (
                    <div className="flex justify-between">
                        <AlertDialog>
                            <AlertDialogTrigger>
                                <Button>Eliminar do inventário</Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className='max-w-[90%] rounded-md'>
                                <AlertDialogHeader className="px-4">
                                    <AlertDialogTitle className="leading-6">Tem a certeza que deseja apagar este veículo?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Esta açao não pode ser desfeita.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter className="px-4 pb-4">
                                    <AlertDialogCancel className="rounded-3xl py-4">Não, cancela</AlertDialogCancel>
                                    <AlertDialogAction className="rounded-3xl py-4" onClick={handleRemoveVehicle}>Tenho</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>

                        {/* <AlertDialog>
                            <AlertDialogTrigger>
                                <Button variant={"outline"} className='bg-transparent shadow-none px-2'>
                                    <FontAwesomeIcon color='black' icon={faPencilAlt} />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className='max-w-[90%] rounded-md'>
                                <AlertDialogHeader className="px-4">
                                    <AlertDialogTitle className="leading-6">Editar veículo</AlertDialogTitle>
                                    <AlertDialogDescription className="mb-4 space-y-[24px]">
                                        <Input
                                            type="text"
                                            value={vehicle.model}
                                            onChange={(e) => handleVehicleChange('model', e.target.value)}
                                            className="mobile-input"
                                            placeholder="Marca"
                                        />
                                        <Input
                                            type="text"
                                            value={vehicle.brand}
                                            onChange={(e) => handleVehicleChange('brand', e.target.value)}
                                            className="mobile-input"
                                            placeholder="Modelo"
                                        />
                                        <Input
                                            type="text"
                                            value={vehicle.color}
                                            onChange={(e) => handleVehicleChange('color', e.target.value ?? "")}
                                            className="mobile-input"
                                            placeholder="Cor"
                                        />
                                        <Select
                                            value={vehicle.specifications.find(spec => spec.label === 'Combustível')?.description}
                                            onValueChange={(value) => handleVehicleChange("fuel", value as "Gasolina" | "Diesel" | "Elétrico" | "Híbrido")}
                                        >
                                            <SelectTrigger className="mobile-input">
                                                <SelectValue placeholder="Selecione o tipo de 
                                                combustível" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Fruits</SelectLabel>
                                                    <SelectItem value="Gasolina">Gasolina</SelectItem>
                                                    <SelectItem value="Diesel">Diesel</SelectItem>
                                                    <SelectItem value="Elétrico">Elétrico</SelectItem>
                                                    <SelectItem value="Híbrido">Híbrido</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        <Select
                                            value={vehicle.specifications.find(spec => spec.label === 'Transmissão')?.description}
                                            onValueChange={(value) => handleVehicleChange("fuel", value as "Manual" | "Automática" | "CVT")}
                                        >
                                            <SelectTrigger className="mobile-input">
                                                <SelectValue placeholder="Selecione o tipo de 
                                                combustível" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Fruits</SelectLabel>
                                                    <SelectItem value="Manual">Manual</SelectItem>
                                                    <SelectItem value="Automática">Automática</SelectItem>
                                                    <SelectItem value="CVT">CVT</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        <Select
                                            value={vehicle.specifications.find(spec => spec.label === 'Transmissão')?.description}
                                            onValueChange={(value) => handleVehicleChange("fuel", value as "Manual" | "Automática" | "CVT")}
                                        >
                                            <SelectTrigger className="mobile-input">
                                                <SelectValue placeholder="Selecione o tipo de 
                                                combustível" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectLabel>Fruits</SelectLabel>
                                                    <SelectItem value="Manual">Manual</SelectItem>
                                                    <SelectItem value="Automática">Automática</SelectItem>
                                                    <SelectItem value="CVT">CVT</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        <Input
                                            type="text"
                                            value={vehicle.condition}
                                            onChange={(e) => handleVehicleChange('condition', e.target.value ?? "")}
                                            className="mobile-input"
                                            placeholder="Condição"
                                        />
                                        <Input
                                            type="text"
                                            value={vehicle.licensePlate}
                                            onChange={(e) => handleVehicleChange('licensePlate', e.target.value ?? "")}
                                            className="mobile-input"
                                            placeholder="Matrícula"
                                        />
                                        <Input
                                            type="text"
                                            value={vehicle.mileage}
                                            onChange={(e) => handleVehicleChange('mileage', e.target.value ?? "")}
                                            className="mobile-input"
                                            placeholder="Quilometragem"
                                        />
                                        <Input
                                            type="text"
                                            value={vehicle.price}
                                            onChange={(e) => handleVehicleChange('price', e.target.value ?? "")}
                                            className="mobile-input"
                                            placeholder="Preço"
                                        />
                                        <Textarea
                                            value={vehicle.description}
                                            onChange={(e) => handleVehicleChange('description', e.target.value ?? "")}
                                            className="mobile-input"
                                            placeholder="Descrição"
                                        />
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter className="px-4 pb-4">
                                    <AlertDialogCancel className="rounded-3xl py-4">Cancela</AlertDialogCancel>
                                    <AlertDialogAction className="rounded-3xl py-4" onClick={handleUpdateVehicle}>Salvar</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog> */}

                    </div>

                )}
            </div>
        </div>
    );
};

export default CarViewer;
