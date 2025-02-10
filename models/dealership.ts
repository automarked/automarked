// Interface for tblConcessionaria
interface IDealership {
    dealershipId: string;
    userId: string; // FK to User
    name: string;
    address: string;
    email: string;
    phone: string;
};