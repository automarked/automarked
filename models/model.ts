// Interface for tblModelo
interface Model {
    modelId: number;
    brandId: number; // FK to Brand
    modelName: string;
    brandId_fk: number; // FK to Brand
}