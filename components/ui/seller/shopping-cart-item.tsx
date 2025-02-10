import React, { useState } from "react";
import { Minus, Plus } from "lucide-react"; // Ícones de ShadCN
import { formatCurrency } from "@/scripts/format-price";
import { CheckboxItem } from "@radix-ui/react-dropdown-menu";
import Image from "next/image";

interface CartItemProps {
  image: string;
  title: string;
  subtitle: string;
  price: string;
  initialQuantity?: number;
}

const ShoppingCartItem: React.FC<CartItemProps> = ({
  image,
  title,
  subtitle,
  price,
  initialQuantity = 1,
}) => {
  const [quantity, setQuantity] = useState(initialQuantity);

  const increment = () => setQuantity((prev) => prev + 1);
  const decrement = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  return (
    <div className="flex border items-center overflow-hidden space-x-4 bg-white rounded-lg shadow-sm">
      {/* Imagem do Produto */}
      <Image
        width={300}
        height={300}
        src={image}
        alt={title}
        className="w-28 h-32 object-cover"
      />

      {/* Informações do Produto */}
      <div className="flex-1 p-4">
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        <p className="text-xs text-gray-500">{subtitle}</p>
        <p className="text-lg font-bold text-gray-900 mt-2">{formatCurrency(price)}</p>
      </div>

      {/* Controles de Quantidade */}
      {/*  <div className="flex items-center space-x-2">
        <button
          onClick={decrement}
          className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full text-gray-900 hover:bg-gray-300 transition"
        >
          <Minus size={16} />
        </button>
        <span className="w-6 text-center text-gray-900">{quantity}</span>
        <button
          onClick={increment}
          className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full text-gray-900 hover:bg-gray-300 transition"
        >
          <Plus size={16} />
        </button>
      </div> */}
    </div>
  );
};

export default ShoppingCartItem;
