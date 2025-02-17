import { Vehicle } from "./vehicle"; 

export interface InventoryItem {
    vehicles: Vehicle;          
    quantity: number;          
    entryDate: Date;
}
      