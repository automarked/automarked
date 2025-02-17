'use client'

import React, { useEffect, useState } from 'react';
import { formatCurrency } from '@/scripts/format-price';
import { FaCar, FaPlus } from 'react-icons/fa';
import { Car, CheckCheckIcon, CircleDotDashed, LayoutDashboard, TicketX } from 'lucide-react';
import SearchInput from '@/components/both/input-search';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { BarChart } from "lucide-react";
import { MdOutlineSell, MdOutlineInventory } from "react-icons/md";
import { useAuth } from '@/contexts/AuthContext';
import StatCard from '@/components/both/stat-card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Card } from '@/components/ui/card';
import Autoplay from "embla-carousel-autoplay"
import { useUser } from '@/contexts/userContext';
import { MdManageAccounts } from "react-icons/md";
import Sale from '@/models/sale';
import { createdInstance } from '@/hooks/useApi';
import { useInventoryContext } from '@/contexts/InventoryContext';


const SellerDashboard = () => {
    const { user } = useAuth()
    const { profile } = useUser(user?.uid ?? '')
    const [input, setInput] = useState('')
    const { getCollaborators, collaborators } = useUser(user?.uid ?? '')
    const { totalInventoryValue, inventory } = useInventoryContext();
    const [sales, setSales] = useState<Sale[]>([])
    const fetchSales = async () => {
        try {
            const response = await createdInstance.get<Sale[]>(`/sales/seller/${user?.uid}`);
            setSales(response.data);
        } catch (error) {
            console.error("Error fetching sales:", error);
        }
    };

    useEffect(() => {
        fetchSales();
    }, []);

    const getTotalQuantitySales = () => {
        var quantitySale = 0;
        for (const sale of sales) {
            if (sale.state === "completed") {
                quantitySale++;
            }
        }

        return quantitySale
    }
    const getTotalSales = () => {
        var totalSales = 0;
        for (const sale of sales) {
            if (sale.state === "completed") {
                totalSales += Number(sale.price)
            }
        }

        return totalSales === 0 ? "AOA 0, 00" : formatCurrency(totalSales);
    }

    const getSalesByState = (state: string) => {
        return sales.filter(sale => sale.state === state).length;
    }

    const stats = [
        {
            title: "Inventário",
            value: formatCurrency(totalInventoryValue),
            description: "Valor total em Stock",
            change: "",
            isPositive: true,
            icon: <FaCar className="w-6 h-6 text-white" />,
        },
        {
            title: "Total das vendas",
            value: getTotalSales(),
            description: "Todas as vendas",
            change: "",
            isPositive: true,
            icon: <BarChart className="w-6 h-6 text-white" />,
        },
        {
            title: "Número de vendas",
            value: getTotalQuantitySales(),
            description: "Todas as vendas",
            change: "",
            isPositive: false,
            icon: <MdOutlineSell className="w-6 h-6 text-white" />,
        },
        {
            title: "Viaturas",
            value: inventory.length,
            description: "Todas as Viaturas em Stock",
            change: "",
            isPositive: true,
            icon: <Car className="w-6 h-6 text-white" />,
        },
        {
            title: "Pedidos confirmados",
            value: getSalesByState("confirmed"),
            description: "Todos os pedidos confirmados",
            change: "",
            isPositive: true,
            icon: <CheckCheckIcon className="text-white w-6 h-6" />,
        },
        {
            title: "Pedidos pendentes",
            value: getSalesByState("pending"),
            description: "Todos os pedidos pendentes",
            change: "",
            isPositive: false,
            icon: <CircleDotDashed className="w-6 h-6 text-white" />,
        },
        {
            title: "Pedidos rejeitados",
            value: getSalesByState("cancelled"),
            description: "Todos os pedidos rejeitados",
            change: "",
            isPositive: true,
            icon: <TicketX className="w-6 h-6 text-white" />,
        },
        {
            title: "Pedidos completados",
            value: getSalesByState("completed"),
            description: "Todos os pedidos completados",
            change: "",
            isPositive: true,
            icon: <MdOutlineInventory className="w-6 h-6 text-white" />,
        },
    ];

    useEffect(() => {
        getCollaborators()
    }, [user])

    return (
        <>
            <div className="p-2 md:p-6 pb-32 pt-0 h-screen">
                <div className='w-full flex md:hidden mb-4'>
                    <SearchInput setValue={setInput} value={input} />
                </div>
                <div className="bg-[var(--orange-dark)] rounded-lg p-4 shadow-xl mb-6">
                    <p className="text-white text-xs">
                        Veja a evolução <strong className="font-semibold">e automação do seu negócio</strong> na AutoMarket!
                    </p>
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
                <div className="grid grid-cols-2">
                    <h2 className="text-lg flex items-center gap-1 font-semibold mb-4 poppins-semibold">
                        <LayoutDashboard size={20} /> Painel
                    </h2>
                    <Link
                        className="w-8 ml-auto h-8 rounded-full bg-black text-white flex items-center justify-center shadow-xl"
                        href="/seller/inventory/new"
                    >
                        <FaPlus size={16} />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((stat, index) => (
                        <StatCard key={index} {...stat} />
                    ))}
                </div>

                {profile?.type === "seller" && (
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard
                            change=''
                            description='Contas associadas da empresa'
                            isPositive
                            value={collaborators.length}
                            title="Colaboradores"
                            icon={<MdManageAccounts className="w-6 h-6 text-white" />}
                        />
                    </div>
                )}
                {/* <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((stat, index) => (
                        <LineChartCard />
                    ))}
                </div> */}

                <div className="h-32" />
            </div>
        </>
    );
};

export default SellerDashboard;
