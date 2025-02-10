import React from 'react';

interface Brand {
    name: string;
    logo: string; // URL do logo
}

const brands: Brand[] = [
    { name: 'COMAUTO', logo: '/images/4.png' },
    { name: 'TCG', logo: '/images/2.png' },
    { name: 'BMW', logo: '/images/3.png' },
    { name: 'Toyota', logo: '/images/6.png' },
    { name: 'Volvo', logo: '/images/5.png' },
    { name: 'JETOUR', logo: '/images/7.png' },
    { name: 'ANGOLAUTO', logo: '/images/1.png' },
    { name: 'Mais', logo: '/images/icon_more.png' }, // Altere para um ícone de 3 pontos se necessário
];

const BrandGrid: React.FC = () => {
    return (
        <div className="grid grid-cols-4 gap-4">
            {brands.map((brand) => (
                <div className='flex flex-col items-center'>
                    <div
                        key={brand.name}
                        className="flex flex-col items-center w-16 h-16 justify-center bg-gray-100 rounded-full p-4 hover:bg-gray-200 transition"
                    >
                        <img
                            src={brand.logo}
                            alt={brand.name}
                            className="w-12 h-12 object-contain rounded-full"
                        />
                    </div>
                    <span className="mt-2 text-sm font-medium text-gray-700">{brand.name}</span>
                </div>
            ))}
        </div>
    );
};

export default BrandGrid;
