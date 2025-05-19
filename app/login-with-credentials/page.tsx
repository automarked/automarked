"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import Link from "next/link";
import Cookies from "js-cookie";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import GoBack from "@/components/goBack";
import { motion } from "framer-motion";

const LoginWithCredentials = () => {
  const router = useRouter();
  const { login, isLoading, error } = useAuth();
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
    Object.keys(Cookies.get()).forEach((cookieName) => {
      Cookies.remove(cookieName);
    });
  }, []);

  const handleLogin = useCallback(async () => {
    const result = await login(email, password);
    if (!result) {
      console.log(error)
      showToast(error ? error : "Erro ao fazer login, tente novamente mais tarde.", "");
    }

    if (result === "customer") {
      showToast(
        "Neste momento um cliente não pode fazer login na plataforma.",
        ""
      );
    }

    if (result === "seller" || result === "collaborator") {
      window.location.href = "/seller";
    }
  }, [email, password, login]);

  return (
    <div className="flex min-h-screen w-full">
      {/* Left side - decorative background */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#1e293b] to-[#354867] relative overflow-hidden">
        <div className="absolute inset-0 bg-white opacity-5 pattern-dots pattern-size-4 pattern-opacity-10"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center p-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <Image
              src="/images/logo.png"
              alt="Automarked"
              width={200}
              height={200}
              className="mx-auto mb-8"
            />
            <h1 className="text-4xl font-bold text-white mb-6">Bem-vindo à Automarked</h1>
            <p className="text-xl text-gray-200 mb-8 max-w-md mx-auto">
              A sua plataforma de confiança para compra e venda de veículos em Angola.
            </p>
            <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto mt-12">
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 * i, duration: 0.5 }}
                  className="bg-white/10 p-4 rounded-xl backdrop-blur-sm"
                >
                  <div className="text-white text-4xl font-bold mb-2">#{i}</div>
                  <div className="text-gray-200 text-sm">
                    {i === 1 ? "Escolha o seu veículo" : i === 2 ? "Contacte o vendedor" : "Feche o negócio"}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Right side - login form */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full lg:w-1/2 flex flex-col items-center justify-center bg-white px-6 py-12"
      >
        <div className="w-full max-w-md">
          <div className="lg:hidden absolute top-4 left-4">
            <GoBack />
          </div>
          
          <div className="text-center mb-8">
            <Badge variant="outline" className="mb-6 text-lg px-4 py-1 bg-[#1e293b] text-white border-none">
              Vendedor
            </Badge>
            <Image
              src="/images/logo.png"
              alt="Logo"
              width={120}
              height={120}
              className="rounded-full mx-auto mb-6"
            />
            <h1 className="text-2xl font-bold text-[#1e293b] mb-2">Bem-vindo de volta</h1>
            <p className="text-gray-500">Entre com suas credenciais para acessar sua conta</p>
          </div>
          
          <div className="space-y-6">
            {/* Input E-mail */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="relative"
            >
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <FontAwesomeIcon icon={faEnvelope} className="text-gray-400" />
              </div>
              <input
                type="email"
                placeholder="E-mail"
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#354867] focus:border-transparent transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </motion.div>
            
            {/* Input Senha */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="relative"
            >
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <FontAwesomeIcon icon={faLock} className="text-gray-400" />
              </div>
              <input
                type={isPasswordVisible ? "text" : "password"}
                placeholder="Senha"
                className="w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#354867] focus:border-transparent transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                className="absolute inset-y-0 right-0 flex items-center pr-4"
              >
                <FontAwesomeIcon
                  icon={isPasswordVisible ? faEyeSlash : faEye}
                  className="text-gray-400 hover:text-[#354867] transition-colors"
                />
              </button>
            </motion.div>
            
            {/* Lembre-me e Esqueceu a senha */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <button
                  onClick={() => setRememberMe(!rememberMe)}
                  className="flex items-center"
                >
                  <div className={`w-5 h-5 mr-3 flex items-center justify-center rounded border ${rememberMe ? "bg-[#354867] border-[#354867]" : "border-gray-400"}`}>
                    {rememberMe && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className="text-gray-700">Lembre de mim</span>
                </button>
              </div>
              <Link href="/forgot-password" className="text-[#354867] font-medium hover:underline">
                Esqueceu a senha?
              </Link>
            </div>
            
            {/* Botão Entrar */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-[#1e293b] to-[#354867] text-white rounded-lg text-lg font-medium transition-all hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Processando...
                </div>
              ) : (
                "Entrar"
              )}
            </motion.button>
            
            {/* Legal links */}
            <div className="text-center mt-8 text-xs text-gray-500">
              <p>
                Pode rever a {" "}
                <a
                  href="/legal/privacy-policy"
                  className="font-medium text-[#354867] hover:underline"
                >
                  Política de Privacidade
                </a>
                {" "}e os{" "}
                <a
                  href="/legal/terms-and-conditions"
                  className="font-medium text-[#354867] hover:underline"
                >
                  Termos de Utilização
                </a>
                {" "} da nossa app antes de a utilizar.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginWithCredentials;
