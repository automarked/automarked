import { IUser } from "./user";
import { Vehicle } from "./vehicle";

// Interface for tblVenda
export default interface Sale {
    saleId: string;
    vehicle: Vehicle;
    sellerId: string;
    buyer: IUser;
    address: {
        municipality: string;
        province: string;
    };
    annex: string;
    state: "pending" | "confirmed" | "completed" | "cancelled";
    saleDate: {
        seconds: number;
        nanoseconds: number;
    };
    price: string;
};