'use client'

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import { toast } from "@/hooks/use-toast";
import Loader from "@/components/loader";
import { createdInstance } from "@/hooks/useApi";

const LoginWithCredentials = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const showToast = (title: string, description: string) => {
    toast({
      title,
      description,
    });
  };

  useEffect(() => {
    localStorage.clear()
  }, [])

  const handleLogin = useCallback(async () => {
    if (email.trim() === "") {
      showToast("Por favor, insira seu e-mail.", "")
      return;
    }
    showToast(`Enviamos um email para ${email} com instruções para mudar sua senha!`, "")
    createdInstance.put(`/auth/change-password/${email}`)

    setEmail("");
    setTimeout(() => {
      router.push("/login-with-credentials");
    }, 2000);
  }, [email, setEmail, setIsLoading]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 bg-white">
      <Image
        src="/images/logo.png"
        alt="Logo"
        width={150}
        height={150}
        className="rounded-full mb-6"
      />
      <h1 className="text-2xl font-bold text-black mb-6">Entre com sua senha</h1>

      {/* Input E-mail */}
      <div className="flex items-center w-full max-w-md mb-4 bg-gray-100 px-4 py-3 rounded-lg">
        <FontAwesomeIcon icon={faEnvelope} className="text-gray-500" />
        <input
          type="email"
          placeholder="E-mail"
          className="flex-1 ml-3 bg-transparent text-black placeholder-gray-400 outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>



      {/* Botão Entrar */}
      <button
        onClick={handleLogin}
        className="w-full max-w-md py-4 mb-6 bg-black text-white rounded-full text-lg font-medium"
        disabled={isLoading}
      >
        {isLoading ? "Carregando..." : "Enviar email de recuperação"}
      </button>
      {isLoading && (
        <Loader />
      )}
    </div>
  );
};

export default LoginWithCredentials;
