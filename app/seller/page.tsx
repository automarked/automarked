"use client";

import React, { useCallback, useEffect, useState } from "react";
import { formatCurrency } from "@/scripts/format-price";
import { FaCar, FaPlus } from "react-icons/fa";
import {
  Car,
  CheckCheckIcon,
  CircleDotDashed,
  LayoutDashboard,
  TicketX,
  TrendingUp,
  Users,
  Calendar,
} from "lucide-react";
import SearchInput from "@/components/both/input-search";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BarChart } from "lucide-react";
import {
  MdOutlineSell,
  MdOutlineInventory,
  MdManageAccounts,
} from "react-icons/md";
import { useAuth } from "@/contexts/AuthContext";
import StatCard from "@/components/both/stat-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Autoplay from "embla-carousel-autoplay";
import { useUser } from "@/contexts/userContext";
import Sale from "@/models/sale";
import { createdInstance } from "@/hooks/useApi";
import { useInventoryContext } from "@/contexts/InventoryContext";
import CustomerHelpdesk from "@/components/CustomerHelpdesk";
import WhatsAppFloatingButton from "@/components/both/contact-support";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import Image from "next/image";
import { toast } from "@/hooks/use-toast";

interface Advertisement {
  id: string;
  title: string;
  image: string;
  status: boolean;
}

