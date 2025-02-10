'use client'

import Image from "next/image";

import Link from "next/link";
import { useEffect, useState } from "react";
import Landing from "../landing/page";


const LoginScreen: React.FC = () => {
    // const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 768);

    // const handleIsMobile = () => {
    //     setIsMobile(window.innerWidth <= 768)
    // }
    // useEffect(() => {
    //     handleIsMobile()
    // }, []);

    return (
        <>
                <Landing />
            {/* {isMobile ? ( */}
            {/* ) : ( */}
                {/* <form className="flex flex-col mx-auto items-center justify-center max-w-md min-h-screen bg-white px-6"> */}
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
                    <h1 className="text-2xl font-bold text-black mb-8">Deixe você entrar</h1>

                    {/* Botão Facebook */}
                    <button className="flex items-center w-full border py-3 px-4 rounded-xl mb-4">
                        <Image
                            src="/images/facebook.png"
                            alt="Facebook"
                            width={24}
                            height={24}
                            className="mr-4"
                        />
                        <span className="text-black text-center flex-grow">
                            Continuar com o Facebook
                        </span>
                    </button>

                    <button type="submit"
                        className="flex items-center w-full border py-3 px-4 rounded-xl mb-4"
                    >
                        <Image
                            src="/images/google.png"
                            alt="Google"
                            width={24}
                            height={24}
                            className="mr-4"
                        />
                        <span className="text-black text-center flex-grow">
                            Continuar com o Google
                        </span>
                    </button>

                    {/* Botão Apple */}
                    <button className="flex items-center w-full border py-3 px-4 rounded-xl mb-4">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 mr-4"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path d="M17.64 11.57c-.02-2.28 1.88-3.38 1.97-3.43-1.08-1.58-2.77-1.8-3.36-1.83-1.43-.15-2.79.84-3.52.84-.73 0-1.88-.82-3.09-.8-1.58.02-3.06.92-3.88 2.34-1.67 2.9-.43 7.19 1.2 9.56.8 1.16 1.75 2.44 3.01 2.4 1.2-.05 1.65-.78 3.1-.78 1.45 0 1.85.78 3.11.75 1.29-.02 2.11-1.17 2.9-2.34.9-1.33 1.27-2.62 1.29-2.69-.03-.01-2.54-1.01-2.57-4.02zM14.93 2.76c.74-.9 1.23-2.16 1.09-3.42-1.05.04-2.33.7-3.06 1.6-.67.79-1.25 2.07-1.1 3.27 1.15.09 2.34-.59 3.07-1.45z" />
                        </svg>
                        <span className="text-black text-center flex-grow">
                            Continuar com a Apple
                        </span>
                    </button>

                    {/* Separador */}
                    <div className="flex items-center my-6 w-full">
                        <div className="flex-1 h-px bg-gray-400"></div>
                        <span className="mx-4 text-black">ou</span>
                        <div className="flex-1 h-px bg-gray-400"></div>
                    </div>

                    {/* Botão de login com senha */}
                    <Link
                        className="w-full bg-black text-center text-white py-4 px-6 rounded-full mb-4"
                        href="/login-with-credentials"
                    >
                        Faça login com senha
                    </Link>

                    {/* Link para criar conta */}
                    <p className="text-sm text-gray-700 mt-6">
                        Não tem uma conta?{" "}
                        <Link
                            className="text-black text-center font-bold cursor-pointer"
                            href="/signup"
                        >
                            Inscrever-se
                        </Link>
                    </p>
                {/* </form> */}
            {/* )} */}

        </>
    );
};

export default LoginScreen;
