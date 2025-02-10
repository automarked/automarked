// File: ScrollableTabs.tsx
import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import useBrands from '@/hooks/useBrands';
import useVehicle from '@/hooks/useVehicle';
import CarGrid from './both/car-grid';
import { Vehicle } from '@/models/vehicle';
import { Badge } from './ui/badge';
import { formatCurrency } from '@/scripts/format-price';
import Loader from './loader';

const ScrollableTabs: React.FC<{
    filters?: {
        brand?: string;
        condiction?: string;
        price?: {
            moreThan?: number;
            lessThan?: number;
        };
        orderBy?: string;
    }, cars?: Vehicle[], searchOnList?: string, visualizationMode?: "flex" | "grid"
}> = ({ cars, visualizationMode = "grid", searchOnList, filters }) => {
    const { brandsList } = useBrands()
    const [activeTab, setActiveTab] = useState('Todos');

    const handleActiveTab = (brandName: string) => {
        setActiveTab(brandName)
    }

    const { vehicleList, isLoading, actions: { getAllVehicles } } = useVehicle()

    useEffect(() => {
        if (filters) getAllVehicles(filters)
        else {
            getAllVehicles()
        }
    }, [filters])

    return (
        <>
            {isLoading && <div className="flex justify-center items-start h-[80vh]"><Loader /></div>}
            {!isLoading && (
                <div className='space-y-4'>
                    <div className="overflow-x-auto py-4">
                        <div className="flex space-x-4 min-w-max scrollbar-hidden">
                            <Button
                                key={'all'}
                                onClick={() => handleActiveTab("Todos")}
                                className={`px-6 py-2 shadow-none rounded-full ${activeTab === "Todos" ? 'bg-yellow-500 text-white' : 'bg-white text-black border border-[var(--black)]'}`}
                            >
                                Todos
                            </Button>
                            {brandsList.map((tab) => (
                                <Button
                                    key={tab.brandId}
                                    onClick={() => handleActiveTab(tab.brandName)}
                                    className={`px-6 py-2 shadow-none rounded-full ${activeTab === tab.brandName ? 'bg-yellow-500 text-white' : 'bg-white text-black hover:text-white border border-[var(--black)]'}`}
                                >
                                    {tab.brandName}
                                </Button>
                            ))}
                        </div>
                    </div>

                    {filters && (
                        <>
                            <span className='font-bold'>Resultados para</span>
                            <div className='flex gap-2 flex-wrap'>
                                {filters.brand && <Badge>{filters.brand}</Badge>}
                                {filters.condiction && <Badge>{filters.condiction}</Badge>}
                                {filters.orderBy && <Badge>{filters.orderBy}</Badge>}
                                {filters.price?.moreThan && filters.price.lessThan && (
                                    <Badge>Entre {formatCurrency(filters.price.moreThan * 1000000)} & {formatCurrency(filters.price.lessThan * 1000000)}</Badge>
                                )}
                            </div>
                        </>
                    )}

                    <CarGrid disposition={visualizationMode} shopping={cars ? true : false} inventory={cars ? cars : vehicleList} searchOnList={activeTab === "Todos" ? (searchOnList ? searchOnList : "") : (searchOnList ? searchOnList : activeTab)} />
                </div>
            )}
        </>
    );
};

export default ScrollableTabs;
