import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, CheckCircle, Maximize2, Minimize2, User, MessageSquareText, X } from "lucide-react";
import Sale from "@/models/sale";
import { saleState } from "@/utils/saleState";
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { formatCurrency } from "@/scripts/format-price";
import { useRouter } from "next/navigation";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog"
import { createdInstance } from "@/hooks/useApi";
import { toast } from "@/hooks/use-toast";
import { useMaterialLayout } from "@/contexts/LayoutContext";
import { useInventoryContext } from "@/contexts/InventoryContext";


interface OrdersCardProps {
    sale: Sale;
    updateSale: () => Promise<void>
}

export default function OrderCard({ sale, updateSale }: OrdersCardProps) {
    const [minimized, setMinimized] = useState<boolean>(true);
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [state, setState] = useState<string>(sale.state);
    const [vehicleExists, setVehicleExists] = useState<boolean>(true);
    const [isDesktop, setIsDesktop] = useState<boolean>(false);
    const { setLoading } = useMaterialLayout();
    const { inventory, removeVehicle } = useInventoryContext();

    const [isDocExpanded, setIsDocExpanded] = useState(false);
    const router = useRouter();
    const resizeRef = useRef(null);

    const showToast = (title: string, description: string) => {
        toast({
            title,
            description,
        });
    };

    // Check if screen is desktop (min-width: 768px)
    useEffect(() => {
        const checkScreenSize = () => {
            setIsDesktop(window.innerWidth >= 768);
        };

        // Initial check
        checkScreenSize();

        // Add event listener for window resize
        window.addEventListener('resize', checkScreenSize);

        // Cleanup
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    const handleToggleResize = () => {
        if (isDesktop) {
            // For desktop, open dialog
            setIsDialogOpen(true);
        } else {
            // For mobile, use the existing fullscreen approach
            setMinimized(!minimized);
        }
    };

    useEffect(() => {
        const vehicle = inventory.some(veh => veh.vehicles.vehicleId === sale.vehicle.vehicleId);
        setVehicleExists(vehicle);
    }, [inventory, sale.vehicle.vehicleId]);

    const handleRemoveFromInventory = useCallback((vehicleId: string) => {
        removeVehicle(vehicleId);
    }, [removeVehicle]);

    const handleUpdateState = async (state: string) => {
        setLoading(true);

        try {
            const response = await createdInstance.put(`/sales/${sale.saleId}/${state}`);

            if (response.status === 200) {
                setLoading(false);
                setState(state);
                await updateSale();
                showToast('Pedido atualizado com sucesso!', 'O estado do pedido foi atualizado com sucesso.');
            } else {
                setLoading(false);
                console.log(response.data);
                showToast('Erro ao actualizar o pedido!', 'Ocorreu um erro ao actualizar o estado do pedido.');
            }
        } catch (error) {
            setLoading(false);
            console.error('Erro ao actualizar o pedido:', error);
            showToast('Erro ao actualizar o pedido!', 'Ocorreu um erro ao actualizar o estado do pedido.');
        }
    };

    // Render the detailed content for both dialog and expanded card
    const renderDetailedContent = () => (
        <>
            <div className="flex flex-col items-center gap-4">
                <div className="">
                    <Image
                        src={sale.vehicle.gallery[0] ?? ''}
                        alt={`Imagem do ${sale.vehicle.brand} ${sale.vehicle.model}`}
                        width={500}
                        height={300}
                        className="w-full h-64 object-cover border-[1px] border-slate-200"
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
                                <CarouselItem key={index} className="md:basis-1/6 basis-1/3 cursor-pointer">
                                    <Image
                                        src={galleryImage}
                                        alt={`Galeria de ${sale.vehicle.brand} ${sale.vehicle.model}`}
                                        width={100}
                                        height={100}
                                        className="w-full h-full rounded-lg object-cover border-[1px] border-slate-200"
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
                    <p className="text-sm text-start text-muted-foreground">
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
                <div onClick={() => {
                    router.push(`/seller/chat/${(sale.sellerId).concat("_" + sale.buyer.userId)}`)
                }} className='flex items-center justify-between w-full bg-white shadow-md my-2 p-4 border-2 rounded-2xl cursor-pointer'>
                    <div className="flex items-center space-x-2">
                        {sale.buyer.photo ? (
                            <Image
                                width={100}
                                height={100}
                                src={sale.buyer.photo ?? ''}
                                alt="Imagem do usuário"
                                className="w-14 h-14 object-cover border-[1px] border-slate-200 rounded-full"
                            />
                        ) : (
                            <Avatar className="w-14 h-14">
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
                    <button>
                        <MessageSquareText size={24} />
                    </button>
                </div>
            </div>
        </>
    );

    // Render the action buttons for both dialog and expanded card
    const renderActionButtons = () => (
        <div className="mx-auto flex w-full justify-center gap-4">
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
                <>
                    <Button onClick={() => handleUpdateState("pending")} variant="outline" className="w-full text-red-500 rounded-full max-w-72">Cancelar a confirmação</Button>
                    <Button onClick={() => handleUpdateState("completed")} variant="outline" className="w-full text-slate-500 rounded-full max-w-72">Venda concluída</Button>
                </>
            )}
            {sale.state === "completed" && vehicleExists && (
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="outline" className="w-full text-red-500 rounded-full max-w-72">Eliminar do inventário</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Tem a certeza que deseja apagar este veículo?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Esta açao não pode ser desfeita.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="px-4 pb-4">
                            <AlertDialogCancel className="rounded-3xl py-4">Cancelar</AlertDialogCancel>
                            <AlertDialogAction className="rounded-3xl py-4" onClick={() => handleRemoveFromInventory(sale.vehicle.vehicleId)}>Continuar</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
        </div>
    );

    return (
        <div className="mb-3">
            {/* Main Card */}
            <Card ref={resizeRef} className={`min-w-[300px] grow w-full border rounded-lg shadow-md relative shadow-sm ${!isDesktop && !minimized ? 'absolute left-0 right-0 buttom-0 top-0 h-screen w-full overflow-y-auto z-20' : ''}`}>
                <div onClick={handleToggleResize} className="absolute right-3 top-3 bg-slate-100 hover:bg-slate-200 px-2 rounded cursor-pointer">
                    {minimized || isDesktop ? <Maximize2 width={9} /> : <Minimize2 width={9} />}
                </div>

                {/* Minimized view (always shown for mobile, or when minimized for desktop) */}
                {(minimized || isDesktop) && (
                    <div className="flex p-3 items-center mt-6">
                        <div className="flex items-center space-x-2">
                            {sale.buyer.photo ? (
                                <Image
                                    width={100}
                                    height={100}
                                    src={sale.buyer.photo ?? ''}
                                    alt="Imagem do usuário"
                                    className="w-14 h-14 object-cover border-[1px] border-slate-200 rounded-full"
                                />
                            ) : (
                                <Avatar className="w-14 h-14">
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
                                {state === 'completed' && (
                                    <Badge variant="secondary" className="flex items-center justify-center gap-1">
                                        <CheckCircle className="w-4 h-4" /> {saleState[state]}
                                    </Badge>
                                )}
                            </p>
                        </div>
                    </div>
                )}

                {/* Expanded view for mobile only (when not minimized) */}
                {!isDesktop && !minimized && (
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
                            {sale.state === 'completed' && (
                                <Badge variant="secondary" className="flex items-center justify-center gap-1">
                                    <CheckCircle className="w-4 h-4" /> {saleState[sale.state]}
                                </Badge>
                            )}
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {renderDetailedContent()}
                        </CardContent>
                    </>
                )}

                <CardFooter className="flex justify-center space-x-2">
                    {renderActionButtons()}
                </CardFooter>
            </Card>

            {/* Dialog for desktop view */}
            {isDesktop && (
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle className="flex justify-between items-center mt-4">
                                <span>{sale.vehicle.brand} {sale.vehicle.model}</span>
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
                                {sale.state === 'completed' && (
                                    <Badge variant="secondary" className="flex items-center justify-center gap-1">
                                        <CheckCircle className="w-4 h-4" /> {saleState[sale.state]}
                                    </Badge>
                                )}
                            </DialogTitle>
                        </DialogHeader>

                        <div className="space-y-4 py-4">
                            {renderDetailedContent()}
                        </div>

                        <DialogFooter className="flex justify-center space-x-2 pt-4">
                            {renderActionButtons()}
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
}