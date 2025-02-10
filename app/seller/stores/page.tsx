'use client'

import SearchInput from "@/components/both/input-search";
import { useMaterialLayout } from "@/contexts/LayoutContext";
import { useShoppingCart } from "@/contexts/ShoppingCartContext";
import { Building2, LayoutDashboard, List, Menu, ShoppingCart, ShoppingCartIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Autoplay from "embla-carousel-autoplay"
import CarBrandsGrid from "@/components/brands-grid";
import Slideshow from "@/components/ui/seller/dots-slide-show";
import ScrollableTabs from "@/components/scrollable-tabs";
import Link from "next/link";
import { formatCurrency } from "@/scripts/format-price";
import { NotificationCard } from "@/components/both/notification-card";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/contexts/userContext";
import { apiBaseURL } from "@/constants/api";
import { useRouter } from "next/navigation";
import Loader from "@/components/loader";
import Image from "next/image";

export default function ShoppingCartPage() {
    const { toggleSidebar } = useMaterialLayout()
    const { vehicles, totalCartValue } = useShoppingCart()
    const [text, setText] = useState('')
    const [visualizationMode, setVisualizationMode] = useState<"grid" | "flex">("grid")
    const { getUsersByProfileType, stores, isLoadingStores } = useUser()

    const router = useRouter()

    useEffect(() => {
        (async () => {
            getUsersByProfileType("seller")
        })()
    }, [])

    return (
        <div className="h-screen">
            <div className="relative w-full p-2">
                <div className="">
                    <SearchInput className="bg-[#1e293b]" value={text} setValue={setText} />
                </div>
            </div>
            {/* <CarBrandsGrid /> */}

            <div className="p-2 ">
                {!text.trim() && (
                    <Carousel className="w-full"
                        plugins={[
                            Autoplay({
                                delay: 2000,
                            }),
                        ]}
                    >
                        <CarouselContent>
                            {Array.from({ length: 5 }).map((_, index) => (
                                <CarouselItem key={index}>
                                    <Card className='h-[200px] overflow-hidden shadow-none'>
                                        {index % 2 !== 0 && (

                                            <Image alt="" width={100} height={100} src="/images/banner1.jpeg" className='w-full h-full object-cover' />
                                        )}
                                        {index % 2 === 0 && (

                                            <Image alt="" width={100} height={100} src="/images/banner2.jpeg" className='w-full h-full object-cover' />
                                        )}
                                    </Card>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className='-left-2' />
                        <CarouselNext className='-right-2' />
                    </Carousel>
                )}

                {isLoadingStores && (
                    <div className='w-full h-screen flex items-start justify-center'>
                        <Loader />
                    </div>
                )}
                {!isLoadingStores && (
                    <>
                        <div data-search={!text.trim()} className='flex justify-between mb-2 data-[search=true]:mt-10 px-2'>
                            <div className="flex justify-between mb-8">
                                <h2 className="monserrat text-xl font-bold">({stores.length}) Lojas</h2>
                                <div className="flex items-center space-x-4">

                                </div>
                            </div>

                            {visualizationMode === "flex" && (
                                <div onClick={() => {
                                    setVisualizationMode(prev => prev === "grid" ? "flex" : "grid")
                                }} className="w-10 h-10 cursor-pointer rounded-full flex justify-center items-center hover:bg-slate-200">
                                    <LayoutDashboard />
                                </div>
                            )}
                            {visualizationMode === "grid" && (
                                <div onClick={() => {
                                    setVisualizationMode(prev => prev === "grid" ? "flex" : "grid")
                                }} className="w-10 h-10 cursor-pointer rounded-full flex justify-center items-center hover:bg-slate-200">
                                    <List />
                                </div>
                            )}
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-32">
                            {!text.trim() && stores.map((store) => (
                                <div onClick={() => router.push(`/seller/stores/${store.userId}`)} className="flex-1 cursor-pointer border relative overflow-hidden h-64 rounded-2xl">
                                    <div className="h-28 w-full absolute top-0 left-0  bg-[#1e293b]" style={{ backgroundImage: `url(${store.background})`, backgroundSize: "cover", backgroundPosition: "center" }}>

                                        <div className="mx-auto mt-14 bg-white w-24 h-24 rounded-full p-2">
                                            {store.photo ? (
                                                <Image alt="" width={100} height={100} src={store.photo} className="rounded-full w-full h-full object-cover" />

                                            ) : (
                                                <div className="bg-slate-300 w-full h-full rounded-full p-2 flex justify-center items-center text-slate-700">
                                                    <Building2 size={28}/>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-center pt-40 flex flex-col justify-center">
                                        <strong className="font-bold">{store.companyName}</strong>
                                        <div>
                                            <Badge>{store.email}</Badge>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {text.trim() && stores.filter(store => `
                                ${store.bankName} 
                                ${store.companyName} 
                                ${store.email} 
                            `
                                .toLowerCase()
                                .includes(
                                    text.toLowerCase()
                                )).map((store) => (
                                    <div onClick={() => router.push(`/seller/stores/${store.companyId}`)} className="flex-1 cursor-pointer border relative overflow-hidden h-64 rounded-2xl">
                                        <div className="h-28 w-full absolute top-0 left-0  bg-[#1e293b]" style={{ backgroundImage: `url(${store.background})`, backgroundSize: "cover", backgroundPosition: "center" }}>
                                            <div className="mx-auto mt-14 bg-white w-24 h-24 rounded-full">
                                                <Image alt="" width={100} height={100} src={store.background || "/images/default-background.jpeg"} className="rounded-full w-full h-full object-cover" />
                                            </div>
                                        </div>
                                        <div className="text-center pt-40 flex flex-col justify-center">
                                            <strong className="font-bold">{store.companyName}</strong>
                                            <div>
                                                <Badge>{store.email}</Badge>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}