'use client';

import GoBack from '@/components/goBack';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const RegisterForm = () => {
    const router = useRouter()

    return (
        <div className="flex pb-20 pt-20 flex-col items-center max-w-md mx-auto w-full justify-center min-h-screen bg-white px-6">

            <GoBack className='' />

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

            <h1 className="text-2xl font-bold text-black mb-8">
                Escolha seu tipo de conta
            </h1>
            <div className="flex flex-col w-full gap-4">
                <Button
                    className="w-full bg-black text-white py-6 px-6 rounded-full"
                    onClick={() => router.push("https://clientauto.vercel.app/signup/client")}
                >
                    Cadastrar como Cliente
                </Button>
                <Button
                    className="w-full bg-black text-white py-6 px-6 rounded-full"
                    onClick={() => router.push("/signup/seller")}
                >
                    Cadastrar como Vendedor
                </Button>
            </div>
        </div >
    );
};

export default RegisterForm;