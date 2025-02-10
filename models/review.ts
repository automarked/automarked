// Interface for tblAvaliacao
interface Review {
    reviewId: number;
    vehicleId: number; // FK to Vehicle
    modelId: number; // FK to Model
    comment: string;
    rating: number;
    vehicleId_fk: number; // FK to Vehicle
    modelId_fk: number; // FK to Model
}