'use client'

import { Bell, LayoutDashboard, ListCheck, LucideIcon, MessageCircle, User, UserPlus2, X } from "lucide-react";
import { FaLeaf, FaDumbbell, FaHamburger, FaChartLine } from "react-icons/fa";
import { IoChatbubblesOutline } from "react-icons/io5";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Autoplay from "embla-carousel-autoplay"
import SearchInput from "@/components/both/input-search";
import { useCallback, useEffect, useState } from "react";
import useInventory from "@/hooks/useInventory";
import { Vehicle } from "@/models/vehicle";
import ScrollableTabs from "@/components/scrollable-tabs";
import { IUser } from "@/models/user";
import { createdInstance } from "@/hooks/useApi";
import { apiBaseURL } from "@/constants/api";
import { useRouter } from "next/navigation";
import { BsEnvelope } from "react-icons/bs";
import { useNotificationGroupContext } from "@/contexts/notificationGroup";
import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";

interface Interest {
    icon: React.ReactNode;
    label: string;
}

const interests: Interest[] = [
    { icon: <FaLeaf className="text-green-500" />, label: "Climate Change" },
    { icon: <FaDumbbell className="text-yellow-500" />, label: "Weightlifting" },
    { icon: <FaHamburger className="text-red-500" />, label: "BBQ" },
    { icon: <FaChartLine className="text-blue-500" />, label: "Stock Market" },
];

export default function ProfileCard({ params }: { params: { id: string } }) {
    const { user } = useAuth()
    const [text, setText] = useState('')
    const { inventory } = useInventory(params.id)
    const [cars, setCars] = useState<Vehicle[]>([])
    const [visualizationMode, setVisualizationMode] = useState<"grid" | "flex">("grid")
    const [profile, setProfile] = useState<IUser>()
    const [bellActive, setBellActive] = useState<boolean>(false)
    const { fetchNotifications, notifications, removeNotification, addNotification } = useNotificationGroupContext()

    const router = useRouter()

    const getProfile = useCallback(
        async () => {
            try {
                const response = await createdInstance.get<{ message: string | null; record: IUser }>(
                    `/users/${params.id}`
                );
                if (response.status === 200) {
                    setProfile(response.data.record)
                } else {
                    throw new Error(`Erro ao buscar perfil: ${response.status}`);
                };
            } catch (error) {
                console.error(error);
            };
        }, []
    );

    useEffect(() => {
        const existsActiveNotification = notifications.some(nt => nt === user?.uid)
        setBellActive(existsActiveNotification)
    }, [notifications])

    useEffect(() => {
        getProfile()
        fetchNotifications(params.id)
    }, [])

    useEffect(() => {
        setCars(
            inventory.map((vhc) => {
                return vhc.vehicles as Vehicle
            })
        )
    }, [inventory])
    return (
        <>
            <div className="mx-auto rounded-none overflow-hidden bg-black text-white shadow-lg">
                {/* Banner */}
                <div className="relative">
                    <div className="w-full h-32">
                        {profile?.background && (
                            <Image width={100} height={100}
                                src={profile?.background || '/images/default-background.jpeg'}
                                alt="Banner"
                                className="w-full h-full object-cover"
                            />
                        )}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="rounded-full mt-32 overflow-hidden border-4 border-white w-20 h-20">
                            {profile?.photo ? (
                                <Image width={100} height={100}
                                    src={profile?.photo}
                                    alt="Profile Picture"
                                    className="w-20 h-20 rounded-full object-cover"
                                />

                            ) : (
                                <div className="bg-slate-300 w-full h-full rounded-full p-2 flex justify-center items-center text-slate-700">
                                    <User width={28} height={28} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Informações */}
                <div className="p-4 mt-10 text-center">
                    <h2 className="text-xl font-bold mb-2">{profile?.companyName}</h2>
                    {/*  <div
                        className="flex mb-2 items-center mx-auto w-fit px-3 py-1 bg-gray-800 rounded-full text-sm"
                    >
                        <BsEnvelope />
                        <span className="ml-2 text-gray-300">{profile?.email}</span>
                    </div> */}
                    <p className="text-sm text-gray-400">
                        {profile?.description}
                    </p>
                    <p className="mt-2 text-gray-300">
                        {profile?.municipality && profile?.province && (
                            <span>
                                {profile?.municipality}, {profile?.province}
                            </span>
                        )}
                    </p>
                </div>

                {/* Botões */}
                <div className="flex justify-around p-4">
                    <button onClick={() => router.push(`/seller/chat/${profile?.userId}`)} className="flex items-center justify-center h-12 w-[70%] px-4 gap-2 bg-gray-800 rounded-full">
                        <IoChatbubblesOutline className="text-white w-6 h-6" />
                        Enviar Mensagem
                    </button>
                    {/* <button className="flex items-center justify-center w-12 h-12 bg-gray-800 rounded-full">
                        <UserPlus2 name="user-plus" className="text-white" />
                    </button> */}
                    {!bellActive && (
                        <button onClick={() => {
                            addNotification(params.id, user?.uid ?? '')
                            setBellActive(true)
                        }} className="flex items-center justify-center w-12 h-12 bg-gray-800 rounded-full">
                            <Bell name="x" className="text-white" />
                        </button>
                    )}
                    {bellActive && (
                        <button onClick={() => {
                            removeNotification(params.id, user?.name ?? '')
                            setBellActive(false)
                        }} className="flex border border-[#d4a507] items-center justify-center w-12 h-12 bg-gray-800 rounded-full">
                            <Bell name="x" fill="#d4a507" color="#fff" />
                        </button>
                    )}
                </div>

                <div className="p-4">

                    <div className="flex justify-between">
                        <h2 className="monserrat text-xl text-white font-bold">Destaques</h2>
                    </div>

                </div>
                <Carousel className="w-full"
                    plugins={[
                        Autoplay({
                            delay: 2000,
                        }),
                    ]}
                >
                    <CarouselContent>
                        {Array.from({ length: 5 }).map((_, index) => (
                            <CarouselItem key={index}>
                                <Card className='h-[200px] rounded-none bg-transparent border-none overflow-hidden shadow-none'>
                                    {index % 2 !== 0 && (

                                        <Image width={100} height={100} alt="" src="/images/banner1.jpeg" className='w-full h-full object-cover' />
                                    )}
                                    {index % 2 === 0 && (

                                        <Image width={100} height={100} alt="" src="/images/banner2.jpeg" className='w-full h-full object-cover' />
                                    )}
                                </Card>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
            </div>
            <div className="relative w-full p-2">
                <div data-search={!text.trim()} className='flex justify-between mb-2 data-[search=true]:mt-10 px-2'>
                    <strong className='font-bold text-lg'>
                        Produtos publicados
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
                            <ListCheck />
                        </div>
                    )}
                </div>
                <div>
                    <SearchInput className="bg-[#1e293b]" value={text} setValue={setText} />
                </div>

                <ScrollableTabs cars={cars} searchOnList={text} visualizationMode={visualizationMode} />
            </div>


            <div className="h-[500px]"></div>
        </>
    );
}
