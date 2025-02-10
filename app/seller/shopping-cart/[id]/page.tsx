'use client'

import { useShoppingCart } from "@/contexts/ShoppingCartContext";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { QRCodeSVG } from 'qrcode.react';

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
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

import FileUploader from "@/components/fileUploader";
import { BriefcaseBusiness, CheckCheckIcon, MapPinHouse, User } from "lucide-react";
import { createdInstance } from "@/hooks/useApi";
import { useUser } from "@/contexts/userContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { Vehicle } from "@/models/vehicle";
import { IUser } from "@/models/user";
import Image from "next/image";
import { formatCurrency } from "@/scripts/format-price";
import { useSalesContext } from "@/contexts/SalesContext";
import Sale from "@/models/sale";
import { useRouter, useSearchParams } from "next/navigation";
import Payment from "@/components/payment";
import Loader from "@/components/loader";


interface AddressFormData {
    municipality: string;
    province: string;
    document: File | null;
}

interface PaymentTokenResponse {
    frame: string,
}


export default function ShoppingCartPage({ params }: { params: { id: string } }) {
    const { user } = useAuth()
    const [seller, setSeller] = useState<IUser | null>(null);
    const { profile, getUser } = useUser(user?.uid ?? '')
    const [vehicle, setVehicle] = useState<Vehicle | null>(null);
    const [addressData, setAddressData] = useState<AddressFormData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { sales, createSale } = useSalesContext()
    const [sale, setSale] = useState<Sale | null>(null);
    const [state, setState] = useState<string>(sale?.state ?? '');

    const { vehicles, totalCartValue } = useShoppingCart()
    const formRef = useRef<HTMLFormElement>(null);

    const router = useRouter()

    const [paymentToken, setPaymentToken] = useState<PaymentTokenResponse | null>(null)

    const getPaymentId = useCallback(async () => {
        if (sale) {
            const response = await createdInstance.post<PaymentTokenResponse>("/auth/payment", {
                "saleId": sale.saleId, // salleId
                "amount": sale.vehicle.price.toString(), // salePrice
            })
            console.log(sale.vehicle.price)
            if (response.status === 200) {
                const data = response.data
                setPaymentToken(data);
            }
        }
    }, [setPaymentToken, sale])

    const saleState = {
        "pending": "Pendente",
        "confirmed": "Continuar compra",
        "cancelled": "Refazer pedido"
    }

    useEffect(() => {
        getPaymentId()
    }, [sale])


    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true)
        const updateState = "pending"

        const formData = new FormData();
        var address = {
            municipality: addressData?.municipality,
            province: addressData?.province,
        }
        console.log(address)
        if (sale?.state === "cancelled") {
            if (address.province || address.municipality) {
                address = {
                    municipality: address.municipality ? address.municipality : sale.address.municipality,
                    province: address.province ? address.province : sale.address.province
                }
                formData.append('address', JSON.stringify(address));
                console.log(address)
            }

            if (addressData?.document) {
                formData.append('file', addressData.document, addressData.document.name);
            }

            formData.append('state', updateState.toString());
            console.log(formData.get('address'))
            try {
                const response = await createdInstance.put(`/sales/${sale?.saleId}`, formData);

                if (response.status === 200) {
                    setState("pending")
                    setIsLoading(false)
                    showToast('Pedido reenviado com sucesso!', '');
                } else {
                    console.log(response.data)
                    setIsLoading(false)
                }
            } catch (error) {
                setIsLoading(false)
                showToast('Erro ao realizar o pedido!', '');
                console.error('Erro ao realizar o pedido:', error);
            }

        } else {
            if (addressData?.document) {
                console.log(addressData.document)
                console.log(vehicles)
                formData.append('file', addressData?.document, addressData?.document.name);
                formData.append('sellerId', vehicle?.userId?.toString() ?? '');
                formData.append('buyerId', user?.uid.toString() ?? '');
                formData.append('price', totalCartValue.toString());
                formData.append('vehicle', JSON.stringify(vehicle));
                formData.append('address', JSON.stringify(address));

                const response = await createSale(formData)
                showToast(`${response.message}`, '')
                setState(response.sale.state ?? '')
                setIsLoading(false)
                console.log(state)
            } else {
                setIsLoading(false)
                showToast('Precisas carregar o seu BI!', '');
            }
        }

    };

    const showToast = (title: string, description: string) => {
        toast({
            title,
            description,
        });
    };

    const getById = useCallback(async (id: string) => {
        const response = await createdInstance.get<{ record: Vehicle }>('/vehicles/' + id)
        if (response.status <= 201) setVehicle(response.data.record)
    }, [user, params])

    useEffect(() => {
        (async () => {
            if (vehicle) {
                const userSeller = await getUser(vehicle.userId);
                if (userSeller)
                    setSeller(userSeller);
            }
        })();
    }, [vehicle]);

    useEffect(() => {
        const index = sales.findIndex(sale => sale.saleId.includes(params.id));
        if (index > -1) {
            setSale(sales[index])
            setState(sale?.state ?? '')
            console.log(state)
            setVehicle(sales[index].vehicle)
        } else {
            getById(params.id)
        }
    }, [user, params, sales, sale])

    const searchParams = useSearchParams()
    const isPayment = searchParams.get('payment')

    return (
        <div className="h-screen bg-zinc-100" >
            <div className="relative w-full h-fit p-2 pb-0" >
                <div className="flex flex-col justify-between space-y-1.5">
                    <h2 className="monserrat text-xl font-bold">
                        {state === 'confirmed' ? (
                            <div className="flex flex-col space-x-2">
                                <div className="flex my-2">
                                    <CheckCheckIcon className="text-green-500" />
                                    <div className="flex text-green-500">Pedido confirmado</div>
                                </div>
                                <QRCodeSVG className="" value={JSON.stringify(sale?.saleId)} />
                            </div>
                        ) : (
                            <span>Realizar compra</span>
                        )}
                    </h2>
                    <div className=""></div>
                    <div className="flex bg-white space-x-4 p-2 rounded-2xl shadow-sm">
                        <Image
                            width={100}
                            height={100}
                            src={vehicle?.photo ?? ''}
                            alt="Imagem do produto"
                            className="w-28 h-28 object-cover rounded-2xl"
                        />
                        <div className="flex flex-col space-y-3 ">
                            <div className="text-slate-900 font-bold py-1 basis-1/3">
                                {vehicle?.brand} {vehicle?.model}
                            </div>
                            <div className="flex flex-col space-y-1.5 basis-1/3">
                                <div className="text-slate-400 text-xs">
                                    Total:
                                    <span className="text-slate-600 font-bold ms-2">{formatCurrency(vehicle?.price ?? '')}</span>
                                </div>
                                <div className="text-slate-400 text-xs">
                                    Vendedor:
                                    <span className="text-slate-600 font-bold ms-2">{seller?.firstName + " " + seller?.lastName}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex bg-white p-2 shadow-sm">
                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="item-1" className="border-none">
                                <AccordionTrigger>Detalhes</AccordionTrigger>
                                <AccordionContent className="flex text-sm justify-around">
                                    <ul className="flex flex-col">
                                        <li className="flex items-center space-x-1.5">
                                            <span className="font-semibold text-xs text-xs">Marca:</span>
                                            <span className="text-slate-600">{vehicle?.brand}</span>
                                        </li>
                                        <li className="flex items-center space-x-1.5">
                                            <span className="font-semibold text-xs">Cor:</span>
                                            <span className="text-slate-600">{vehicle?.color}</span>
                                        </li>
                                        <li className="flex items-center space-x-1.5">
                                            <span className="font-semibold text-xs">Quilometragem:</span>
                                            <span className="text-slate-600">{vehicle?.mileage}</span>
                                        </li>
                                        <li className="flex items-center space-x-1.5">
                                            <span className="font-semibold text-xs">Potência do Motor:</span>
                                            <span className="text-slate-600">{vehicle?.vehicleType}</span>
                                        </li>
                                        <li className="flex items-center space-x-1.5">
                                            <span className="font-semibold text-xs">Modelo:</span>
                                            <span className="text-slate-600">{vehicle?.licensePlate}</span>
                                        </li>
                                        <li className="flex items-center space-x-1.5">
                                            <span className="font-semibold text-xs">Condição:</span>
                                            <span className="text-slate-600">{vehicle?.condition}</span>
                                        </li>
                                    </ul>
                                    <ul className="flex flex-col">
                                        <li className="flex items-center space-x-1.5">
                                            <span className="font-semibold text-xs">Matrícula:</span>
                                            <span className="text-slate-600">{vehicle?.licensePlate}</span>
                                        </li>
                                        {vehicle?.specifications.map((specification, index) => (
                                            <li key={index} className="flex items-center space-x-1.5">
                                                <span className="font-semibold text-xs">{specification.label}:</span>
                                                <span className="text-slate-600">{specification.description}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>
                </div>
            </div>

            <div className="space-y-1.5 pb-14">
                <div className="p-2 flex flex-col justify-center items-center space-y-1.5">
                    <Card className="grow w-full shadow-none">
                        <CardTitle className="flex items-center space-x-2 ms-6 my-5">
                            <BriefcaseBusiness strokeWidth={1.5} />
                            <span>Informações da empresa</span>
                        </CardTitle>
                        <CardContent>
                            <div className="grid w-full items-center gap-4">
                                <div className="flex flex-col text-xs space-y-1.5">
                                    <div className="text-slate-400">
                                        Nome:
                                        <span className="text-slate-600 font-bold ms-2">
                                            {seller?.companyName}
                                        </span>
                                    </div>
                                    <div className="text-slate-400">
                                        Endereço do registro:
                                        <span className="text-slate-600 font-bold ms-2">Luanda, Angola</span>
                                    </div>
                                    <div className="text-slate-400">
                                        NIF:
                                        <span className="text-slate-600 font-bold ms-2">{seller?.NIF}</span>
                                    </div>
                                    <div className="text-slate-400">
                                        Email:
                                        <span className="text-slate-600 font-bold ms-2">{seller?.email}</span>
                                    </div>
                                    <div className="text-slate-400">
                                        Telefone:
                                        <span className="text-slate-600 font-bold ms-2">{seller?.phone}</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="grow w-full shadow-none">
                        <CardTitle className="flex items-center space-x-2 ms-6 my-5">
                            <User strokeWidth={1.5} />
                            <span>Informações do cliente</span>
                        </CardTitle>
                        <CardContent>
                            <div className="grid w-full items-center gap-4">
                                <div className="flex flex-col text-xs space-y-1.5">
                                    <div className="text-slate-400">
                                        Nome:
                                        <span className="text-slate-600 font-bold ms-2">
                                            {profile?.firstName + " " + profile?.lastName}
                                        </span>
                                    </div>
                                    {profile?.municipality && profile?.province && (
                                        <div className="text-slate-400">
                                            Endereço:
                                            <span className="text-slate-600 font-bold ms-2">{profile?.municipality + ", " + profile?.province}</span>
                                        </div>
                                    )}
                                    <div className="text-slate-400">
                                        Email:
                                        <span className="text-slate-600 font-bold ms-2">
                                            {profile?.email}
                                        </span>
                                    </div>
                                    <div className="text-slate-400">
                                        Telefone:
                                        <span className="text-slate-600 font-bold ms-2">
                                            {profile?.phone}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    {!sale &&
                        <Card className="grow w-full shadow-none">
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <MapPinHouse strokeWidth={1.5} />
                                    <span>Endereço actual</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form ref={formRef} onSubmit={handleSubmit}>
                                    <div className="grid w-full items-center gap-4">
                                        <div className="flex flex-col space-y-1.5">
                                            <Input
                                                id="municipality"
                                                placeholder="Município"
                                                className="shadow-none text-sm"
                                                value={addressData?.municipality}
                                                onChange={(e) => setAddressData((prev) => {
                                                    if (!prev) {
                                                        return {
                                                            province: '',
                                                            municipality: e.target.value,
                                                            document: null
                                                        }
                                                    }
                                                    return {
                                                        ...prev,
                                                        municipality: e.target.value
                                                    }
                                                })}
                                            />
                                        </div>
                                        <div className="flex flex-col space-y-1.5">
                                            <Input
                                                id="province"
                                                placeholder="Província"
                                                className="shadow-none text-sm"
                                                value={addressData?.province ?? ''}
                                                onChange={(e) => setAddressData(prev => {
                                                    if (!prev) {
                                                        return {
                                                            province: e.target.value,
                                                            municipality: '',
                                                            document: null
                                                        }
                                                    }
                                                    return {
                                                        ...prev,
                                                        province: e.target.value
                                                    }
                                                })}
                                            />
                                        </div>
                                        <div className="flex flex-col space-y-1.5">
                                            <FileUploader
                                                onFileSelect={(file) => {
                                                    setAddressData(prev => ({
                                                        ...prev!,
                                                        document: file
                                                    }));
                                                }}
                                                previewFile={null}
                                                multiple={false}
                                            />
                                        </div>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    }
                    {sale?.state === "cancelled" &&
                        <Card className="grow w-full shadow-none">
                            <CardHeader>
                                <CardTitle className="flex items-center space-x-2">
                                    <MapPinHouse strokeWidth={1.5} />
                                    <span>Endereço actual</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form ref={formRef} onSubmit={handleSubmit}>
                                    <div className="grid w-full items-center gap-4">
                                        <div className="flex flex-col space-y-1.5">
                                            <Input
                                                id="municipality"
                                                placeholder={sale?.address.municipality}
                                                className="shadow-none text-sm"
                                                value={addressData?.municipality}
                                                onChange={(e) => setAddressData((prev) => {
                                                    if (!prev) {
                                                        return {
                                                            province: '',
                                                            municipality: e.target.value,
                                                            document: null
                                                        }
                                                    }
                                                    return {
                                                        ...prev,
                                                        municipality: e.target.value
                                                    }
                                                })}
                                            />
                                        </div>
                                        <div className="flex flex-col space-y-1.5">
                                            <Input
                                                id="province"
                                                placeholder={sale?.address.province}
                                                className="shadow-none text-sm"
                                                value={addressData?.province ?? ''}
                                                onChange={(e) => setAddressData(prev => {
                                                    if (!prev) {
                                                        return {
                                                            province: e.target.value,
                                                            municipality: '',
                                                            document: null
                                                        }
                                                    }
                                                    return {
                                                        ...prev,
                                                        province: e.target.value
                                                    }
                                                })}
                                            />
                                        </div>
                                        <div className="flex flex-col space-y-1.5">
                                            <FileUploader
                                                onFileSelect={(file) => {
                                                    setAddressData(prev => ({
                                                        ...prev!,
                                                        document: file
                                                    }));
                                                }}
                                                previewFile={sale?.annex}
                                                multiple={false}
                                            />


                                        </div>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    }
                </div>

                <div className="absolute flex justify-center bg-white w-full bottom-0 py-2 px-4 gap-8">
                    {state === 'pending' && (
                        <>
                            <span className="text-sm flex items-center text-orange-400 font-bold"> Seu pedido está pendente de confirmação.</span>

                            <Button
                                className="bg-red-400 grow rounded-full"
                                disabled
                            >
                                {saleState[state]}
                            </Button>
                        </>
                    )}
                    {state === 'cancelled' && (
                        <>
                            <span className="text-sm flex items-center text-red-400 font-bold"> Pedido rejeitado.</span>

                            <Button
                                onClick={() => formRef.current?.requestSubmit()}
                                className="bg-orange-400 grow rounded-full"
                            >
                                Fazer outro pedido
                            </Button>
                        </>
                    )}
                    {state === 'confirmed' && paymentToken && (
                        <>
                            <Button
                                onClick={() => window.location.href = paymentToken.frame}
                                className="bg-green-500 grow rounded-full"
                            >
                                {saleState[state]}

                            </Button>
                        </>
                    )}
                    {!sale && (
                        <>
                            <Button
                                onClick={() => formRef.current?.requestSubmit()}
                                className="bg-orange-400 grow rounded-full"
                            >
                                Fazer pedido
                            </Button>
                        </>
                    )}
                </div>
            </div>
            {isLoading && (
                <div className="absolute inset-0 bg-black opacity-25 flex justify-center items-center">
                    <div className="bg-white rounded text-black">
                        <Loader />
                    </div>
                </div>
            )}
        </div>
    )
}
