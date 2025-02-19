'use client'

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import { faEye, faEyeSlash, faAddressCard } from "@fortawesome/free-regular-svg-icons";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import Link from "next/link";
import Loader from "@/components/loader";
import Cookies from 'js-cookie'
import { Badge } from "@/components/ui/badge";

const LoginWithCredentials = () => {
  const router = useRouter();
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const showToast = (title: string, description: string) => {
    toast({
      title,
      description,
    });
  };


  useEffect(() => {
    Object.keys(Cookies.get()).forEach(cookieName => {
      Cookies.remove(cookieName)
    })
  }, [])

  const handleLogin = useCallback(async () => {
    const result = await login(email, password);
    if (!result) {
      showToast("Palavra passe ou email inválidos!", "")
    }

    if (result === "customer") {
      showToast("Neste momento um cliente não pode fazer login na plataforma.", "")
    }

    if (result === "seller" || result === "collaborator") {
      window.location.href = '/seller'
    }
  }, [email, password]);

  return (
    <div className="flex flex-col bg-white py-6 items-center justify-center min-h-screen">
      <div className="flex flex-col items-center justify-center max-w-[390px] min-w-[293px] w-full h-full px-6   px-6 bg-white ">

        <Badge variant="outline" className="mb-4 text-xl">Vendedor</Badge>

        <Image
          src="/images/logo.png"
          alt="Logo"
          width={150}
          height={150}
          className="rounded-full mb-8"
        />
        <h1 className="text-2xl font-bold text-black mb-6">Entre com sua senha</h1>

        {/* Input E-mail */}
        <div className="flex items-center w-full max-w-md mb-4 bg-gray-100 px-4 py-3 rounded-lg">
          <label htmlFor="email">
            <FontAwesomeIcon width={16} icon={faEnvelope} className="text-gray-500" />
          </label>
          <input
            type="email"
            id="email"
            placeholder="E-mail"
            className="flex-1 ml-3 bg-transparent text-black placeholder-gray-400 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Input Senha */}
        <div className="flex items-center w-full max-w-md mb-4 bg-gray-100 px-4 py-3 rounded-lg">
          <label htmlFor="password">
            <FontAwesomeIcon width={14} icon={faLock} className="text-gray-500" />
          </label>
          <input
            type={isPasswordVisible ? "text" : "password"}
            id="password"
            placeholder="Senha"
            className="flex-1 ml-3 bg-transparent text-black placeholder-gray-400 outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={() => setIsPasswordVisible(!isPasswordVisible)}>
            <FontAwesomeIcon
              icon={isPasswordVisible ? faEyeSlash : faEye}
              className="text-gray-500"
            />
          </button>
        </div>

        {/* Lembre-me */}
        <div className="flex items-center justify-center w-full max-w-md mb-6">
          <button
            onClick={() => setRememberMe(!rememberMe)}
            className={`w-5 h-5 mr-3 border-2 rounded ${rememberMe ? "bg-black border-black" : "border-gray-500"
              }`}
          />
          <span className="text-black">Lembre de mim</span>
        </div>

        {/* Botão Entrar */}
        <button
          onClick={handleLogin}
          className="w-full max-w-md py-4 mb-6 bg-black text-white rounded-full text-lg font-medium"
          disabled={isLoading}
        >
          Entrar
        </button>
        {isLoading && (
          <Loader />
        )}

        {/* Separator */}
        <div className="flex items-center w-full max-w-md mb-6">
          <hr className="flex-1 border-gray-300" />
          <Link href={"/forgot-password"} className="mx-3 text-black font-semibold underline">Esqueci minha senha</Link>
          <hr className="flex-1 border-gray-300" />
        </div>

        {/* Botões de Social Login */}
        {/* <div className="flex justify-around w-full max-w-md">
          <button className="flex items-center justify-center w-14 h-14 bg-gray-100 rounded-lg">
            <Image
              src="/images/facebook.png"
              alt="Facebook"
              width={24}
              height={24}
            />
          </button>
          <button className="flex items-center justify-center w-14 h-14 bg-gray-100 rounded-lg">
            <Image
              src="/images/google.png"
              alt="Google"
              width={24}
              height={24}
            />
          </button>
          <button className="flex items-center justify-center w-14 h-14 bg-gray-100 rounded-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M17.64 11.57c-.02-2.28 1.88-3.38 1.97-3.43-1.08-1.58-2.77-1.8-3.36-1.83-1.43-.15-2.79.84-3.52.84-.73 0-1.88-.82-3.09-.8-1.58.02-3.06.92-3.88 2.34-1.67 2.9-.43 7.19 1.2 9.56.8 1.16 1.75 2.44 3.01 2.4 1.2-.05 1.65-.78 3.1-.78 1.45 0 1.85.78 3.11.75 1.29-.02 2.11-1.17 2.9-2.34.9-1.33 1.27-2.62 1.29-2.69-.03-.01-2.54-1.01-2.57-4.02zM14.93 2.76c.74-.9 1.23-2.16 1.09-3.42-1.05.04-2.33.7-3.06 1.6-.67.79-1.25 2.07-1.1 3.27 1.15.09 2.34-.59 3.07-1.45z" />
            </svg>
          </button>
        </div> */}

        {/* Esqueci a senha */}
        {/*<p className="mt-8 text-gray-500">
          Ainda não tem uma conta?{" "}
          <button
            onClick={() => router.push("/signup")}
            className="font-bold text-black"
          >
            crie sua conta
          </button>
        </p>*/}
        <p className="mt-8 text-gray-500 text-xs">
          Pode rever a {" "}
          <a
            href="/legal/privacy-policy"
            className="font-bold text-blue-400"
          >
            Política de Privacidade
          </a>
          {" "}e os{" "}
          <a
            href="/legal/terms-and-conditions"
            className="font-bold text-blue-400"
          >
            Termos de Utilização
          </a>
          {" "} da nossa app antes de a utilizar.
        </p>
      </div>
    </div>
  );
};

export default LoginWithCredentials;
