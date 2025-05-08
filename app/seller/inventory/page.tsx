'use client';

import { useCallback, useEffect, useState } from "react";
import { useUser } from "@/contexts/userContext";
import SearchInput from "@/components/both/input-search";
import CarGrid from "@/components/both/car-grid";
import { InventoryItem } from "@/models/inventory";
import { FaPlus, FaFilter, FaSort } from "react-icons/fa";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import Loader from "@/components/loader";
import { useInventoryContext } from "@/contexts/InventoryContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Car, 
  LayoutGrid, 
  List, 
  AlertCircle, 
  ChevronDown, 
  RefreshCw, 
  Clock 
} from "lucide-react";
import { formatCurrency } from "@/scripts/format-price";

const Inventory = () => {
    const { user } = useAuth();
    const { inventory, removeVehicle: deleteVehicleFromInventory, totalInventoryValue } = useInventoryContext();
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [sortBy, setSortBy] = useState<'newest' | 'price-high' | 'price-low'>('newest');
    const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
    const [filteredInventory, setFilteredInventory] = useState<InventoryItem[]>([]);

    useEffect(() => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    }, [inventory]);

    useEffect(() => {
        let result = [...inventory];
        
        // Apply search filter
        if (searchQuery) {
            result = result.filter(item => 
                item.vehicles.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.vehicles.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.vehicles.manufactureYear.toString().includes(searchQuery)
            );
        }
        
        // Apply status filter
        if (filterStatus !== 'all') {
            // This is a placeholder - you would need to implement actual status logic
            // For now, let's assume all vehicles are active
            if (filterStatus === 'inactive') {
                result = result.filter(item => false); // No inactive items for now
            }
        }
        
        // Apply sorting
        result.sort((a, b) => {
            if (sortBy === 'price-high') {
                return Number(b.vehicles.price) - Number(a.vehicles.price);
            } else if (sortBy === 'price-low') {
                return Number(a.vehicles.price) - Number(b.vehicles.price);
            } else {
                // Sort by newest (assuming vehicleId has some timestamp component)
                return b.vehicles.vehicleId.localeCompare(a.vehicles.vehicleId);
            }
        });
        
        setFilteredInventory(result);
    }, [inventory, searchQuery, sortBy, filterStatus]);

    const onDelete = useCallback(({ vehicles: vehicleToDelete }: InventoryItem) => {        
        deleteVehicleFromInventory(vehicleToDelete.vehicleId);
    }, [deleteVehicleFromInventory]);

    const getInventoryStats = () => {
        return {
            total: inventory.length,
            active: inventory.length, // Placeholder - implement actual status logic
            inactive: 0, // Placeholder - implement actual status logic
            totalValue: totalInventoryValue
        };
    };

    const stats = getInventoryStats();

    const fadeIn = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.5 } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    return (
        <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="p-4 md:p-6 mb-32 bg-gray-50"
        >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
                        <Car className="h-6 w-6" /> Inventário
                    </h1>
                    <p className="text-gray-500">Gerencie seus veículos disponíveis para venda</p>
                </div>
                <div className="mt-4 md:mt-0">
                    <Link href='/seller/inventory/new'>
                        <Button className="bg-gradient-to-r from-[#1e293b] to-[#354867] hover:from-[#354867] hover:to-[#1e293b] text-white shadow-md">
                            <FaPlus className="mr-2" size={14} /> Adicionar Veículo
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Total de Veículos</p>
                                <h3 className="text-2xl font-bold">{stats.total}</h3>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <Car className="h-5 w-5 text-blue-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Veículos Ativos</p>
                                <h3 className="text-2xl font-bold">{stats.active}</h3>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                                <Badge className="bg-green-500 h-5 w-5 flex items-center justify-center p-0">
                                    {stats.active}
                                </Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Veículos Inativos</p>
                                <h3 className="text-2xl font-bold">{stats.inactive}</h3>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                                <AlertCircle className="h-5 w-5 text-gray-500" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Valor Total</p>
                                <h3 className="text-2xl font-bold">{formatCurrency(stats.totalValue)}</h3>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                                <Clock className="h-5 w-5 text-purple-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="mb-6">
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="w-full md:w-1/3">
                            <SearchInput 
                                setValue={setSearchQuery} 
                                value={searchQuery} 
                            />
                        </div>
                        
                        <div className="flex items-center gap-2">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="flex items-center gap-2">
                                        <FaFilter size={12} />
                                        Filtrar
                                        <ChevronDown className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem onClick={() => setFilterStatus('all')}>
                                        Todos os veículos
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setFilterStatus('active')}>
                                        Veículos ativos
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setFilterStatus('inactive')}>
                                        Veículos inativos
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" className="flex items-center gap-2">
                                        <FaSort size={12} />
                                        Ordenar
                                        <ChevronDown className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem onClick={() => setSortBy('newest')}>
                                        Mais recentes
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setSortBy('price-high')}>
                                        Preço: Maior para menor
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setSortBy('price-low')}>
                                        Preço: Menor para maior
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            
                            <div className="flex items-center border rounded-md overflow-hidden">
                                <Button 
                                    variant={viewMode === 'grid' ? 'default' : 'ghost'} 
                                    size="sm"
                                    onClick={() => setViewMode('grid')}
                                    className={viewMode === 'grid' ? 'bg-[#1e293b]' : ''}
                                >
                                    <LayoutGrid className="h-4 w-4" />
                                </Button>
                                <Button 
                                    variant={viewMode === 'list' ? 'default' : 'ghost'} 
                                    size="sm"
                                    onClick={() => setViewMode('list')}
                                    className={viewMode === 'list' ? 'bg-[#1e293b]' : ''}
                                >
                                    <List className="h-4 w-4" />
                                </Button>
                            </div>
                            
                            <Button 
                                variant="outline" 
                                size="icon"
                                onClick={() => {
                                    setIsLoading(true);
                                    setTimeout(() => setIsLoading(false), 1000);
                                }}
                                title="Atualizar"
                            >
                                <RefreshCw className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <AnimatePresence>
                {isLoading ? (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className='w-full h-64 flex items-center justify-center'
                    >
                        <Loader />
                    </motion.div>
                ) : (
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                    >
                        {filteredInventory.length === 0 ? (
                            <Card className="p-8 text-center">
                                <div className="flex flex-col items-center justify-center gap-4">
                                    <Car className="h-16 w-16 text-gray-300" />
                                    <h3 className="text-xl font-semibold text-gray-700">Nenhum veículo encontrado</h3>
                                    <p className="text-gray-500 max-w-md mx-auto">
                                        {searchQuery 
                                            ? `Não encontramos veículos correspondentes à sua pesquisa "${searchQuery}".` 
                                            : "Seu inventário está vazio. Adicione veículos para começar a vender."}
                                    </p>
                                    <Link href='/seller/inventory/new'>
                                        <Button className="mt-2 bg-gradient-to-r from-[#1e293b] to-[#354867]">
                                            <FaPlus className="mr-2" size={14} /> Adicionar Veículo
                                        </Button>
                                    </Link>
                                </div>
                            </Card>
                        ) : (
                            <CarGrid 
                                inventory={filteredInventory} 
                                searchOnList={searchQuery} 
                                onDelete={onDelete}
                            />
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default Inventory;
