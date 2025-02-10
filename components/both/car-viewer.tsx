'use client'

import { FC, useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaComment } from 'react-icons/fa';
import { Vehicle } from '@/models/vehicle';
import { apiBaseURL } from '@/constants/api';
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
import { Heart, MessageSquareText, ShoppingCart, Star, User, Wallet } from "lucide-react"

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
import { InventoryItem } from '@/models/inventory';
import { useRouter } from 'next/navigation';
import { useWishlist } from '@/contexts/WishListContext';
import { useShoppingCart } from '@/contexts/ShoppingCartContext';
import { formatCurrency } from '@/scripts/format-price';
import { log } from 'console';
import { Dialog, DialogContent } from '../ui/dialog';
import { DialogTrigger } from '@radix-ui/react-dialog';

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


const CarViewer: FC<{ onDelete?: (item: Vehicle) => void, vehicle: Vehicle, user: { name: string, email: string, uid: string }, type: "costumer" | "seller" }> = ({
    vehicle, user, type, onDelete
}) => {
    const { addVehicle, removeVehicle, getFromShoppingCart } = useShoppingCart()
    const { addOnWishList, deleteFromWishList, getFrom } = useWishlist()
    console.log(vehicle)
    const { profile: chatWith } = useUser(vehicle.userId)
    const [isExpanded, setIsExpanded] = useState(false);
    const [image, setImage] = useState<string | null>(null);
    const router = useRouter()
    const [isInWishList, setIsInWishList] = useState(false)
    const [isInShoppingCart, setIsInShoppingCart] = useState(false)

    const checkVehicleInWishList = () => {
        setIsInWishList(getFrom(vehicle.licensePlate))
    }

    const checkVehicleInShoppingCart = () => {
        setIsInShoppingCart(getFromShoppingCart(vehicle.licensePlate))
    }

    useEffect(() => {
        checkVehicleInWishList()
        checkVehicleInShoppingCart()
    }, [])

    const truncatedDescription = vehicle.description.length > 200
        ? vehicle.description.slice(0, 200) + '...'
        : vehicle.description;

    const handleRemoveFromWishlist = useCallback(async () => {
        setIsInWishList(false)
        await deleteFromWishList(vehicle.vehicleId)
    }, [vehicle]);

    const handleAddToWishlist = useCallback(async () => {
        setIsInWishList(true)
        await addOnWishList(vehicle)
    }, [vehicle]);

    const handleAddToCart = useCallback(async () => {
        setIsInShoppingCart(true)
        await addVehicle(vehicle)
    }, [vehicle]);

    const handleRemoveFromCart = useCallback(async () => {
        setIsInShoppingCart(false)
        await removeVehicle(vehicle.licensePlate)
    }, [vehicle]);

    return (
        <div className="flex flex-col items-center bg-white p-0 mb-32">


            {/* Car Image */}
            <Dialog>
                <DialogTrigger>
                    <Image
                        src={(image || vehicle.gallery[0])}
                        alt={`Imagem do ${vehicle.brand} ${vehicle.model}`}
                        width={500}
                        height={300}
                        className="w-full h-72 object-cover"
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
                <div className='flex justify-between items-center gap-8 mb-4'>
                    <h1 className="text-2xl font-bold">
                        {vehicle.brand} {vehicle.model}
                    </h1>

                    <div className='flex gap-4'>
                        <button onClick={isInWishList ? handleRemoveFromWishlist : handleAddToWishlist} className="px-6 py-2 rounded-full border w-14 h-14">
                            {isInWishList ? (
                                <Heart fill='red' color='red' className='justify-self-center' />
                            ) : (
                                <Heart className='justify-self-center' />
                            )}
                        </button>

                        <button onClick={isInShoppingCart ? handleRemoveFromCart : handleAddToCart} className="px-6 py-2 rounded-full border w-14 h-14">
                            {isInShoppingCart ? (
                                <ShoppingCart fill='orange' color='orange' className='justify-self-center' />
                            ) : (
                                <ShoppingCart className='justify-self-center' />
                            )}
                        </button>

                    </div>
                </div>
                <div className="flex items-center gap-2 mb-4">
                    <span className="text-yellow-500">⭐⭐⭐⭐⭐</span>
                    <span className="text-gray-600">4.8 (86 avaliações)</span>
                </div>
                <div className="mb-4">
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
                    className="w-full z-10"
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

                {/* {chatWith?.photo && ( */}
                <div onClick={() => {
                    router.push(`/seller/chat/${chatWith?.userId}`)
                }} className='flex items-center justify-between w-full bg-white shadow-md my-2 p-4 border-2 rounded-2xl'>
                    <div className="flex gap-2 ">

                        {chatWith?.photo ? (
                            <Image
                                src={chatWith.photo}
                                alt="Foto do vendedor"
                                width={50}
                                height={50}
                                className="rounded-full object-cover h-12 w-12 border-2 border-black p-0.5"
                            />

                        ) : (
                            <div className="bg-slate-300 rounded-full h-12 w-12 border-2 border-gray-500 p-0.5 flex justify-center items-center text-slate-700">
                                <User width={24} height={24} />
                            </div>
                        )}
                        <div>
                            <p className="font-semibold">{chatWith?.firstName} {chatWith?.lastName}</p>
                            <p className="text-gray-500">Conta Oficial</p>
                        </div>
                    </div>
                    <button>
                        <MessageSquareText width={28} height={28} />
                    </button>
                </div>
                {/* )} */}

                <div className=" mb-4 mt-4">
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
                                            {chatWith?.photo ? (
                                                <Image
                                                    src={chatWith?.photo}
                                                    alt="Logo da loja"
                                                    width={100}
                                                    height={100}
                                                    className="rounded-md"
                                                />

                                            ) : (
                                                <div className="bg-slate-300 rounded-md p-2 flex justify-center items-center text-slate-700">
                                                    <User width={24} height={24} />
                                                </div>
                                            )}
                                            <div className="space-y-1">
                                                <p className="font-semibold">{chatWith.firstName + ' ' + chatWith.lastName}</p>
                                                <div className="flex items-center gap-1">
                                                    <Star size={16} className="text-yellow-500" />
                                                    <p className="text-sm text-gray-500">5.0 - 14 reviews</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Especificações */}
                                    <h3 className="mt-6 text-lg font-bold">Especificações</h3>
                                    <div className="grid grid-cols-2 gap-4 mt-2">
                                        <div className="space-y-1 border flex flex-col items-center py-2 rounded-md">
                                            <p className="text-sm font-semibold">Marca</p>
                                            <p className="text-sm text-gray-500">{vehicle.brand}</p>
                                        </div>
                                        <div className="space-y-1 border flex flex-col items-center py-2 rounded-md">
                                            <p className="text-sm font-semibold">Modelo</p>
                                            <p className="text-sm text-gray-500">{vehicle.model}</p>
                                        </div>
                                        <div className="space-y-1 border flex flex-col items-center py-2 rounded-md">
                                            <p className="text-sm font-semibold">Cor</p>
                                            <p className="text-sm text-gray-500">{vehicle.color}</p>
                                        </div>
                                        <div className="space-y-1 border flex flex-col items-center py-2 rounded-md">
                                            <p className="text-sm font-semibold">Condição</p>
                                            <p className="text-sm text-gray-500">{vehicle.condition}</p>
                                        </div>
                                        <div className="space-y-1 border flex flex-col items-center py-2 rounded-md">
                                            <p className="text-sm font-semibold">Quilometragem</p>
                                            <p className="text-sm text-gray-500">{vehicle.mileage}</p>
                                        </div>
                                        <div className="space-y-1 border flex flex-col items-center py-2 rounded-md">
                                            <p className="text-sm font-semibold">Matrícula</p>
                                            <p className="text-sm text-gray-500">{vehicle.licensePlate}</p>
                                        </div>
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

                                        <Button
                                            className="w-[40%] max-w-md py-6 mb-6 bg-black text-white rounded-full text-lg font-medium"
                                            onClick={() => {
                                                router.push("/seller/shopping-cart/" + vehicle.licensePlate);
                                            }}
                                        >
                                            Comprar
                                            <Wallet size={20} />
                                        </Button>
                                    </div>
                                </div>
                                <DrawerFooter>
                                    <DrawerClose className='w-full'>
                                        <Button variant="outline" className="w-full max-w-md py-6 mb-6 bg-black text-white rounded-full text-lg font-medium">Fechar detalhes</Button>
                                    </DrawerClose>
                                </DrawerFooter>
                                <br />
                            </DrawerContent>
                        </Drawer>
                    </div>
                    <br />

                </div>




            </div>
        </div>
    );
};

export default CarViewer;
