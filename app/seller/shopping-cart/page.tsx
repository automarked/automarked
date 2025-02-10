'use client'

import SearchInput from "@/components/both/input-search";
import { useMaterialLayout } from "@/contexts/LayoutContext";
import { useShoppingCart } from "@/contexts/ShoppingCartContext";
import { LayoutDashboard, List, Menu, ShoppingCart, ShoppingCartIcon } from "lucide-react";
import { useState } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Autoplay from "embla-carousel-autoplay"
import CarBrandsGrid from "@/components/brands-grid";
import Slideshow from "@/components/ui/seller/dots-slide-show";
import ScrollableTabs from "@/components/scrollable-tabs";
import Link from "next/link";
import { formatCurrency } from "@/scripts/format-price";
import { useSalesContext } from "@/contexts/SalesContext";
import { useRouter } from "next/navigation";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge";

export default function ShoppingCartPage() {
    const { toggleSidebar } = useMaterialLayout()
    const { vehicles, totalCartValue } = useShoppingCart()
    const [text, setText] = useState('')
    const [visualizationMode, setVisualizationMode] = useState<"grid" | "flex">("grid")
    const { sales } = useSalesContext()
    const router = useRouter()


    const saleState = {
        "pending": "Pendente",
        "confirmed": "Continuar compra",
        "completed": "Compra concluída",
        "cancelled": "Pedido rejeitado"
    }


    return (
        <div className="h-screen">
            <div className="relative w-full h-40 p-2">
                <div className="flex justify-between mb-8">
                    <h2 className="monserrat text-xl font-bold">Carrinho</h2>
                    <div className="flex items-center space-x-4">
                        {/*  <div className="relative cursor-pointer">
                            <ShoppingCart />
                            {vehicles.length > 0 && (
                                <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                                    {vehicles.length}
                                </div>
                            )}
                        </div>
                        <Menu className='cursor-pointer' size={24} onClick={() => toggleSidebar()} /> */}
                    </div>
                </div>
                <div className="">
                    <SearchInput className="bg-[#1e293b]" value={text} setValue={setText} />
                </div>
            </div>
            {/* <CarBrandsGrid /> */}

            <div className="p-2">
                {!text.trim() && (
                    <Card className="shadow-none bg-[#1e293b]">
                        <CardHeader className="flex w-full relative justify-between">
                            <div className="block">
                                <CardTitle className="font-normal block text-slate-100">Total do carrinho (AOA)</CardTitle>
                            </div>
                            <div className="absolute top-3 right-8 cursor-pointer">
                                <ShoppingCart color="#fff" />
                                {vehicles.length > 0 && (
                                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                                        {vehicles.length}
                                    </div>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="">
                            <h1 className="text-3xl font-extrabold text-slate-100">{formatCurrency(totalCartValue).split('A')[2]}</h1>
                        </CardContent>
                    </Card>
                )}
                <div data-search={!text.trim()} className='flex justify-between mb-2 data-[search=true]:mt-10 px-2'>
                    <strong className='font-bold text-lg'>
                        Meus produtos
                    </strong>

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
                <ScrollableTabs cars={vehicles} searchOnList={text} visualizationMode={visualizationMode} />
                <div className="mt-10 mb-4">
                    <div className="mb-4">
                        <strong className='font-bold text-lg'>
                            Minhas compras
                        </strong>
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nº</TableHead>
                                <TableHead>Produto</TableHead>
                                <TableHead>Preço</TableHead>
                                <TableHead className="text-right">Estado</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sales?.map((sale, index) => (
                                <TableRow
                                    key={index}
                                    className={`text-slate-900 font-bold text-xs cursor-pointer ${index % 2 === 0 ? 'bg-slate-100 hover:bg-white' : 'bg-white hover:bg-slate-100'}`}
                                    onClick={() => {
                                        router.push("/seller/shopping-cart/" + sale.vehicle.licensePlate);
                                    }}
                                >
                                    <TableCell className="font-medium">{index + 1}</TableCell>
                                    <TableCell>{sale.vehicle.brand + " " + sale.vehicle.model}</TableCell>
                                    <TableCell>{formatCurrency(sale.price ?? '')}</TableCell>

                                    <TableCell className="text-right">
                                        {sale.state === 'pending' && <Badge className="text-orange-600 font-light border-orange-300 bg-orange-50" variant={"outline"}>{saleState[sale.state]}</Badge>
                                        }
                                        {sale.state === 'cancelled' && <Badge className="text-red-600 font-light border-red-300 bg-red-50" variant={"outline"}>{saleState[sale.state]}</Badge>
                                        }
                                        {sale.state === 'confirmed' && <Badge className="text-green-600 font-light border-green-300 bg-green-50" variant={"outline"}>{saleState[sale.state]}</Badge>
                                        }
                                        {sale.state === 'completed' && <Badge className="text-red-600 font-light border-red-300 bg-red-50" variant={"outline"}>{saleState[sale.state]}</Badge>
                                        }</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div >
    )
}