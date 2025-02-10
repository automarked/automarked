// File: CarBrandsGrid.tsx

import { useShoppingCart } from "@/contexts/ShoppingCartContext";
import { Card } from "./ui/card";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/userContext";
import { useEffect } from "react";
import { Building2 } from "lucide-react";
import Loader from "./loader";

const CarBrandsGrid = () => {
    const { getUsersByProfileType, stores, isLoadingStores } = useUser()

    const router = useRouter()

    useEffect(() => {
        (async () => {
            getUsersByProfileType("seller")
        })()
    }, [])

    // const carBrands = [
    //     { name: 'COMAUTO', logo: '/images/7.png' },
    //     { name: 'TCG', logo: '/images/6.png' },
    //     { name: 'BMW', logo: '/images/3.png' },
    //     { name: 'Toyota', logo: '/images/4.png' },
    //     { name: 'Volvo', logo: '/images/5.png' },
    //     { name: 'JETOUR', logo: '/images/2.png' },
    //     { name: 'ANGOLAUTO', logo: '/images/1.png' },
    //     { name: 'Mais', logo: '/images/more.svg' },
    // ];

    return (
        <div className="grid grid-cols-4 gap-4 p-4">
            {isLoadingStores && (
                <div className='w-full h-screen flex items-start justify-center'>
                    <Loader />
                </div>
            )}
            {!isLoadingStores && (
                <>
                    {stores.map((store) => (
                        <div onClick={() => router.push(`/seller/stores/${store.userId}`)} className="text-center flex flex-col justify-center items-center">
                            <Card key={store.userId} className="flex w-14 h-14 border-none shadow-none bg-global rounded-full justify-center items-center cursor-pointer">
                                {store.photo ? (
                                    <Image alt="" width={100} height={100} src={store.photo} className="rounded-full w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full rounded-full p-2 flex justify-center items-center text-slate-700">
                                        <Building2 size={24} />
                                    </div>
                                )}
                            </Card>
                            <div className="text-center mt-2 font-semibold text-sm">
                                {store.companyName}
                            </div>
                        </div>
                    ))}
                </>)}
        </div>
    );
};

export default CarBrandsGrid;
