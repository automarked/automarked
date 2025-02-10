"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { parse, isDate, differenceInYears } from "date-fns";
import { toast } from "@/hooks/use-toast";
import { createdInstance } from "@/hooks/useApi";
import { useCallback } from "react";
import { useUser } from "@/contexts/userContext";
import { User } from "lucide-react";

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
        message: "Os endereços de email devem coincidir!",
        path: ["repeatEmail"],
    });

type CreateCollaboratorSchema = z.infer<typeof createCollaboratorSchema>

export default function AccountSettings() {
    const { user, profile } = useUser()
    const showToast = (title: string, description: string) => {
        toast({
            title,
            description,
        });
    };
    const { register, reset, handleSubmit, setValue, formState: { errors } } = useForm<CreateCollaboratorSchema>({
        resolver: zodResolver(createCollaboratorSchema)
    })

    const handleCreateCollaborator = useCallback(async (data: CreateCollaboratorSchema) => {
        const { repeatEmail, ...collaborator } = data

        const userCreated = await createdInstance.post<{ message: string, record?: { id: string } }>('/auth/sign', {...collaborator, companyId: user?.uid, password: "123456", type: "collaborator"})
        if (userCreated.status === 201) {
            showToast("Successo!", `Conta de colaborador da ${profile?.companyName} criada com successo!`)
            reset()
        } else {
            showToast("Ocorreu algum erro inesperado!", userCreated.data.message)
        }
    }, [])

    return (
        <div className="w-full p-6 space-y-6 ">
            <h2 className="text-2xl font-bold helvetica-sans-serif">Contas associadas</h2>
            <div className="grid grid-cols-12">
                {/* Header */}
                <div className="flex items-center space-x-4 col-span-3">
                    <Avatar className="w-20 h-20">
                        <AvatarImage src="/profile.jpg" alt="Profile Image" />
                        <AvatarFallback>RD</AvatarFallback>
                    </Avatar>
                    <div>
                        <h1 className="text-xl font-bold">Richard Davis</h1>
                        <p className="text-sm text-muted-foreground">CEO / Co-Founder</p>
                    </div>
                </div>

                {/* Basic Info */}
                <form className="col-span-9" onSubmit={handleSubmit(handleCreateCollaborator)}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Associar nova conta</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4">
                                {/* First Name */}
                                <div>
                                    <label className="block text-sm font-medium">Primeiro nome</label>
                                    <Input placeholder="Richard" {...register("firstName")} />
                                    {errors.firstName && <span className="text-red-500">{errors.firstName.message}</span>}
                                </div>

                                {/* Last Name */}
                                <div>
                                    <label className="block text-sm font-medium">Apelido</label>
                                    <Input placeholder="Davis" {...register("lastName")} />
                                    {errors.lastName && <span className="text-red-500">{errors.lastName.message}</span>}
                                </div>

                                {/* Gender */}
                                <div>
                                    <label className="block text-sm font-medium">Gênero</label>
                                    <Select defaultValue="male" onValueChange={(value: "male" | "female") => setValue("gender", value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Masculino" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="male">Masculino</SelectItem>
                                            <SelectItem value="female">Feminino</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.gender && <span className="text-red-500">{errors.gender.message}</span>}
                                </div>

                                {/* Birth Date */}
                                <div>
                                    <label className="block text-sm font-medium">Data de nascimento</label>
                                    <Input placeholder="dd/MM/yyy" type="text" {...register("birthDate")} />
                                    {errors.birthDate && <span className="text-red-500">{errors.birthDate.message}</span>}
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-medium">Email</label>
                                    <Input placeholder="example@gmail.com" type="email" {...register("email")} />
                                    {errors.email && <span className="text-red-500">{errors.email.message}</span>}
                                </div>

                                {/* Confirm Email */}
                                <div>
                                    <label className="block text-sm font-medium">Confirme o Email</label>
                                    <Input placeholder="example@gmail.com" type="email" {...register("repeatEmail")} />
                                    {errors.repeatEmail && <span className="text-red-500">{errors.repeatEmail.message}</span>}
                                </div>

                                {/* Phone */}
                                <div>
                                    <label className="block text-sm font-medium">Número de telefone</label>
                                    <Input placeholder="+244 --- --- ---" type="tel" {...register("phone")} />
                                    {errors.phone && <span className="text-red-500">{errors.phone.message}</span>}
                                </div>
                            </div>
                            <div className="flex justify-end mt-8">
                                <Button type="submit">Associar conta</Button>
                            </div>
                        </CardContent>
                    </Card>
                </form>
            </div>
        </div>
    );
}