const SellerDashboard = () => {
  const { user } = useAuth();
  const { profile } = useUser(user?.uid ?? "");
  const [input, setInput] = useState("");
  const { getCollaborators, collaborators } = useUser(user?.uid ?? "");
  const { totalInventoryValue, inventory } = useInventoryContext();
  const [sales, setSales] = useState<Sale[]>([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Advertisement states
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [advertisementsLoading, setAdvertisementsLoading] = useState(false);
  const [advertisementsError, setAdvertisementsError] = useState<string | null>(null);


  const fetchSales = async () => {
    setIsLoading(true);
    try {
      const response = await createdInstance.get<Sale[]>(
        `/sales/seller/${user?.uid}`
      );
      setSales(response.data);
    } catch (error) {
      console.error("Error fetching sales:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
    getCollaborators();
  }, [user]);

  const showToast = (title: string, message: string, variant: "default" | "destructive" = "default") => {
    toast({
      title,
      description: message,
      variant,
    });
  };

  const fetchAdvertisements = useCallback(async () => {
    setAdvertisementsLoading(true);
    try {
      const response = await createdInstance.get<Advertisement[]>("/advertisements");
      setAdvertisements(response.data);
      setAdvertisementsError(null);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Erro ao carregar anúncios";
      setAdvertisementsError(errorMessage);
      showToast("Erro", errorMessage, "destructive");
    } finally {
      setAdvertisementsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAdvertisements();
  }, [fetchAdvertisements]);

  const getTotalQuantitySales = () => {
    var quantitySale = 0;
    for (const sale of sales) {
      if (sale.state === "completed") {
        quantitySale++;
      }
    }
    return quantitySale;
  };

  const getTotalSales = () => {
    var totalSales = 0;
    for (const sale of sales) {
      if (sale.state === "completed") {
        totalSales += Number(sale.price);
      }
    }
    return totalSales === 0 ? "AOA 0, 00" : formatCurrency(totalSales);
  };

  const getSalesByState = (state: string) => {
    return sales.filter((sale) => sale.state === state).length;
  };

  const getRecentSales = () => {
    return sales
      .sort((a, b) => b.saleDate.seconds - a.saleDate.seconds)
      .slice(0, 5);
  };

  const calculateSalesProgress = () => {
    const totalSales = sales.length;
    if (totalSales === 0) return 0;
    const completedSales = getSalesByState("completed");
    return (completedSales / totalSales) * 100;
  };

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
  ];

  const salesStats = [
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

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  // Filter active advertisements
  const activeAdvertisements = advertisements.filter(ad => ad.status);

  return (
    <>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="p-2 md:p-6 mb-32 pt-0 min-h-screen h-full bg-gray-50"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Painel de Controle
            </h1>
            <p className="text-gray-500">
              Bem-vindo,{" "}
              {profile?.firstName + " " + profile?.lastName || "Vendedor"}
            </p>
          </div>
          <div className="w-full md:w-auto mt-4 md:mt-0 flex items-center gap-4">
            <SearchInput
              setValue={setInput}
              value={input}
            />
            <Link
              className="w-10 h-10 rounded-full bg-gradient-to-r from-[#1e293b] to-[#354867] text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all"
              href="/seller/inventory/new"
            >
              <FaPlus size={16} />
            </Link>
          </div>
        </div>

        <motion.div
          variants={fadeInUp}
          className="bg-gradient-to-r from-[#1e293b] to-[#354867] rounded-xl p-6 shadow-xl mb-8"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
            <div>
              <h2 className="text-white text-xl font-bold mb-2">
                Automação do seu negócio
              </h2>
              <p className="text-gray-200 text-sm max-w-xl">
                Veja a evolução e automação do seu negócio na AutoMarked!
                Monitore vendas, estoque e desempenho em tempo real.
              </p>
            </div>
            {/* <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-4 md:mt-0 px-6 py-2 bg-white text-[#1e293b] rounded-lg font-medium shadow-md hover:shadow-lg transition-all"
              onClick={() => router.push("/seller/analytics")}
            >
              Ver Análises
            </motion.button> */}
          </div>
        </motion.div>

        {/* Featured Offers Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center">
              <span className="bg-orange-500 w-2 h-8 rounded-full mr-2"></span>
              Ofertas Especiais
            </h2>
          </div>

          {advertisementsLoading ? (
            <div className="w-full mb-6 md:mb-10 rounded-xl md:rounded-2xl overflow-hidden shadow-lg md:shadow-xl">
              <Card className="h-[180px] sm:h-[250px] md:h-[400px] relative overflow-hidden border-0 shadow-none bg-gray-200 animate-pulse">
                <div className="flex items-center justify-center h-full">
                  <div className="text-gray-500">Carregando anúncios...</div>
                </div>
              </Card>
            </div>
          ) : advertisementsError ? (
            <div className="w-full mb-6 md:mb-10 rounded-xl md:rounded-2xl overflow-hidden shadow-lg md:shadow-xl">
              <Card className="h-[180px] sm:h-[250px] md:h-[400px] relative overflow-hidden border-0 shadow-none bg-red-50">
                <div className="flex items-center justify-center h-full">
                  <div className="text-red-500 text-center p-4">
                    <p className="font-medium">Erro ao carregar anúncios</p>
                    <p className="text-sm mt-1">{advertisementsError}</p>
                    <button
                      onClick={fetchAdvertisements}
                      className="mt-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                    >
                      Tentar novamente
                    </button>
                  </div>
                </div>
              </Card>
            </div>
          ) : activeAdvertisements.length > 0 ? (
            <Carousel
              className="w-full mb-6 md:mb-10 rounded-xl md:rounded-2xl overflow-hidden shadow-lg md:shadow-xl"
              plugins={[
                Autoplay({
                  delay: 3000,
                }),
              ]}
            >
              <CarouselContent>
                {activeAdvertisements.map((advertisement) => (
                  <CarouselItem key={advertisement.id} className="relative">
                    <Card className="h-[180px] sm:h-[250px] md:h-[400px] relative overflow-hidden border-0 shadow-none">
                      <div className="relative w-full h-full">
                        <Image
                          src={advertisement.image}
                          alt={advertisement.title}
                          width={1000}
                          height={500}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Fallback image if the advertisement image fails to load
                            const target = e.target as HTMLImageElement;
                            target.src = "/images/banner1.jpeg";
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex flex-col justify-end p-4 md:p-8">
                          <h3 className="text-white text-xl md:text-3xl font-bold mb-1 md:mb-2">
                            {advertisement.title}
                          </h3>
                          <p className="text-white/90 text-sm md:text-base mb-2 md:mb-4 max-w-md">
                            Aproveite esta oferta especial por tempo limitado.
                          </p>
                        </div>
                      </div>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2 md:left-4 w-8 h-8 md:w-10 md:h-10 bg-white/80 hover:bg-white text-orange-500 border-none shadow-md" />
              <CarouselNext className="right-2 md:right-4 w-8 h-8 md:w-10 md:h-10 bg-white/80 hover:bg-white text-orange-500 border-none shadow-md" />
            </Carousel>
          ) : (
            <div className="w-full mb-6 md:mb-10 rounded-xl md:rounded-2xl overflow-hidden shadow-lg md:shadow-xl">
              <Card className="h-[180px] sm:h-[250px] md:h-[400px] relative overflow-hidden border-0 shadow-none bg-gray-100">
                <div className="flex items-center justify-center h-full">
                  <div className="text-gray-500 text-center">
                    <p className="font-medium">Nenhum anúncio disponível</p>
                    <p className="text-sm mt-1">Não há ofertas especiais no momento.</p>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </motion.div>

        <Tabs
          defaultValue="overview"
          className="mb-8"
          onValueChange={setActiveTab}
        >
          <TabsList className="grid grid-cols-3 md:w-[400px] mb-6">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="sales">Vendas</TabsTrigger>
            <TabsTrigger value="inventory">Inventário</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {stats.map((stat, index) => (
                <motion.div key={index} variants={fadeInUp}>
                  <StatCard {...stat} />
                </motion.div>
              ))}
            </motion.div>

            {profile?.type === "seller" && (
              <motion.div variants={fadeInUp} className="mt-6">
                <StatCard
                  change=""
                  description="Contas associadas da empresa"
                  isPositive={true}
                  value={collaborators.length}
                  title="Colaboradores"
                  icon={<MdManageAccounts className="w-6 h-6 text-white" />}
                />
              </motion.div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
              <motion.div variants={fadeInUp} className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp size={18} />
                      Progresso de Vendas
                    </CardTitle>
                    <CardDescription>
                      Acompanhe o progresso das suas vendas
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">
                            Vendas Completadas
                          </span>
                          <span className="text-sm font-medium">
                            {getSalesByState("completed")}/{sales.length}
                          </span>
                        </div>
                        <Progress
                          value={calculateSalesProgress()}
                          className="h-2"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">
                            Vendas Pendentes
                          </span>
                          <span className="text-sm font-medium">
                            {getSalesByState("pending")}/{sales.length}
                          </span>
                        </div>
                        <Progress
                          value={
                            (getSalesByState("pending") / sales.length) * 100
                          }
                          className="h-2"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">
                            Vendas Canceladas
                          </span>
                          <span className="text-sm font-medium">
                            {getSalesByState("cancelled")}/{sales.length}
                          </span>
                        </div>
                        <Progress
                          value={
                            (getSalesByState("cancelled") / sales.length) * 100
                          }
                          className="h-2"
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">
                            Vendas Confirmadas
                          </span>
                          <span className="text-sm font-medium">
                            {getSalesByState("confirmed")}/{sales.length}
                          </span>
                        </div>
                        <Progress
                          value={
                            (getSalesByState("confirmed") / sales.length) * 100
                          }
                          className="h-2"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar size={18} />
                      Atividade Recente
                    </CardTitle>
                    <CardDescription>
                      Últimas atividades do sistema
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {isLoading ? (
                        <div className="flex justify-center items-center h-40">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
                        </div>
                      ) : getRecentSales().length > 0 ? (
                        getRecentSales().map((sale, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-3 pb-3 border-b border-gray-100"
                          >
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center ${sale.state === "completed"
                                ? "bg-green-100 text-green-600"
                                : sale.state === "pending"
                                  ? "bg-yellow-100 text-yellow-600"
                                  : sale.state === "confirmed"
                                    ? "bg-blue-100 text-blue-600"
                                    : "bg-red-100 text-red-600"
                                }`}
                            >
                              {sale.state === "completed" ? (
                                <CheckCheckIcon size={14} />
                              ) : sale.state === "pending" ? (
                                <CircleDotDashed size={14} />
                              ) : sale.state === "confirmed" ? (
                                <CheckCheckIcon size={14} />
                              ) : (
                                <TicketX size={14} />
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-medium">
                                {sale.vehicle.brand} {sale.vehicle.model}
                              </p>
                              <p className="text-xs text-gray-500">
                                {new Date(
                                  sale.saleDate.seconds * 1000
                                ).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="ml-auto">
                              <span
                                className={`text-xs font-medium px-2 py-1 rounded-full ${sale.state === "completed"
                                  ? "bg-green-100 text-green-600"
                                  : sale.state === "pending"
                                    ? "bg-yellow-100 text-yellow-600"
                                    : sale.state === "confirmed"
                                      ? "bg-blue-100 text-blue-600"
                                      : "bg-red-100 text-red-600"
                                  }`}
                              >
                                {sale.state === "completed"
                                  ? "Completado"
                                  : sale.state === "pending"
                                    ? "Pendente"
                                    : sale.state === "confirmed"
                                      ? "Confirmado"
                                      : "Cancelado"}
                              </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          Nenhuma venda recente encontrada
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </TabsContent>

          <TabsContent value="sales">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {salesStats.map((stat, index) => (
                <motion.div key={index} variants={fadeInUp}>
                  <StatCard {...stat} />
                </motion.div>
              ))}
            </motion.div>

            <motion.div variants={fadeInUp} className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users size={18} />
                    Clientes Recentes
                  </CardTitle>
                  <CardDescription>
                    Últimos clientes que realizaram compras
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex justify-center items-center h-40">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
                    </div>
                  ) : sales.length > 0 ? (
                    <div className="space-y-4">
                      {sales
                        .filter((sale) => sale.buyer)
                        .slice(0, 5)
                        .map((sale, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-4 pb-4 border-b border-gray-100"
                          >
                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-semibold">
                              {sale.buyer.firstName
                                ? sale.buyer.firstName.charAt(0).toUpperCase()
                                : "U"}
                            </div>
                            <div>
                              <p className="font-medium">
                                {sale.buyer.firstName || "Usuário"}
                              </p>
                              <p className="text-sm text-gray-500">
                                {sale.buyer.email || "Email não disponível"}
                              </p>
                            </div>
                            <div className="ml-auto text-right">
                              <p className="font-medium">
                                {formatCurrency(Number(sale.price))}
                              </p>
                              <p className="text-xs text-gray-500">
                                {new Date(
                                  sale.saleDate.seconds * 1000
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      Nenhum cliente encontrado
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="inventory">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <motion.div variants={fadeInUp} className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Car size={18} />
                      Inventário Atual
                    </CardTitle>
                    <CardDescription>
                      Visão geral do seu estoque de veículos
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {inventory.length > 0 ? (
                      <div className="space-y-4">
                        {inventory.slice(0, 5).map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-4 pb-4 border-b border-gray-100"
                          >
                            <div className="w-16 h-12 bg-gray-100 rounded overflow-hidden">
                              {item.vehicles.gallery &&
                                item.vehicles.gallery.length > 0 && (
                                  <Image
                                    src={item.vehicles.gallery[0]}
                                    alt={`Imagem do ${item.vehicles.brand} ${item.vehicles.model}`}
                                    width={50}
                                    height={50}
                                    className="w-full h-full object-cover"
                                  />
                                )}
                            </div>
                            <div>
                              <p className="font-medium">
                                {item.vehicles.brand} {item.vehicles.model}
                              </p>
                              <p className="text-sm text-gray-500">
                                {item.vehicles.manufactureYear} • {item.vehicles.mileage}{" "}
                                km
                              </p>
                            </div>
                            <div className="ml-auto text-right">
                              <p className="font-medium">
                                {formatCurrency(Number(item.vehicles.price))}
                              </p>
                              <Link
                                href={`/seller/inventory/car-detail/${item.vehicles.vehicleId}`}
                                className="text-xs text-blue-600 hover:underline"
                              >
                                Ver detalhes
                              </Link>
                            </div>
                          </div>
                        ))}

                        <div className="pt-4 text-center">
                          <Link
                            href="/seller/inventory"
                            className="text-sm font-medium text-blue-600 hover:underline"
                          >
                            Ver todo o inventário →
                          </Link>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500 mb-4">
                          Seu inventário está vazio
                        </p>
                        <Link
                          href="/seller/inventory/new"
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                        >
                          Adicionar veículo
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart size={18} />
                      Estatísticas
                    </CardTitle>
                    <CardDescription>Resumo do seu inventário</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                        <span className="text-sm">Total de veículos</span>
                        <span className="font-medium">{inventory.length}</span>
                      </div>
                      <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                        <span className="text-sm">Valor médio</span>
                        <span className="font-medium">
                          {inventory.length > 0
                            ? formatCurrency(
                              totalInventoryValue / inventory.length
                            )
                            : "AOA 0,00"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                        <span className="text-sm">Veículo mais caro</span>
                        <span className="font-medium">
                          {inventory.length > 0
                            ? formatCurrency(
                              Math.max(
                                ...inventory.map((item) =>
                                  Number(item.vehicles.price)
                                )
                              )
                            )
                            : "AOA 0,00"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Veículo mais barato</span>
                        <span className="font-medium">
                          {inventory.length > 0
                            ? formatCurrency(
                              Math.min(
                                ...inventory.map((item) =>
                                  Number(item.vehicles.price)
                                )
                              )
                            )
                            : "AOA 0,00"}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>

      <WhatsAppFloatingButton />
      <CustomerHelpdesk classNameBG="" classNameSVG="" />
    </>
  );
};

export default SellerDashboard;
