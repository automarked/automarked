import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, CheckCircle, Maximize2, Minimize2, User, MessageSquareText } from "lucide-react";
import Sale from "@/models/sale";
import { saleState } from "@/utils/saleState";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { formatCurrency } from "@/scripts/format-price";
import { FaComment } from "react-icons/fa";
import { useRouter } from "next/navigation";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { createdInstance } from "@/hooks/useApi";
import { toast } from "@/hooks/use-toast";
import Loader from "./loader";


interface OrdersCardProps {
    sale: Sale;
    updateSale: () => Promise<void>
}

export default function OrderCard({ sale, updateSale }: OrdersCardProps) {
    const [minimized, setMinimized] = useState<boolean>(true)
    const [state, setState] = useState<string>(sale.state)
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isDocExpanded, setIsDocExpanded] = useState(false);
    const router = useRouter()
    const resizeRef = useRef(null)
    const showToast = (title: string, description: string) => {
        toast({
            title,
            description,
        });
    };
    const handleToggleResize = () => {
        if (minimized) {
            setMinimized(false)
        } else {
            setMinimized(true)
        }
    }

    const handleUpdateState = async (state: string) => {
        setIsLoading(true)

        try {
            const response = await createdInstance.put(`/sales/${sale.saleId}/${state}`);

            if (response.status === 200) {
                setIsLoading(false)
                setState(state)
                await updateSale()
                showToast('Pedido atualizado com sucesso!', 'O estado do pedido foi atualizado com sucesso.');
            } else {
                setIsLoading(false)
                console.log(response.data)
                showToast('Erro ao actualizar o pedido!', 'Ocorreu um erro ao actualizar o estado do pedido.');
            }
        } catch (error) {
            setIsLoading(false)
            console.error('Erro ao actualizar o pedido:', error);
            showToast('Erro ao actualizar o pedido!', 'Ocorreu um erro ao actualizar o estado do pedido.');
        }

    };
    console.log(sale.annex)


    return (
        <div className="mb-3">
            <Card ref={resizeRef} className={`min-w-[300px] grow w-full border rounded-lg shadow-md relative shadow-sm ${minimized ? '' : 'absolute left-0 right-0 buttom-0 top-0 h-screen w-full overflow-y-auto z-20'}`}>
                <div onClick={handleToggleResize} className="absolute right-3 top-3 bg-slate-100 hover:bg-slate-200 px-2 rounded cursor-pointer">
                    {minimized ? <Maximize2 width={9} /> : <Minimize2 width={9} />}
                </div>
                {minimized && (
                    <div className="flex p-3 items-center mt-6">
                        <div className="flex items-center space-x-2">
                            {sale.buyer.photo ? (
                                <Image
                                    width={100}
                                    height={100}
                                    src={sale.buyer.photo ?? ''}
                                    alt="Imagem do usuário"
                                    className="w-14 h-14 object-cover rounded-full p-2"
                                />
                            ) : (
                                
                                <Avatar>
                                    <AvatarFallback>
                                        {sale.buyer.firstName[0]}
                                        {sale.buyer.lastName?.[0]}
                                    </AvatarFallback>
                                </Avatar>
                            )}
                            <div className="flex items-start flex-col text-sm">
                                <p className="font-bold">{sale.buyer.firstName} {sale.buyer.lastName}</p>
                                <p className="">{sale.vehicle.brand} {sale.vehicle.model}</p>
                            </div>
                        </div>
                        <div className="flex grow justify-end">
                            <p className="">
                                {state === 'pending' && (
                                    <Badge variant="pending" className="flex items-center gap-1">
                                        <CheckCircle className="w-4 h-4" /> {saleState[state]}
                                    </Badge>
                                )}
                                {state === 'confirmed' && (
                                    <Badge variant="confirmed" className="flex items-center gap-1">
                                        <CheckCircle className="w-4 h-4" /> {saleState[state]}
                                    </Badge>
                                )}
                                {state === 'cancelled' && (
                                    <Badge variant="cancelled" className="flex items-center gap-1">
                                        <CheckCircle className="w-4 h-4" /> {saleState[state]}
                                    </Badge>
                                )}
                            </p>
                        </div>
                    </div>
                )}
                {!minimized && (
                    <>
                        <CardHeader className="flex justify-between items-center">
                            <CardTitle className="text-sm font-bold">{sale.vehicle.brand} {sale.vehicle.model}</CardTitle>
                            {sale.state === 'pending' && (
                                <Badge variant="pending" className="flex items-center gap-1">
                                    <CheckCircle className="w-4 h-4" /> {saleState[sale.state]}
                                </Badge>
                            )}
                            {sale.state === 'confirmed' && (
                                <Badge variant="confirmed" className="flex items-center gap-1">
                                    <CheckCircle className="w-4 h-4" /> {saleState[sale.state]}
                                </Badge>
                            )}
                            {sale.state === 'cancelled' && (
                                <Badge variant="cancelled" className="flex items-center gap-1">
                                    <CheckCircle className="w-4 h-4" /> {saleState[sale.state]}
                                </Badge>
                            )}
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex flex-col items-center gap-4">
                                <div className="">
                                    <Image
                                        src={sale.vehicle.gallery[0] ?? ''}
                                        alt={`Imagem do ${sale.vehicle.brand} ${sale.vehicle.model}`}
                                        width={500}
                                        height={300}
                                        className="w-full h-64 object-cover"
                                    />
                                </div>
                                <div className="flex items-center gap-4">
                                    <Carousel
                                        opts={{
                                            align: "start",
                                        }}
                                        className="w-full z-10"
                                    >
                                        <CarouselContent>
                                            {sale.vehicle.gallery.map((galleryImage, index) => (
                                                <CarouselItem key={index} className="md:basis-1/2 basis-1/3 cursor-pointer">
                                                    <Image
                                                        src={galleryImage}
                                                        alt={`Galeria de ${sale.vehicle.brand} ${sale.vehicle.model}`}
                                                        width={100}
                                                        height={100}
                                                        className="w-full h-full rounded-lg object-cover"
                                                    />
                                                </CarouselItem>
                                            ))}
                                        </CarouselContent>
                                        <CarouselPrevious className='-left-4' />
                                        <CarouselNext className='-right-4' />
                                    </Carousel>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <p className="text-sm font-medium">Preço</p>
                                <p className="text-sm text-muted-foreground">{formatCurrency(sale.vehicle.price)}</p>
                            </div>
                            <h3 className="text-lg text-start font-semibold mb-2">Informações do cliente</h3>
                            <div className="flex items-center gap-4">
                                <MapPin className="w-5 h-5 text-green-500" />
                                <div>
                                    <p className="text-sm font-medium">Localização actual</p>
                                    <p className="text-sm  text-start text-muted-foreground">
                                        {sale.address.municipality}, {sale.address.province}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-start py-4">
                                <div>
                                    <p className="text-sm font-medium">Data do pedido</p>
                                    <p className="text-sm text-muted-foreground">{"25/01/2025 10:14"}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-start py-4">
                                <div className="col-span-2">
                                    <p className="text-sm font-medium mb-2">Documento de identidade</p>
                                    <div className={`w-full flex justify-center ${isDocExpanded ? 'fixed inset-0 bg-black bg-opacity-50 z-50 p-4' : ''}`}>
                                        <div className={`relative ${isDocExpanded ? 'w-full h-full flex items-center justify-center' : ''}`}>
                                            {sale.annex.includes('drive.google.com') || sale.annex.toLowerCase().match(/\.(jpg|jpeg|png|gif|bmp|webp)$/) ? (
                                                <div className="relative h-fit" onClick={() => setIsDocExpanded(true)}>
                                                    <Image
                                                        width={500}
                                                        height={300}
                                                        src={sale.annex}
                                                        alt="Documento de identidade"
                                                        className={`${isDocExpanded ? 'w-auto h-auto max-h-[90vh] max-w-[90vw]' : 'w-full max-w-xl h-52'} object-contain rounded border-[1px] cursor-pointer`}
                                                    />
                                                </div>
                                            ) : sale.annex.toLowerCase().endsWith('.pdf') ? (
                                                <div className="relative w-full max-w-xl" onClick={() => setIsDocExpanded(true)}>
                                                    <iframe
                                                        src={`https://drive.google.com/viewerng/viewer?embedded=true&url=${encodeURIComponent(sale.annex)}`}
                                                        title="PDF Preview"
                                                        className={`${isDocExpanded ? 'w-[90vw] h-[90vh]' : 'w-full h-52'} border rounded cursor-pointer`}
                                                    />
                                                </div>
                                            ) : (
                                                <div className="text-red-500">Formato de arquivo não suportado</div>
                                            )}
                                            {isDocExpanded && (
                                                <button
                                                    onClick={() => setIsDocExpanded(false)}
                                                    className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100"
                                                >
                                                    <Minimize2 className="w-6 h-6" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className='flex items-center justify-between w-full bg-white shadow-md my-2 p-4 border-2 rounded-2xl'>
                                    <div className="flex gap-2 ">
                                        <Image
                                            src={sale.buyer.photo}
                                            alt="Foto do vendedor"
                                            width={50}
                                            height={50}
                                            className="rounded-full object-cover h-12 w-12 border-2 border-black p-0.5"
                                        />
                                        <div>
                                            <p className="font-semibold">{sale.buyer.firstName} {sale.buyer.firstName}</p>
                                            <p className="text-gray-500 text-sm">{sale.buyer.phone}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => {
                                        router.push(`/seller/chat/${(sale.sellerId).concat("_" + sale.buyer.userId)}`)
                                    }} >
                                        <MessageSquareText size={24} />
                                    </button>
                                </div>

                            </div>
                        </CardContent>
                    </>
                )}
                <CardFooter className="flex justify-center space-x-2">
                    {sale.state === "cancelled" && (
                        <Button onClick={() => handleUpdateState("pending")} variant="outline" className="w-full text-red-500 rounded-full max-w-72">Cancelar</Button>
                    )}
                    {sale.state === "pending" && (
                        <>
                            <Button onClick={() => handleUpdateState("confirmed")} variant="outline" className="w-full text-green-500 rounded-full max-w-72">Aceitar o pedido</Button>
                            <Button onClick={() => handleUpdateState("cancelled")} variant="outline" className="w-full text-red-500 rounded-full max-w-72">Rejeitar</Button>
                        </>
                    )}
                    {sale.state === "confirmed" && (
                        <Button onClick={() => handleUpdateState("pending")} variant="outline" className="w-full text-red-500 rounded-full max-w-72">Cancelar a confirmação</Button>
                    )}
                    {sale.state === "completed" && (
                        <Button disabled variant="secondary" className="w-full rounded-full bg-slate-300 max-w-72">Fechado</Button>
                    )}
                </CardFooter>
            </Card>
            {isLoading && (
                <div className="absolute inset-0 bg-black opacity-25 flex justify-center items-center z-40">
                    <div className="bg-white rounded text-black">
                        <Loader />
                    </div>
                </div>
            )}
        </div>
    );
}