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
import { motion } from "framer-motion";
import { Car, CheckCircle, Clock, X } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Orders() {
    const [sales, setSales] = useState<Sale[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    const fetchSales = async () => {
        setLoading(true);
        try {
            const response = await createdInstance.get<Sale[]>(`/sales/seller/${user?.uid}`);
            setSales(response.data);
        } catch (error) {
            console.error("Error fetching sales:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSales();
    }, []);

    // Count sales by state
    const pendingCount = sales.filter(sale => sale.state === "pending").length;
    const cancelledCount = sales.filter(sale => sale.state === "cancelled").length;
    const confirmedCount = sales.filter(sale => sale.state === "confirmed").length;
    const completedCount = sales.filter(sale => sale.state === "completed").length;

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 100 }
        }
    };

    // Loading skeleton
    const renderSkeletons = () => (
        <div className="space-y-4 w-full">
            {[1, 2, 3].map(i => (
                <div key={i} className="w-full p-4 border rounded-xl shadow-sm">
                    <div className="flex items-center space-x-4">
                        <Skeleton className="h-14 w-14 rounded-full" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-[200px]" />
                            <Skeleton className="h-4 w-[150px]" />
                        </div>
                        <div className="ml-auto">
                            <Skeleton className="h-6 w-24 rounded-full" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    // Empty state component
    const EmptyState = ({ state }: { state: string }) => {
        const getEmptyStateInfo = () => {
            switch (state) {
                case "pending":
                    return {
                        icon: <Clock className="w-12 h-12 text-blue-400" />,
                        title: "Nenhum pedido pendente",
                        description: "Quando receber novos pedidos, eles aparecerão aqui."
                    };
                case "cancelled":
                    return {
                        icon: <X className="w-12 h-12 text-red-400" />,
                        title: "Nenhum pedido rejeitado",
                        description: "Os pedidos que você rejeitar aparecerão nesta seção."
                    };
                case "confirmed":
                    return {
                        icon: <CheckCircle className="w-12 h-12 text-green-400" />,
                        title: "Nenhum pedido confirmado",
                        description: "Os pedidos que você aceitar aparecerão aqui."
                    };
                case "completed":
                    return {
                        icon: <Car className="w-12 h-12 text-slate-400" />,
                        title: "Nenhuma venda concluída",
                        description: "As vendas finalizadas serão listadas nesta seção."
                    };
                default:
                    return {
                        icon: <Clock className="w-12 h-12 text-gray-400" />,
                        title: "Nenhum pedido encontrado",
                        description: "Não há pedidos para mostrar nesta categoria."
                    };
            }
        };

        const { icon, title, description } = getEmptyStateInfo();

        return (
            <motion.div
                variants={itemVariants}
                className="flex flex-col items-center justify-center py-16 px-4 text-center bg-gray-50 rounded-xl"
            >
                {icon}
                <h3 className="mt-4 text-lg font-semibold text-gray-800">{title}</h3>
                <p className="mt-2 text-sm text-gray-500 max-w-md">{description}</p>
            </motion.div>
        );
    };

    return (
        <div className="container mx-auto px-4 py-6 max-w-5xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2 md:mb-0">Meus Pedidos</h1>
                <div className="flex space-x-2">
                    <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                        <Clock className="w-4 h-4 mr-1" /> Pendentes: {pendingCount}
                    </div>
                    <div className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-sm font-medium flex items-center">
                        <CheckCircle className="w-4 h-4 mr-1" /> Confirmados: {confirmedCount}
                    </div>
                </div>
            </div>

            <Tabs defaultValue="pending" className="w-full">
                <TabsList className="w-full mb-6 grid grid-cols-2 md:grid-cols-4 h-auto p-1 bg-gray-100 rounded-xl gap-1">
                    <TabsTrigger
                        value="pending"
                        className="rounded-lg py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm flex items-center justify-center gap-1 md:gap-2 text-xs md:text-sm"
                    >
                        <Clock className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                        <span className="truncate">Pendentes</span>
                        {pendingCount > 0 && (
                            <span className="bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full text-xs min-w-[1.5rem] text-center">{pendingCount}</span>
                        )}
                    </TabsTrigger>
                    <TabsTrigger
                        value="confirmed"
                        className="rounded-lg py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm flex items-center justify-center gap-1 md:gap-2 text-xs md:text-sm"
                    >
                        <CheckCircle className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                        <span className="truncate">Confirmados</span>
                        {confirmedCount > 0 && (
                            <span className="bg-green-100 text-green-600 px-1.5 py-0.5 rounded-full text-xs min-w-[1.5rem] text-center">{confirmedCount}</span>
                        )}
                    </TabsTrigger>
                    <TabsTrigger
                        value="completed"
                        className="rounded-lg py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm flex items-center justify-center gap-1 md:gap-2 text-xs md:text-sm"
                    >
                        <Car className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                        <span className="truncate">Fechados</span>
                        {completedCount > 0 && (
                            <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-full text-xs min-w-[1.5rem] text-center">{completedCount}</span>
                        )}
                    </TabsTrigger>
                    <TabsTrigger
                        value="cancelled"
                        className="rounded-lg py-3 data-[state=active]:bg-white data-[state=active]:shadow-sm flex items-center justify-center gap-1 md:gap-2 text-xs md:text-sm"
                    >
                        <X className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                        <span className="truncate">Rejeitados</span>
                        {cancelledCount > 0 && (
                            <span className="bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full text-xs min-w-[1.5rem] text-center">{cancelledCount}</span>
                        )}
                    </TabsTrigger>
                </TabsList>


                <div className="w-full">
                    <TabsContent value="pending" className="mt-0">
                        {loading ? (
                            renderSkeletons()
                        ) : (
                            <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                className="space-y-4"
                            >
                                {sales.some(sale => sale.state === "pending") ? (
                                    sales.map((sale) => (
                                        sale.state === "pending" && (
                                            <motion.div key={sale.saleId} variants={itemVariants}>
                                                <OrderCard sale={sale} updateSale={fetchSales} />
                                            </motion.div>
                                        )
                                    ))
                                ) : (
                                    <EmptyState state="pending" />
                                )}
                            </motion.div>
                        )}
                    </TabsContent>

                    <TabsContent value="confirmed" className="mt-0">
                        {loading ? (
                            renderSkeletons()
                        ) : (
                            <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                className="space-y-4"
                            >
                                {sales.some(sale => sale.state === "confirmed") ? (
                                    sales.map((sale) => (
                                        sale.state === "confirmed" && (
                                            <motion.div key={sale.saleId} variants={itemVariants}>
                                                <OrderCard sale={sale} updateSale={fetchSales} />
                                            </motion.div>
                                        )
                                    ))
                                ) : (
                                    <EmptyState state="confirmed" />
                                )}
                            </motion.div>
                        )}
                    </TabsContent>

                    <TabsContent value="completed" className="mt-0">
                        {loading ? (
                            renderSkeletons()
                        ) : (
                            <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                className="space-y-4"
                            >
                                {sales.some(sale => sale.state === "completed") ? (
                                    sales.map((sale) => (
                                        sale.state === "completed" && (
                                            <motion.div key={sale.saleId} variants={itemVariants}>
                                                <OrderCard sale={sale} updateSale={fetchSales} />
                                            </motion.div>
                                        )
                                    ))
                                ) : (
                                    <EmptyState state="completed" />
                                )}
                            </motion.div>
                        )}
                    </TabsContent>

                    <TabsContent value="cancelled" className="mt-0">
                        {loading ? (
                            renderSkeletons()
                        ) : (
                            <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                className="space-y-4"
                            >
                                {sales.some(sale => sale.state === "cancelled") ? (
                                    sales.map((sale) => (
                                        sale.state === "cancelled" && (
                                            <motion.div key={sale.saleId} variants={itemVariants}>
                                                <OrderCard sale={sale} updateSale={fetchSales} />
                                            </motion.div>
                                        )
                                    ))
                                ) : (
                                    <EmptyState state="cancelled" />
                                )}
                            </motion.div>
                        )}
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    );
}
