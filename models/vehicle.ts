
export interface Vehicle {
    vehicleId: string;
    brand: string;
    userId: string
    model: string; 
    dealershipId: string;
    licensePlate: string; 
    manufactureYear: string; 
    price: string;
    vehicleType: "car" | "moto";
    mileage: string;
    color: string;
    gallery: string[]
    bar_code: string;
    internal_code: string;
    photo: string
    condition: "Novo" | "Usado"
    description: string
    specifications: {label: string, description: string}[]
    store?: IDealership
}