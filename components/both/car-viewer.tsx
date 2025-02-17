'use client'

import { FC, useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaComment } from 'react-icons/fa';
import { Vehicle } from '@/models/vehicle';
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


const CarViewer: FC<{ onDelete?: (item: Vehicle) => void, vehicle: Vehicle, user: { name: string, email: string, uid: string }, type: "costumer" | "seller" }> = ({ vehicle, user, type, onDelete }) => {
    const { addVehicle } = useShoppingCart(user.uid)
    const { actions } = useWishlist(user.uid)
    const { profile: chatWith } = useUser(vehicle.userId)
    const [isExpanded, setIsExpanded] = useState(false);
    const [image, setImage] = useState<string | null>(null);

    const truncatedDescription = vehicle.description.length > 200
        ? vehicle.description.slice(0, 200) + '...'
        : vehicle.description;

    const handleAddToWishlist = useCallback(async () => {
        await actions.addOnWishList(vehicle)
    }, [vehicle, actions]);

    const handleAddToCart = useCallback(async () => {
        await addVehicle(vehicle)
        console.log('Adicionado ao carrinho');
    }, [vehicle, addVehicle]);

    return (
        <div className="flex flex-col items-center bg-white p-0 mb-32">

            {/* Car Image */}
            <Image
                src={(image || vehicle.gallery[0])}
                alt={`Imagem do ${vehicle.brand} ${vehicle.model}`}
                width={500}
                height={300}
                className="w-full h-72 object-cover"
            />

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
                        {vehicle.description.length > 200 && (
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
                    className="w-full max-w-sm z-10"
                >
                    <CarouselContent>
                        {vehicle.gallery.map((galleryImage, index) => (
                            <CarouselItem key={index} className="md:basis-1/2 basis-1/3 cursor-pointer" onClick={() => setImage(galleryImage)}>
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

                {type === 'costumer' && chatWith?.photo && (
                    <div className='flex items-center justify-between w-full'>
                        <div className="flex items-start gap-2 mb-6">
                            <Image
                                src={chatWith.photo}
                                alt="Foto do vendedor"
                                width={50}
                                height={50}
                                className="rounded-full"
                            />
                            <div>
                                <p className="font-semibold">{chatWith.firstName} {chatWith.lastName}</p>
                                <p className="text-gray-500">Conta Oficial</p>
                            </div>
                        </div>
                        <button>
                            <FaComment size={24} />
                        </button>
                    </div>
                )}

                <div className=" mb-4">
                    <div className="flex justify-between">
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-700">AOA</span>
                            <span className="text-xl font-bold text-gray-900">{vehicle.price},00</span>
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
                                            <span className="px-1 py-0.5 text-xs font-bold bg-gray-100">AOA</span>
                                            <p className="text-xl font-bold">{vehicle.price},00</p>
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
                    <br />
                    {type === "costumer" && (
                        <AlertDialog>
                            <AlertDialogTrigger className="px-6 py-2 bg-blue-500 text-white w-full rounded">Adicionar a lista de desejos</AlertDialogTrigger>
                            <AlertDialogContent className='max-w-[90%] rounded-md'>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Deseja adicionar <strong>{vehicle.brand} {vehicle.model} </strong>a lista de desejos?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Esta operação pode ser desfeita ao eliminar o veículo de sua lista
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancele</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleAddToWishlist}>Adicione</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}
                </div>

                {type === 'costumer' && (
                    <AlertDialog>
                        <AlertDialogTrigger className="w-full py-2 bg-green-500 text-white rounded mt-4">Adicionar no carrinho</AlertDialogTrigger>
                        <AlertDialogContent className='max-w-[90%] rounded-md'>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Deseja adicionar <strong>{vehicle.brand} {vehicle.model} </strong>ao seu carrinho de compras?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Esta operação pode ser desfeita ao eliminar o veículo de sua lista
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancele</AlertDialogCancel>
                                <AlertDialogAction onClick={handleAddToCart}>Adicione</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                )}

                {type === 'seller' && onDelete && (
                    <AlertDialog>
                        <AlertDialogTrigger>
                            <Button onClick={() => onDelete(vehicle)}>Eliminar do inventário</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className='max-w-[90%] rounded-md'>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Deseja adicionar <strong>{vehicle.brand} {vehicle.model} </strong>ao seu carrinho de compras?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Esta operação pode ser desfeita ao eliminar o veículo de sua lista
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancele</AlertDialogCancel>
                                <AlertDialogAction onClick={handleAddToCart}>Adicione</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                )}
            </div>
        </div>
    );
};

export default CarViewer;
