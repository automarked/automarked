import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, CheckCircle, Maximize2, Minimize2, User, MessageSquareText, X, Calendar, Clock, ShoppingBag } from "lucide-react";
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
import { format } from "date-fns";
import { pt } from "date-fns/locale";

interface OrdersCardProps {
    sale: Sale;
    updateSale: () => Promise<void>
}

export default function OrderCard({ sale, updateSale }: OrdersCardProps) {
    const [minimized, setMinimized] = useState<boolean>(true);
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [state, setState] = useState<"pending" | "confirmed" | "cancelled" | "completed">(sale.state);
    const [vehicleExists, setVehicleExists] = useState<boolean>(true);
    const [isDesktop, setIsDesktop] = useState<boolean>(false);
    const { setLoading } = useMaterialLayout();
    const { inventory, removeVehicle } = useInventoryContext();
    const [image, setImage] = useState<string | null>(null);

    const [isDocExpanded, setIsDocExpanded] = useState(false);
    const router = useRouter();
    const resizeRef = useRef(null);

    const showToast = (title: string, description: string) => {
        toast({
            title,
            description,
        });
    };

    // Format date for display
    const formatDate = (saleDate: { seconds: number; nanoseconds: number; } | string | undefined) => {
        try {
            if (!saleDate) return "Data indisponível";

            // Handle Firebase Timestamp format
            if (typeof saleDate === 'object' && 'seconds' in saleDate) {
                // Convert Firebase Timestamp to JavaScript Date
                const date = new Date(saleDate.seconds * 1000);
                return format(date, "dd 'de' MMMM, yyyy 'às' HH:mm", { locale: pt });
            }

            // Handle string date format
            if (typeof saleDate === 'string') {
                const date = new Date(saleDate);
                return format(date, "dd 'de' MMMM, yyyy 'às' HH:mm", { locale: pt });
            }

            return "Data indisponível";
        } catch (e) {
            console.error("Error formatting date:", e);
            return "Data indisponível";
        }
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

    const handleUpdateState = async (state: "pending" | "confirmed" | "cancelled" | "completed") => {
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

    // Get badge variant based on state
    const getBadgeVariant = (state: string) => {
        switch (state) {
            case 'pending': return "pending";
            case 'confirmed': return "confirmed";
            case 'cancelled': return "cancelled";
            case 'completed': return "secondary";
            default: return "secondary";
        }
    };

    // Render the detailed content for both dialog and expanded card
    const renderDetailedContent = () => (
        <>
            <div className="flex flex-col items-center gap-4">
                <div className="relative w-full rounded-xl overflow-hidden group">
                    <Image
                        src={(sale.vehicle?.gallery?.length ? sale.vehicle.gallery[0] : image ?? "")}
                        alt={`Imagem do ${sale.vehicle.brand} ${sale.vehicle.model}`}
                        width={500}
                        height={300}
                        className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute top-2 right-2">
                        <Badge variant={getBadgeVariant(state)} className="flex items-center gap-1 shadow-md">
                            <CheckCircle className="w-4 h-4" /> {saleState[state]}
                        </Badge>
                    </div>
                </div>
                <div className="flex items-center gap-4 w-full">
                    <Carousel
                        opts={{
                            align: "start",
                        }}
                        className="w-full z-10"
                    >
                        <CarouselContent>
                            {sale.vehicle.gallery.map((galleryImage, index) => (
                                <CarouselItem key={index} onClick={() => setImage(galleryImage)} className="md:basis-1/6 basis-1/3 cursor-pointer">
                                    <div className="relative p-1 h-full">
                                        <Image
                                            src={galleryImage}
                                            alt={`Galeria de ${sale.vehicle.brand} ${sale.vehicle.model}`}
                                            width={100}
                                            height={100}
                                            className="w-full h-full rounded-lg object-cover border-[1px] border-slate-200 transition-all duration-200 hover:border-blue-400 hover:shadow-md"
                                        />
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className='-left-4 bg-white shadow-md hover:bg-gray-100' />
                        <CarouselNext className='-right-4 bg-white shadow-md hover:bg-gray-100' />
                    </Carousel>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="bg-gray-50 p-4 rounded-xl">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5 text-blue-500" />
                        Detalhes do Veículo
                    </h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <p className="text-sm font-medium text-gray-600">Marca</p>
                            <p className="text-sm font-semibold">{sale.vehicle.brand}</p>
                        </div>
                        <div className="flex justify-between items-center">
                            <p className="text-sm font-medium text-gray-600">Modelo</p>
                            <p className="text-sm font-semibold">{sale.vehicle.model}</p>
                        </div>
                        <div className="flex justify-between items-center">
                            <p className="text-sm font-medium text-gray-600">Preço</p>
                            <p className="text-sm font-semibold text-green-600">{formatCurrency(sale.vehicle.price)}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-blue-500" />
                        Informações do Pedido
                    </h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <p className="text-sm font-medium text-gray-600">Data do pedido</p>
                            <p className="text-sm font-semibold">{formatDate(sale.saleDate || "")}</p>
                        </div>
                        <div className="flex justify-between items-center">
                            <p className="text-sm font-medium text-gray-600">Estado</p>
                            <Badge variant={getBadgeVariant(state)} className="flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" /> {saleState[state]}
                            </Badge>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-500" />
                    Informações do Cliente
                </h3>
                <div className="bg-gray-50 p-4 rounded-xl">
                    <div className="flex items-center gap-4 mb-4">
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
                        <div>
                            <p className="font-semibold">{sale.buyer.firstName} {sale.buyer.lastName}</p>
                            <div className="flex items-center gap-2 text-gray-600 text-sm mt-1">
                                <MapPin className="w-4 h-4" />
                                <span>{sale.address.municipality}, {sale.address.province}</span>
                            </div>
                        </div>
                    </div>

                    <Button
                        onClick={() => {
                            router.push(`/seller/chat/${(sale.sellerId).concat("_" + sale.buyer.userId)}`)
                        }}
                        className="w-full flex items-center justify-center gap-2 mt-2 rounded-full"
                    >
                        <MessageSquareText size={18} />
                        Conversar com o Cliente
                    </Button>
                </div>
            </div>

            {sale.annex && (
                <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-4">Documento de Identidade</h3>
                    <div className={`w-full flex justify-center ${isDocExpanded ? 'fixed inset-0 bg-black bg-opacity-50 z-50 p-4' : ''}`}>
                        <div className={`relative ${isDocExpanded ? 'w-full h-full flex items-center justify-center' : ''}`}>
                            {sale.annex.includes('drive.google.com') || sale.annex.toLowerCase().match(/\.(jpg|jpeg|png|gif|bmp|webp)$/) ? (
                                <div className="relative h-fit" onClick={() => setIsDocExpanded(true)}>
                                    <Image
                                        width={500}
                                        height={300}
                                        src={sale.annex}
                                        alt="Documento de identidade"
                                        className={`${isDocExpanded ? 'w-auto h-auto max-h-[90vh] max-w-[90vw]' : 'w-full max-w-xl h-52'} object-contain rounded-xl border-[1px] cursor-pointer shadow-md hover:shadow-lg transition-shadow duration-200`}
                                    />
                                </div>
                            ) : sale.annex.toLowerCase().endsWith('.pdf') ? (
                                <div className="relative w-full max-w-xl" onClick={() => setIsDocExpanded(true)}>
                                    <iframe
                                        src={`https://drive.google.com/viewerng/viewer?embedded=true&url=${encodeURIComponent(sale.annex)}`}
                                        title="PDF Preview"
                                        className={`${isDocExpanded ? 'w-[90vw] h-[90vh]' : 'w-full h-52'} border rounded-xl cursor-pointer shadow-md hover:shadow-lg transition-shadow duration-200`}
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
                                    <X className="w-6 h-6" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );

    // Render the action buttons for both dialog and expanded card
    const renderActionButtons = () => (
        <div className="mx-auto flex w-full flex-wrap justify-center gap-4 mt-6">
            {sale.state === "cancelled" && (
                <Button onClick={() => handleUpdateState("pending")} variant="outline" className="w-full text-blue-500 border-blue-500 hover:bg-blue-50 rounded-full max-w-72 transition-all duration-200">
                    Restaurar Pedido
                </Button>
            )}
            {sale.state === "pending" && (
                <>
                    <Button
                        onClick={() => handleUpdateState("confirmed")}
                        variant="outline"
                        className="w-full text-green-500 border-green-500 hover:bg-green-50 rounded-full max-w-72 transition-all duration-200 flex items-center gap-2"
                    >
                        <CheckCircle className="w-4 h-4" />
                        Aceitar o pedido
                    </Button>
                    <Button
                        onClick={() => handleUpdateState("cancelled")}
                        variant="outline"
                        className="w-full text-red-500 border-red-500 hover:bg-red-50 rounded-full max-w-72 transition-all duration-200 flex items-center gap-2"
                    >
                        <X className="w-4 h-4" />
                        Rejeitar
                    </Button>
                </>
            )}
            {sale.state === "confirmed" && (
                <>
                    <Button
                        onClick={() => handleUpdateState("pending")}
                        variant="outline"
                        className="w-full text-red-500 border-red-500 hover:bg-red-50 rounded-full max-w-72 transition-all duration-200"
                    >
                        Cancelar a confirmação
                    </Button>
                    <Button
                        onClick={() => handleUpdateState("completed")}
                        variant="outline"
                        className="w-full text-slate-500 border-slate-500 hover:bg-slate-50 rounded-full max-w-72 transition-all duration-200 flex items-center gap-2"
                    >
                        <CheckCircle className="w-4 h-4" />
                        Venda concluída
                    </Button>
                </>
            )}
            {sale.state === "completed" && vehicleExists && (
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button
                            variant="outline"
                            className="w-full text-red-500 border-red-500 hover:bg-red-50 rounded-full max-w-72 transition-all duration-200 flex items-center gap-2"
                        >
                            <X className="w-4 h-4" />
                            Eliminar do inventário
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="rounded-xl">
                        <AlertDialogHeader>
                            <AlertDialogTitle>Tem a certeza que deseja apagar este veículo?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Esta açao não pode ser desfeita.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="px-4 pb-4">
                            <AlertDialogCancel className="rounded-3xl py-4">Cancelar</AlertDialogCancel>
                            <AlertDialogAction className="rounded-3xl py-4 bg-red-500 hover:bg-red-600" onClick={() => handleRemoveFromInventory(sale.vehicle.vehicleId)}>Continuar</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
        </div>
    );

    return (
        <div className="mb-6">
            {/* Main Card */}
            <Card
                ref={resizeRef}
                className={`min-w-[300px] md:flex md:items-center md:space-y-5 md:justify-between grow w-full border rounded-xl shadow-md relative transition-all duration-300 hover:shadow-lg ${!isDesktop && !minimized ? 'absolute left-0 right-0 buttom-0 top-0 h-screen w-full overflow-y-auto z-20' : ''}`}
            >
                <div
                    onClick={handleToggleResize}
                    className="absolute right-3 top-3 md:top-3 md:right-3 bg-slate-100 hover:bg-slate-200 p-1.5 rounded-full cursor-pointer transition-colors duration-200 z-10"
                >
                    {minimized || isDesktop ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                </div>

                {/* Minimized view (always shown for mobile, or when minimized for desktop) */}
                {(minimized || isDesktop) && (
                    <div className="flex p-4 items-center mt-2 md:mt-0 w-full">
                        <div
                            onClick={() => { if (isDesktop) handleToggleResize(); }}
                            className="flex items-center space-x-3 md:cursor-pointer flex-1"
                        >
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
                            <div className="flex flex-col text-sm">
                                <p className="font-bold">{sale.buyer.firstName} {sale.buyer.lastName}</p>
                                <p className="text-gray-600">{sale.vehicle.brand} {sale.vehicle.model}</p>
                                <p className="text-sm text-green-600 font-medium">{formatCurrency(sale.vehicle.price)}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-full hover:bg-blue-50 hover:text-blue-500"
                                onClick={() => {
                                    router.push(`/seller/chat/${(sale.sellerId).concat("_" + sale.buyer.userId)}`)
                                }}
                            >
                                <MessageSquareText className="w-5 h-5" />
                            </Button>
                            <Badge variant={getBadgeVariant(state)} className="flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" /> {saleState[state]}
                            </Badge>
                        </div>
                    </div>
                )}

                {/* Expanded view for mobile only (when not minimized) */}
                {!isDesktop && !minimized && (
                    <>
                        <CardHeader className="flex justify-between items-center pt-8">
                            <CardTitle className="text-xl font-bold">{sale.vehicle.brand} {sale.vehicle.model}</CardTitle>
                            <Badge variant={getBadgeVariant(sale.state)} className="flex items-center gap-1">
                                <CheckCircle className="w-4 h-4" /> {saleState[sale.state]}
                            </Badge>
                        </CardHeader>
                        <CardContent className="space-y-4 px-6">
                            {renderDetailedContent()}
                        </CardContent>
                        <CardFooter className="flex justify-center space-x-2 px-6 pb-6">
                            {renderActionButtons()}
                        </CardFooter>
                    </>
                )}
            </Card>

            {/* Dialog for desktop view */}
            {isDesktop && (
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl p-6">
                        <DialogHeader>
                            <DialogTitle className="flex justify-between items-center text-xl font-bold">
                                <span>{sale.vehicle.brand} {sale.vehicle.model}</span>
                                <Badge variant={getBadgeVariant(sale.state)} className="flex items-center gap-1">
                                    <CheckCircle className="w-4 h-4" /> {saleState[sale.state]}
                                </Badge>
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
