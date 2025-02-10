import { Vehicle } from '@/models/vehicle';
import React, { useState } from 'react';
import { Input } from '../input';
import { Button } from '../button';

interface Specification {
    label: string;
    description: string;
}

interface VehicleSpecificationsProps {
    handleInputChange: (field: keyof Vehicle, value: any) => void;
    specifications: Specification[];
}

const VehicleSpecifications: React.FC<VehicleSpecificationsProps> = ({ handleInputChange, specifications }) => {
    const [specs, setSpecs] = useState<Specification[]>(specifications || [{ label: '', description: '' }]);

    // Função para adicionar uma nova especificação
    const addSpecification = () => {
        setSpecs([...specs, { label: '', description: '' }]);
    };

    // Função para atualizar a especificação em um índice específico
    const handleSpecificationChange = (index: number, field: keyof Specification, value: string) => {
        const updatedSpecs = specs.map((spec, i) =>
            i === index ? { ...spec, [field]: value } : spec
        );
        setSpecs(updatedSpecs);
        handleInputChange('specifications', updatedSpecs); // Passando o novo valor para o form principal
    };

    return (
        <div>
            {specs.map((spec, index) => (
                <div key={index} >
                    <Input
                        placeholder="Título da especificação"
                        value={spec.label}
                        onChange={(e) => handleSpecificationChange(index, 'label', e.target.value)}
                        className="w-full p-2 border rounded"
                    />
                    <Input
                        placeholder="Descrição da especificação"
                        value={spec.description}
                        onChange={(e) => handleSpecificationChange(index, 'description', e.target.value)}
                        className="w-full p-2 border rounded"
                    />
                </div>
            ))}
            <Button onClick={addSpecification} className="mt-4">
                Adicionar
            </Button>
        </div>
    );
};

export default VehicleSpecifications;
