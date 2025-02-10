'use client'

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import '../styles/welcome.css'


const MessageScreen = () => {
  const router = useRouter();
  const [isStep, setIsStep] = useState<number>(1)
  const images = [
    "car_rotation.png",
    "car_rotation.png",
    "car_rotation.png",
  ]

  const handleNextStep = (step: number) => {
    setIsStep(step)
  }

  const handleStart = () => {
    router.push("/login-with-credentials")
    console.log("Java Simon")
  }

  return (
    <div className="flex flex-col px-6 py-[30px] h-screen">
      <div className="grow">
        <Image
          src="/images/logotype.png"
          alt="Logo"
          width={150}
          height={150}
          className="w-full max-w-[338px]"
        />
      </div>

      <div className="grow text-center transition ease-in-out">
        <Image
          src={`/images/${images[isStep - 1]}`}
          alt="Logo"
          width={150}
          height={150}
          className="w-full max-w-[380px] mx-auto"
        />
      </div>

      <p className="text-4xl font-bold text-center">
        O melhor dos automóveis em suas mãos
      </p>

      <div className="grow flex justify-center items-center ">
        <div onClick={() => setIsStep(1)} className={`step-1 pointer rounded-full py-1 ${isStep === 1 ? 'bg-gradient-to-r from-[#101010] to-[#313130] px-3' : 'bg-[#E0E0E0] px-1'}`}></div>
        <div onClick={() => setIsStep(2)} className={`step-2 pointer rounded-full py-1 mx-1 ${isStep === 2 ? 'bg-gradient-to-r from-[#101010] to-[#313130] px-3' : 'bg-[#E0E0E0] px-1'}`}></div>
        <div onClick={() => setIsStep(3)} className={`step-3 pointer rounded-full py-1 ${isStep === 3 ? 'bg-gradient-to-r from-[#101010] to-[#313130] px-3' : 'bg-[#E0E0E0] px-1'}`}></div>
      </div>
      <div className="grow flex items-center justify-center">
        <button onClick={handleStart} className="w-full bg-[#101010] text-white text-center font-base font-bold  py-4 rounded-full">Comece</button>
      </div>
    </div>
  );
};

export default MessageScreen;
