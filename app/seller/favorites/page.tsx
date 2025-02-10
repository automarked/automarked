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
import { useAuth } from "@/contexts/AuthContext";
import { MdFavorite } from "react-icons/md";
import { useWishlist } from "@/contexts/WishListContext";

export default function ShoppingCartPage() {
    const { toggleSidebar } = useMaterialLayout()
    const { user } = useAuth()
    const { wishList } = useWishlist()
    const [text, setText] = useState('')
    const [visualizationMode, setVisualizationMode] = useState<"grid" | "flex">("grid")
    return (
        <div className="h-screen">
            <div className="relative w-full h-40 p-2">
                <div className="flex justify-between mb-8">
                    <h2 className="monserrat text-xl font-bold flex items-center gap-2"> <MdFavorite /> Meus favoritos</h2>
                    <div className="flex items-center space-x-4">
                        
                    </div>
                </div>
                <div className="-mt-4">
                    <SearchInput className="bg-[#1e293b]" value={text} setValue={setText} />
                </div>
            </div>
            {/* <CarBrandsGrid /> */}

            <div className="p-2 -mt-16">
                
                <div data-search={!text.trim()} className='flex justify-between mb-2 data-[search=true]:mt-10 px-2'>
                    <strong className='font-bold text-lg'>
                        Produtos
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
                <ScrollableTabs cars={wishList} searchOnList={text} visualizationMode={visualizationMode} />
                <div className="mt-24"></div>
            </div>
        </div>
    )
}