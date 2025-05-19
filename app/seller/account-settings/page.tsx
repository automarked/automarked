"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { parse, isDate, differenceInYears, format } from "date-fns";
import { toast } from "@/hooks/use-toast";
import { createdInstance } from "@/hooks/useApi";
import { useCallback, useEffect, useState } from "react";
import { useUser } from "@/contexts/userContext";
import { User, Plus, Trash2, Edit, Mail, Phone, Calendar, UserPlus, AlertTriangle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog";

const createCollaboratorSchema = z
    .object({
        firstName: z.string().min(3, "É obrigatório que o nome tenha pelo menos 3 caracteres!"),
        lastName: z.string().min(3, "É obrigatório que o nome tenha pelo menos 3 caracteres!"),
        gender: z.enum(["male", "female"], { message: "Informe o gênero do associado!" }).default("male"),
        birthDate: z
            .string()
            .refine((date) => {
                const parsedDate = parse(date, "dd/MM/yyyy", new Date());
                return isDate(parsedDate) && !isNaN(parsedDate.getTime());
            }, {
                message: "Data de nascimento inválida! Use o formato dd/MM/yyyy.",
            })
            .refine((date) => {
                const parsedDate = parse(date, "dd/MM/yyyy", new Date());
                return differenceInYears(new Date(), parsedDate) >= 18;
            }, {
                message: "É necessário ter pelo menos 18 anos!",
            }),
        email: z.string().email("Endereço de email inválido!"),
        repeatEmail: z.string().email("Endereço de email inválido!"),
        phone: z
            .string()
            .refine((phone) => {
                const angolaPhoneRegex = /^(91|92|93|94|95)\d{7}$/;
                return angolaPhoneRegex.test(phone);
            }, {
                message: "Número de telefone inválido. Informe um contacto nacional.",
            }),
    })
    .refine((data) => data.email === data.repeatEmail, {
        path: ["repeatEmail"],
        message: "Os endereços de email devem coincidir!",
    });

type CreateCollaboratorSchema = z.infer<typeof createCollaboratorSchema>

interface Collaborator {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    gender: string;
    birthDate: string;
    createdAt: string;
}

export default function AccountSettings() {
    const { user } = useAuth()
    const {
        profile,
        collaborators,
        getCollaborators,
        deleteCollaborator
    } = useUser(user?.uid ?? '')
    const [isLoading, setIsLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [collaboratorToDelete, setCollaboratorToDelete] = useState<string | null>(null);

    const showToast = (title: string, description: string) => {
        toast({
            title,
            description,
        });
    };

    const { register, reset, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<CreateCollaboratorSchema>({
        resolver: zodResolver(createCollaboratorSchema)
    })

    useEffect(() => {
        getCollaborators();
    }, [getCollaborators]);

    const handleCreateCollaborator = useCallback(async (data: CreateCollaboratorSchema) => {
        const { repeatEmail, ...collaborator } = data
        try {
            const userCreated = await createdInstance.post<{ message: string, record?: { id: string } }>('/auth/sign', {
                companyName: profile?.companyName,
                companyId: profile?.userId,
                NIF: profile?.NIF,
                IBAN: profile?.NIF,
                alvara: profile?.alvara,
                background: profile?.background,
                bankName: profile?.bankName,
                certificado: profile?.certificado,
                description: profile?.description,
                ...collaborator,
                birthDate: collaborator?.birthDate,
                password: "123456",
                type: "collaborator"
            });

            if (userCreated.status === 201) {
                showToast("Successo!", `Conta de colaborador da ${profile?.companyName} criada com successo!`);
                reset();
                setShowForm(false);
                getCollaborators();
            } else {
                showToast("Ocorreu algum erro inesperado!", userCreated.data.message);
            }
        } catch (error: any) {
            showToast("Erro", error?.response?.data?.message || "Ocorreu um erro ao criar o colaborador");
        }
    }, [profile, reset, getCollaborators]);

    // Update the delete handler to open the dialog
    const openDeleteDialog = (collaboratorId: string) => {
        setCollaboratorToDelete(collaboratorId);
        setDeleteDialogOpen(true);
    };

    // HandleDeleteCollaborator function in the AccountSettings component
    const handleDeleteCollaborator = async () => {
        if (!collaboratorToDelete) return;

        setIsLoading(true);
        try {
            const success = await deleteCollaborator(collaboratorToDelete);
            if (success) {
                showToast("Sucesso!", "Colaborador removido com sucesso");
            } else {
                showToast("Erro", "Não foi possível remover o colaborador");
            }
        } catch (error) {
            console.error("Error deleting collaborator:", error);
            showToast("Erro", "Ocorreu um erro ao remover o colaborador");
        } finally {
            setIsLoading(false);
            setDeleteDialogOpen(false);
            setCollaboratorToDelete(null);
        }
    };

    const getInitials = (firstName: string, lastName: string) => {
        return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    };

    const formatDate = (dateInput: string | Date) => {
        try {
            let date: Date;
            if (typeof dateInput === "string") {
                date = parse(dateInput, "dd/MM/yyyy", new Date());
            } else {
                date = dateInput;
            }
            return format(date, "dd MMM, yyyy");
        } catch (error) {
            return typeof dateInput === "string" ? dateInput : dateInput.toString();
        }
    };

    return (
        <div className="w-full max-w-7xl p-6 space-y-8 mx-auto">

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-red-500" />
                            Confirmar remoção
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Tem certeza que deseja remover este colaborador? Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel
                            onClick={() => {
                                setCollaboratorToDelete(null);
                                setDeleteDialogOpen(false);
                            }}
                        >
                            Cancelar
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteCollaborator}
                            className="bg-red-500 hover:bg-red-600"
                        >
                            {isLoading ? (
                                <div className="flex items-center gap-2">
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                    <span>Removendo...</span>
                                </div>
                            ) : (
                                "Sim, remover"
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800 helvetica-sans-serif">Contas associadas</h2>
                    <p className="text-gray-500 mt-1">Gerencie as contas de colaboradores associadas à sua empresa</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowForm(!showForm)}
                    className="mt-4 md:mt-0 flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-all"
                >
                    {showForm ? "Cancelar" : <><UserPlus size={18} /> Adicionar colaborador</>}
                </motion.button>
            </div>

            {showForm && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <Card className="border-2 border-gray-100 shadow-lg rounded-xl overflow-hidden">
                        <CardHeader className="bg-gray-50">
                            <CardTitle className="flex items-center gap-2">
                                <UserPlus size={20} />
                                Associar nova conta
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <form onSubmit={handleSubmit(handleCreateCollaborator)}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Primeiro nome</label>
                                        <Input
                                            placeholder="John"
                                            {...register("firstName")}
                                            className={errors.firstName ? "border-red-500" : ""}
                                        />
                                        {errors.firstName && <span className="text-red-500 text-xs mt-1">{errors.firstName.message}</span>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1">Apelido</label>
                                        <Input
                                            placeholder="Simon"
                                            {...register("lastName")}
                                            className={errors.lastName ? "border-red-500" : ""}
                                        />
                                        {errors.lastName && <span className="text-red-500 text-xs mt-1">{errors.lastName.message}</span>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1">Gênero</label>
                                        <Select defaultValue="male" onValueChange={(value: "male" | "female") => setValue("gender", value)}>
                                            <SelectTrigger className={errors.gender ? "border-red-500" : ""}>
                                                <SelectValue placeholder="Masculino" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="male">Masculino</SelectItem>
                                                <SelectItem value="female">Feminino</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.gender && <span className="text-red-500 text-xs mt-1">{errors.gender.message}</span>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1">Data de nascimento</label>
                                        <Input
                                            placeholder="dd/mm/aaaa"
                                            type="text"
                                            {...register("birthDate")}
                                            className={errors.birthDate ? "border-red-500" : ""}
                                        />
                                        {errors.birthDate && <span className="text-red-500 text-xs mt-1">{errors.birthDate.message}</span>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1">Email</label>
                                        <Input
                                            placeholder="exemplo@gmail.com"
                                            type="email"
                                            {...register("email")}
                                            className={errors.email ? "border-red-500" : ""}
                                        />
                                        {errors.email && <span className="text-red-500 text-xs mt-1">{errors.email.message}</span>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1">Confirme o Email</label>
                                        <Input
                                            placeholder="exemplo@gmail.com"
                                            type="email"
                                            {...register("repeatEmail")}
                                            className={errors.repeatEmail ? "border-red-500" : ""}
                                        />
                                        {errors.repeatEmail && <span className="text-red-500 text-xs mt-1">{errors.repeatEmail.message}</span>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1">Número de telefone</label>
                                        <Input
                                            placeholder="912345678"
                                            type="tel"
                                            {...register("phone")}
                                            className={errors.phone ? "border-red-500" : ""}
                                        />
                                        {errors.phone && <span className="text-red-500 text-xs mt-1">{errors.phone.message}</span>}
                                    </div>
                                </div>
                                <div className="flex justify-end mt-8">
                                    <Button
                                        type="submit"
                                        className="bg-black hover:bg-gray-800 text-white px-6 py-2 rounded-lg"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? "Associando..." : "Associar conta"}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </motion.div>
            )}

            <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">Colaboradores associados</h3>

                {isLoading ? (
                    <div className="flex justify-center py-10">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
                    </div>
                ) : collaborators.length === 0 ? (
                    <div className="bg-gray-50 rounded-xl p-10 text-center">
                        <User size={40} className="mx-auto text-gray-400 mb-2" />
                        <p className="text-gray-500">Nenhum colaborador associado</p>
                        <Button
                            onClick={() => setShowForm(true)}
                            className="mt-4 bg-black hover:bg-gray-800 text-white"
                        >
                            Adicionar colaborador
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {collaborators.map((collaborator) => (
                            <motion.div
                                key={collaborator.userId}
                                whileHover={{ y: -5 }}
                                transition={{ duration: 0.2 }}
                                className="bg-white rounded-xl overflow-hidden shadow-md border border-gray-100"
                            >
                                <div className="p-6">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-12 w-12 bg-gray-200">
                                                <AvatarFallback>{getInitials(collaborator.firstName, collaborator.lastName)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <h4 className="font-semibold text-lg">{collaborator.firstName} {collaborator.lastName}</h4>
                                                <p className="text-sm text-gray-500">Colaborador</p>
                                            </div>
                                        </div>
                                        {/* <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                            onClick={() => openDeleteDialog(collaborator.userId)}
                                        >
                                            <Trash2 size={16} />
                                        </Button> */}
                                    </div>

                                    <div className="mt-4 space-y-2">
                                        <div className="flex items-center text-sm text-gray-600">
                                            <Mail size={16} className="mr-2" />
                                            {collaborator.email}
                                        </div>
                                        <div className="flex items-center text-sm text-gray-600">
                                            <Phone size={16} className="mr-2" />
                                            {collaborator.phone}
                                        </div>
                                        <div className="flex items-center text-sm text-gray-600">
                                            <Calendar size={16} className="mr-2" />
                                            {formatDate(collaborator.birthDate)}
                                        </div>
                                    </div>

                                    {/* <div className="mt-4 pt-4 border-t border-gray-100">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-gray-500">
                                                Adicionado em {new Date(collaborator.).toLocaleDateString()}
                                            </span>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="text-xs"
                                                onClick={() => {
                                                    // Future implementation for editing collaborator
                                                    showToast("Info", "Funcionalidade em desenvolvimento");
                                                }}
                                            >
                                                <Edit size={14} className="mr-1" /> Editar
                                            </Button>
                                        </div>
                                    </div> */}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
