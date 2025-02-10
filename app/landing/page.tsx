'use client'

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Loader from "@/components/loader";

const Landing = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      router.push("/welcome");
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 bg-white relative">
      <Image
        src="/images/logo.png"
        alt="Logo"
        width={150}
        height={150}
        className="rounded-full mb-6"
      />
      <div className="absolute bottom-16 right-0 left-0 flex items-center justify-center">
        {isLoading && <Loader />}
      </div>
    </div>
  );
};

export default Landing;
