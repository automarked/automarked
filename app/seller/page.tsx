'use client'

import React, { useEffect, useState } from 'react';
import { formatCurrency } from '@/scripts/format-price';
import { FaCar, FaPlus } from 'react-icons/fa';
import useInventory from '@/hooks/useInventory';
import { LayoutDashboard } from 'lucide-react';
import SearchInput from '@/components/both/input-search';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { BarChart } from "lucide-react";
import { MdOutlineSell, MdOutlineInventory } from "react-icons/md";
import { useAuth } from '@/contexts/AuthContext';
import StatCard from '@/components/both/stat-card';
import LineChartCard from '@/components/charts/LineChartCard';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Card } from '@/components/ui/card';
import Autoplay from "embla-carousel-autoplay"
import { useUser } from '@/contexts/userContext';
import { MdManageAccounts } from "react-icons/md";
import CarBrandsGrid from '@/components/brands-grid';
import ScrollableTabs from '@/components/scrollable-tabs';
import FilterModal from '@/components/filter-modal';
import useBrands from '@/hooks/useBrands';
import Loader from '@/components/loader';

interface IFilterByPrice {
    moreThan: number;
    lessThan: number;
}

interface IAdvancedFilterProps {
    brand: string;
    condiction: string;
    price: IFilterByPrice
    orderBy: string;
}

const SellerDashboard = () => {
    const [input, setInput] = useState('')
    const { brandsList } = useBrands()
    const [activeBrand, setActiveBrand] = useState('Todos');
    const [isLoading, setIsLoading] = useState(false)
    const [carCondition, setCarCondition] = useState<"Usado" | "Novo" | "Todos">("Todos")

    const [orderBy, setOrderBy] = useState<"price" | "brand" | "all">("all")
    const [price, setPrice] = useState<{ moreThan: number, lessThan: number }>({
        moreThan: 10,
        lessThan: 200
    })

    const [filterBy, setFilterBy] = useState<IAdvancedFilterProps | undefined>()

    const [filters, setFilters] = useState({
        brand: "",
        condiction: "",
        price: {
            moreThan: 10,
            lessThan: 200,
        },
        orderBy: "",
    });

    const handleBrandChange = (value: string) => {
        setActiveBrand(value)
        setFilters((prev) => ({ ...prev, brand: value }));
    };

    const handleCondictionChange = (value: string) => {
        setCarCondition(value as "Usado" | "Novo" | "Todos")
        setFilters((prev) => ({ ...prev, condiction: value }));
    };

    const handlePriceChange = ([moreThan, lessThan]: [number, number]) => {
        setPrice({
            moreThan,
            lessThan
        })
        setFilters((prev) => ({ ...prev, price: { moreThan, lessThan } }));
    };

    const handleOrderByChange = (value: string) => {
        setOrderBy(value as "price" | "brand" | "all")
        setFilters((prev) => ({ ...prev, orderBy: value }));
    };

    useEffect(() => {
        setIsLoading(true)
        setTimeout(() => {
            setIsLoading(false)
        }, 2000)
    }, [filterBy, filters])

    const handleApply = () => {
        console.log(filters);
        setFilterBy(filters)
    }

    const props = {
        brand: {
            brandsList,
            filters: {
                activeBrand,
                handleBrandChange
            }
        },
        condition: {
            conditionList: ["Usado", "Novo"],
            filters: {
                activeCondition: carCondition,
                handleConditionChange: handleCondictionChange
            }
        },
        orderBy: {
            orderByList: ["popular", "recent", "all"],
            filters: {
                activeOrder: orderBy,
                handleOrderByChange
            }
        },
        price: {
            min: price.moreThan,
            max: price.lessThan,
            handlePriceChange: ([moreThan, lessaThan]: [number, number]) => handlePriceChange([moreThan, lessaThan])
        },
        reset: () => {
            setFilters({
                brand: "",
                condiction: "",
                price: {
                    moreThan: 10,
                    lessThan: 200,
                },
                orderBy: "",
            });

            setActiveBrand("Todos")
            setCarCondition(
                "Todos"
            )
            setOrderBy("all")
        },
        handleApply
    }

    return (
        <>
            <div className="p-2 md:p-6 pb-32 pt-0 h-screen">
                <div className='w-full flex md:hidden mb-4'>
                    <SearchInput setValue={setInput} value={input} />
                </div>
                <div className='flex justify-between mb-2'>
                    <strong className='font-bold text-lg'>
                        Ofertas Especiais
                    </strong>
                    <a href="" className="font-bold text-lg">Ver tudo</a>
                </div>
                <Carousel className="w-full mb-8"
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
                                        <img src="/images/banner1.jpeg" className='w-full h-full object-cover' />
                                    )}
                                    {index % 2 === 0 && (
                                        <img src="/images/banner2.jpeg" className='w-full h-full object-cover' />
                                    )}
                                </Card>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className='-left-2' />
                    <CarouselNext className='-right-2' />
                </Carousel>
                {isLoading && (
                    <div className='w-full h-screen flex items-start justify-center'>
                        <Loader />
                    </div>
                )}
                {!isLoading && (
                    <>
                        <CarBrandsGrid />
                        <div className='flex justify-between mb-2 mt-10 px-2'>
                            <div className='flex gap-2'>
                                <strong className='font-bold text-lg'>
                                    Principais ofertas
                                </strong>
                                <FilterModal {...props} />
                            </div>
                            <Link href="/seller/cars/all" className='font-bold text-lg'>Ver tudo</Link>
                        </div>
                        <ScrollableTabs filters={filterBy} />
                    </>
                )}
                <div className="h-32" />
            </div>
        </>
    );
};

export default SellerDashboard;
