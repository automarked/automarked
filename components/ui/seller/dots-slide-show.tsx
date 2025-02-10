import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils"; // Utilize o utilitário do ShadCN para classes dinâmicas
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SlideshowProps {
  images: string[];
  interval?: number; // Tempo em milissegundos para troca automática
}

const Slideshow: React.FC<SlideshowProps> = ({ images, interval = 3000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Função para avançar para o próximo slide
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  // Função para voltar ao slide anterior
  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  // Função para ir diretamente a um slide específico
  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Efeito para troca automática dos slides
  useEffect(() => {
    const timer = setInterval(nextSlide, interval);
    return () => clearInterval(timer); // Limpa o timer quando o componente desmonta
  }, [interval]);

  return (
    <div className="relative h-64 w-full max-w-lg mx-auto overflow-hidden">
      {/* Slides */}
      <div className="relative h-32">
        {images.map((image, index) => (
          <div
            key={index}
            className={cn(
              "absolute inset-0 transition-opacity duration-700",
              currentIndex === index ? "opacity-100" : "opacity-0"
            )}
          >
            <img
              src={image}
              alt={`Slide ${index + 1}`}
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
        ))}
      </div>

      {/* Botões de Navegação */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black/50 text-white rounded-full p-2 hover:bg-black/70"
      >
        <ChevronLeft />
      </button>
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black/50 text-white rounded-full p-2 hover:bg-black/70"
      >
        <ChevronRight />
      </button>

      {/* Dots de Navegação */}
      <div className="flex border-2 border-red-500  justify-center space-x-2 mt-72">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={cn(
              "w-3 h-3 rounded-full transition-colors",
              currentIndex === index
                ? "bg-primary" // Classe para a dot ativa
                : "bg-gray-400 hover:bg-gray-600"
            )}
          />
        ))}
      </div>
    </div>
  );
};

export default Slideshow;
