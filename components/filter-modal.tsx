import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Slider } from "./ui/slider";
import { Button } from "./ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "./ui/drawer";
import { Brand } from "@/models/brand";
import { formatCurrency } from "@/scripts/format-price";
import { Filter } from "lucide-react";

interface FilterModalProps {
    brand: {
        brandsList: Brand[],
        filters: {
            activeBrand: string, 
           handleBrandChange: (value: string) => void
        }
    },
    condition: {
        conditionList: string[],
        filters: {
            activeCondition: string,
            handleConditionChange: (value: string) => void
        }
    },
    orderBy: {
        orderByList: string[],
        filters: {
            activeOrder: string,
            handleOrderByChange: (value: string) => void
        }
    },
    price: {
        min: number,
        max: number,
        handlePriceChange: ([moreThan, lessaThan]: [number, number]) => void
    },
    reset: () => void,
    handleApply: () => void
}

const TabButton: React.FC<{ children: string, key: string, onClick: () => void, tabName: string, activeTab: string }> = ({
    key, onClick, activeTab, children, tabName
}) => {
    return (
        <Button
            key={key}
            onClick={onClick}
            className={`px-6 text-sm shadow-none rounded-full ${activeTab === tabName ? 'bg-orange-500 text-white' : 'bg-white text-black border border-[var(--black)]'}`}
        >
            {children}
        </Button>
    )
}

const ScrollableTabs: React.FC<{
    children: React.ReactNode
}> = ({ children }) => {
    return (
        <div className='space-y-4'>
            <div className="overflow-x-auto py-4">
                <div className="flex space-x-4 min-w-max scrollbar-hidden">
                    {children}
                </div>
            </div>

        </div>
    );
};

const FilterModal = ({ brand, condition, orderBy, price, reset, handleApply }: FilterModalProps) => {
    return (
        <Drawer>
            <DrawerTrigger>
                <Filter />
            </DrawerTrigger>
            <DrawerContent>
                <Card className="rounded-lg shadow-none border-none">
                    <CardHeader className="border-b mb-6">
                        <CardTitle className="text-center text-lg font-bold">
                            Classificar e filtrar
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {/* Marcas de Automóveis */}
                        <div>
                            <h3 className="font-semibold mb-2">Marcas de automóveis</h3>
                            <ScrollableTabs>
                                <Button
                                    key={'all'}
                                    onClick={() => brand.filters.handleBrandChange("Todos")}
                                    className={`px-6 py-2 shadow-none rounded-full ${brand.filters.activeBrand === "Todos" ? 'bg-orange-500 text-white' : 'bg-white text-black border border-[var(--black)]'}`}
                                >
                                    Todos
                                </Button>
                                {brand.brandsList.map((tab) => (
                                    <TabButton
                                        tabName={tab.brandName}
                                        activeTab={brand.filters.activeBrand}
                                        key={tab.brandId?.toString() ?? ''}
                                        onClick={() => brand.filters.handleBrandChange(tab.brandName)}
                                    >
                                        {tab.brandName}
                                    </TabButton>
                                ))}
                            </ScrollableTabs>
                        </div>

                        {/* Condição do carro */}
                        <div>
                            <h3 className="font-semibold mb-2">Condição do carro</h3>
                            <ScrollableTabs>
                                <Button
                                    key={'all'}
                                    onClick={() => condition.filters.handleConditionChange("Todos")}
                                    className={`px-6 py-2 shadow-none rounded-full ${condition.filters.activeCondition === "Todos" ? 'bg-orange-500 text-white' : 'bg-white text-black border border-[var(--black)]'}`}
                                >
                                    Todos
                                </Button>
                                {condition.conditionList.map((tab: string) => (
                                    <TabButton
                                        tabName={tab}
                                        activeTab={condition.filters.activeCondition}
                                        key={tab}
                                        onClick={() => condition.filters.handleConditionChange(tab as "Novo" | "Usado")}
                                    >
                                        {tab}
                                    </TabButton>
                                ))}
                            </ScrollableTabs>
                        </div>

                        {/* Faixa de preço */}
                        <div>
                            <h3 className="font-semibold mb-6">Faixa de preço</h3>
                            <Slider
                                defaultValue={[price.min, price.max]}
                                min={10}
                                max={200}
                                step={10}
                                className="w-full relative"
                                onValueChange={price.handlePriceChange}
                            >
                                {/* Trilha base */}
                                <div className="absolute inset-0 bg-gray-200 h-1 rounded" />

                                {/* Trilha do intervalo selecionado */}
                                <div
                                    className="absolute top-0 bg-blue-500 h-2 w-2 rounded-full"
                                    style={{
                                        left: `${((price.max - 0) / (300 - 0)) * 100}%`,
                                        right: `${100 - ((price.min - 0) / (300 - 0)) * 100}%`,
                                    }}
                                />
                            </Slider>

                            <div className="flex justify-between text-sm mt-2">
                                <span>{formatCurrency(price.min * 1000000)}</span>
                                <span>{formatCurrency(price.max * 1000000)}</span>
                            </div>
                        </div>

                        {/* Ordenar por */}
                        <div>
                            <h3 className="font-semibold mb-2">Ordenar por</h3>
                            <ScrollableTabs>
                                <Button
                                    key={'all'}
                                    onClick={() => orderBy.filters.handleOrderByChange("all")}
                                    className={`px-6 py-2 shadow-none rounded-full ${orderBy.filters.activeOrder === "all" ? 'bg-orange-500 text-white' : 'bg-white text-black border border-[var(--black)]'}`}
                                >
                                    Todos
                                </Button>

                                {[
                                    { label: "Mais recente", value: "recent" },
                                    { label: "Mais popular", value: "popular" }
                                ].map((tab) => (
                                    <TabButton
                                        tabName={tab.value}
                                        activeTab={orderBy.filters.activeOrder}
                                        key={tab.value}
                                        onClick={() => orderBy.filters.handleOrderByChange(tab.value as "popular" | "recent" | "all")}
                                    >
                                        {tab.label}
                                    </TabButton>
                                ))}
                            </ScrollableTabs>
                        </div>

                        <div className="flex gap-6 justify-between">
                            <Button onClick={reset} className="py-6 rounded-3xl flex-1 px-8" variant="outline">Reiniciar</Button>
                            <Button onClick={handleApply} className="py-6 rounded-3xl flex-1 px-8" variant="default">Aplicar</Button>
                        </div>
                    </CardContent>
                </Card>
            </DrawerContent>
        </Drawer>
    );
};

export default FilterModal;



