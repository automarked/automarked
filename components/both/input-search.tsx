import { Search } from "lucide-react"; // Usando lucide-react para o ícone de busca
import React from "react";

const SearchInput: React.FC<{ dark?: boolean, value: string, setValue: (tag: string) => void }> = ({ setValue, value, dark }) => {
  return (
    <div data-dark={dark} className="flex items-center justify-between bg-gray-100 data-[dark=true]:bg-[var(--input)] rounded-lg p-3 w-full">
      {/* Input com ícone de lupa */}
      <div className="flex items-center  gap-2 w-full">
        <Search className="w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Procurar"
          value={value}
          className="bg-transparent outline-none text-gray-600 placeholder:text-gray-400 w-full"
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
    </div>
  );
};

export default SearchInput;
