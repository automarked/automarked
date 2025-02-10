// Interface for tblAnuncio
interface Advertisement {
    adId: number;
    vehicleId: number; // FK to Vehicle
    modelId: number; // FK to Model
    description: string;
    adDate: Date;
    code: string;
    vehicleId_fk: number; // FK to Vehicle
    modelId_fk: number; // FK to Model
}