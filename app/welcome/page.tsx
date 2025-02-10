'use client'

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Loader from "@/components/loader";
import '../styles/welcome.css'


const Welcome = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
      
      const timer = setTimeout(() => {
        setIsLoading(false);
        router.push("/login-with-credentials"); 
      }, 3000);

      
      return () => clearTimeout(timer);
    }, [router]);

  return (
    <div className="welcome bg-cover bg-center bg-no-repeat w-full h-screen flex items-end jusify-center px-8 py-12">
      <div className="flex flex-col justify-center tracking-wide">
        <h1 className="font-semibold text-white text-5xl">Bem-vindo ao</h1>

        <div className="my-2">
          <Image
            src="/images/logotype.png"
            alt="Logo"
            width={150}
            height={150}
            className="w-full max-w"
          />
        </div>
        <p className="font-semibold text-white">
          Maior marketplace de viaturas em Angola, desde compra, alugel e muito mais, você encontra aqui.
        </p>

      </div>
    </div>
  );
};

export default Welcome;
