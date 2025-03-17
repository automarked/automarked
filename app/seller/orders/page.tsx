'use client'

import OrderCard from "@/components/orders-card";
import { useAuth } from "@/contexts/AuthContext";
import { createdInstance } from "@/hooks/useApi";
import Sale from "@/models/sale";
import { useEffect, useState } from "react";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"


export default function Orders() {
    const [sales, setSales] = useState<Sale[]>([])
    const { user } = useAuth()
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

    return (
        <>
            <Tabs defaultValue="pending" className="flex flex-col items-center">
                <h3 className="text-lg self-start font-semibold my-2 ms-4">Meus pedidos</h3>
                <TabsList className="w-full">
                    <TabsTrigger value="pending">Pendentes</TabsTrigger>
                    <TabsTrigger value="cancelled">Rejeitados</TabsTrigger>
                    <TabsTrigger value="confirmed">Confirmados</TabsTrigger>
                    <TabsTrigger value="completed">Fechados</TabsTrigger>
                </TabsList>
                <div className="flex flex-col md:flex-row items-center space-y-4 w-full md:max-w-5xl px-2 min-h-28">
                    <TabsContent value="pending" className="w-full text-center min-h-28">
                        {sales.map((sale) => (
                            sale.state === "pending" && (
                                <OrderCard sale={sale} updateSale={fetchSales} />
                            )
                        ))}

                        {!sales.some((sale) => sale.state === "pending") && <div className="text-lg text-center pt-10 text-slate-500">Nenhum pedido pendente!</div>}
                    </TabsContent>
                    <TabsContent value="cancelled" className="w-full text-center min-h-28">
                        {sales.map((sale) => (
                            sale.state === "cancelled" && (
                                <OrderCard sale={sale} updateSale={fetchSales} />
                            )
                        ))}

                        {!sales.some((sale) => sale.state === "cancelled") && <div className="text-lg text-center pt-10 text-slate-500">Nenhum pedido cancelado!</div>}
                    </TabsContent>
                    <TabsContent value="confirmed" className="w-full text-center min-h-28">
                        {sales.map((sale) => (
                            sale.state === "confirmed" && (
                                <OrderCard sale={sale} updateSale={fetchSales} />
                            )
                        ))}

                        {!sales.some((sale) => sale.state === "confirmed") && <div className="text-lg text-center pt-10 text-slate-500">Nenhum pedido confirmado!</div>}
                    </TabsContent>
                    <TabsContent value="completed" className="w-full text-center min-h-28">
                        {sales.map((sale) => (
                            sale.state === "completed" && (
                                <OrderCard sale={sale} updateSale={fetchSales} />
                            )
                        ))}

                        {!sales.some((sale) => sale.state === "completed") && <div className="text-lg text-center pt-10 text-slate-500">Nenhum pedido completado!</div>}
                    </TabsContent>
                </div>
            </Tabs>
        </>
    )
}