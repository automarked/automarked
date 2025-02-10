// Interface for tblMarca
interface Model {
    modelId: number;
    modelName: string;
}
export interface Brand {
    brandId?: number;
    brandName: string;
    models: Model[]
}