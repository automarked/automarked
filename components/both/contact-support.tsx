"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function WhatsAppFloatingButton() {
  return (
    <div className="hidden md:fixed bottom-4 right-4 z-50 group md:block">
      <div
        className={cn(
          "absolute right-full top-1/2 -translate-y-1/2 mr-2 whitespace-nowrap",
          "hidden group-hover:flex items-center justify-center",
          "bg-gray-800 text-white text-sm py-1 px-2 rounded shadow-lg",
          "after:content-[''] after:absolute after:top-1/2 after:-translate-y-1/2",
          "after:-right-2 after:border-8 after:border-transparent",
          "after:border-l-gray-800"
        )}
      >
        Contactar Suporte
      </div>
      <a
        href="https://wa.me/939282205?text=Olá!%20Gostaria%20de%20entrar%20em%20contato."
        target="_blank"
        rel="noopener noreferrer"
      >
        <Button
          className="bg-green-500 animate-bounce hover:bg-green-600 text-white shadow-lg w-16 h-16 rounded-full p-4"
        >
          <img src="/images/whatsapp-contact-support.png" className="w-full h-full object-cover" />
        </Button>
      </a>
    </div>
  );
}
