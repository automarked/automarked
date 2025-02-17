'use client';

import { useCallback, useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import { z } from 'zod';
import { createdInstance } from '@/hooks/useApi';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

const customerSchema = z.object({
    firstName: z.string().nonempty("O primeiro nome é obrigatório"),
    lastName: z.string().nonempty("O último nome é obrigatório"),
    email: z.string().email("E-mail inválido"),
    phone: z.string().nonempty("O telefone é obrigatório"),
    birthDate: z.string().nonempty("A data de nascimento é obrigatória"),
    password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres").nonempty("A senha é obrigatória"),
    repeatedPassword: z.string().nonempty("A repetição de senha é obrigatória"),
})

const sellerSchema = customerSchema.extend({
    NIF: z.string().nonempty("O NIF é obrigatório"),
    companyName: z.string().nonempty("O nome da empresa é obrigatório"),
    alvara: z.string().nonempty("O alvará comercial é obrigatório"),
    certificado: z.string().nonempty("O certificado comercial é obrigatório"),
    bankName: z.string().nonempty("O nome do banco é obrigatório"),
    IBAN: z.string().nonempty("O IBAN é obrigatório"),
}).refine(data => data.password === data.repeatedPassword, {
    message: "As senhas não correspondem",
    path: ["repeatedPassword"],
});


const RegisterForm = () => {
    const router = useRouter()
    const showToast = (title: string, description: string) => {
        toast({
            title,
            description,
        });
    };
    const [type, setType] = useState<'customer'>('customer');
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        birthDate: '',
        type,
        NIF: '',
        companyName: '',
        alvara: '',
        certificado: '',
        bankName: '',
        IBAN: '',
        repeatedPassword: '',
        password: ''
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const handleChange = (field: string, value: string) => {
        if (Object.entries(errors).length > 0) validateForm("change")
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const validateForm = (validationType?: "change") => {
        const schema = type === 'customer' ? customerSchema.refine(data => data.password === data.repeatedPassword, {
            message: "As senhas não correspondem",
            path: ["repeatedPassword"],
        }) : sellerSchema;

        try {
            schema.parse(formData);
            setErrors({});
            return true;
        } catch (e) {
            if (e instanceof z.ZodError) {
                const fieldErrors = e.errors.reduce((acc, err) => {
                    acc[err.path[0] as string] = err.message;
                    return acc;
                }, {} as { [key: string]: string });

                const errorsInArray = Object.entries(fieldErrors)
                if (!validationType)
                    showToast("Erro: Preencha os campos do formulário corretamente!", errorsInArray[0][1])
                setErrors(fieldErrors);
            }
            return false;
        }
    };

    const handleSubmit = useCallback(async () => {
        if (validateForm()) {
            const { repeatedPassword, ...forSeller } = formData
            const { birthDate, email, firstName, lastName, phone, type, password } = formData
            const data = type === "customer" ? {
                birthDate, email, firstName, lastName, phone, type, password
            } : forSeller;

            const user = await createdInstance.post<{ message: string, record?: { id: string } }>('/auth/sign', data)
            if (user.status === 201) {
                showToast("Successo!", `Sua conta de ${type === 'customer' ? 'Cliente' : '(Vendedor) Concessionário'} da Automarket foi criada com successo! Você será redirecionado para fazer o login!`)
                setTimeout(() => {
                    router.push('https://auto-mn-client.vercel.app/login-with-credentials')
                }, 5000);
            } else {
                showToast("Ocorreu algum erro inesperado!", user.data.message)
            }
        }
    }, [formData])

    return (
        <div className="flex pb-20 pt-20 flex-col items-center max-w-md mx-auto w-full justify-center min-h-screen bg-transparent px-6">
            {/* Logo */}
            <div className="mb-6">
                <Image
                    src="/images/logo.png"
                    alt="Logo"
                    width={150}
                    height={150}
                    className="rounded-full"
                />
            </div>

            {/* Título */}
            <h1 className="text-2xl font-bold text-black mb-8">
                Faça parte da inovação
            </h1>

            {/* Campos básicos */}
            <div className="flex w-full flex-col gap-4">
                <div className="w-full">
                    <Label htmlFor="firstName">Primeiro Nome</Label>
                    <Input
                        className='mobile-input'
                        id="firstName"
                        placeholder="Digite seu primeiro nome"
                        value={formData.firstName}
                        onChange={(e) => handleChange('firstName', e.target.value)}
                    />
                    {errors.firstName && <p className="text-red-500">{errors.firstName}</p>}
                </div>

                <div className="w-full">
                    <Label htmlFor="lastName">Último Nome</Label>
                    <Input
                        className='mobile-input'
                        id="lastName"
                        placeholder="Digite seu último nome"
                        value={formData.lastName}
                        onChange={(e) => handleChange('lastName', e.target.value)}
                    />
                    {errors.lastName && <p className="text-red-500">{errors.lastName}</p>}
                </div>

                <div className="w-full">
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                        className='mobile-input'
                        id="email"
                        type="email"
                        placeholder="Digite seu e-mail"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                    />
                    {errors.email && <p className="text-red-500">{errors.email}</p>}

                </div>

                <div className="w-full">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                        className='mobile-input'
                        id="phone"
                        placeholder="Digite seu telefone"
                        value={formData.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                    />
                    {errors.phone && <p className="text-red-500">{errors.phone}</p>}

                </div>

                <div className="w-full">
                    <Label htmlFor="birthDate">Data de Nascimento</Label>
                    <Input
                        className='mobile-input'
                        id="birthDate"
                        type="date"
                        value={formData.birthDate}
                        onChange={(e) => handleChange('birthDate', e.target.value)}
                    />
                    {errors.birthDate && <p className="text-red-500">{errors.birthDate}</p>}

                </div>

                <div className="w-full">
                    <Label htmlFor="password">Senha</Label>
                    <Input
                        className='mobile-input'
                        id="password"
                        type="password"
                        placeholder="Digite sua senha"
                        value={formData.password}
                        onChange={(e) => handleChange('password', e.target.value)}
                    />
                    {errors.password && <p className="text-red-500">{errors.password}</p>}
                </div>

                <div className="w-full">
                    <Label htmlFor="repeatedPassword">Repetir Senha</Label>
                    <Input
                        className='mobile-input'
                        id="repeatedPassword"
                        type="password"
                        placeholder="Confirme sua senha"
                        value={formData.repeatedPassword}
                        onChange={(e) => handleChange('repeatedPassword', e.target.value)}
                    />
                    {errors.repeatedPassword && <p className="text-red-500">{errors.repeatedPassword}</p>}
                </div>

            </div>

            <div className="w-full mt-6">
                <Button
                    className="w-full bg-black text-white py-6 px-6 rounded-full"
                    onClick={handleSubmit}
                >
                    Cadastrar
                </Button>
            </div>
        </div>
    );
};

export default RegisterForm;
