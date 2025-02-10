import { Search } from "lucide-react"; // Usando lucide-react para o ícone de busca
import React from "react";

const SearchInput: React.FC<{ dark?: boolean, value: string, setValue: (tag: string) => void, className?: string }> = ({ setValue, value, dark, className }) => {
  return (
    <div data-dark={dark} className={`flex items-center justify-between bg-global data-[dark=true]:bg-[var(--input)] rounded-lg p-3 w-full ${className}`}>
      {/* Input com ícone de lupa */}
      <div className="flex items-center  gap-2 w-full">
        <label htmlFor="search" className="">
          <Search className="w-5 h-5 text-gray-400" />
        </label>
        <input
          type="text"
          id="search"
          placeholder="Procurar"
          value={value}
          className="bg-transparent outline-none text-gray-600 placeholder:text-gray-400 w-full"
          onChange={(e) => setValue(e.target.value)}
        />
      </div>

      {/* Ícone de configurações */}
      {/* <button className="flex items-center justify-center w-8 h-8 bg-global rounded-full shadow-sm hover:bg-gray-200 transition">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5 text-gray-600"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3c2.755 0 5 2.245 5 5s-2.245 5-5 5-5-2.245-5-5 2.245-5 5-5z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 19.5l-4.035-4.035"
          />
        </svg>
      </button> */}
    </div>
  );
};

export default SearchInput;
