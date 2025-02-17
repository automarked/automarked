type IUserType = "seller" | "customer" | "collaborator";

export interface ICompany {
  NIF: string
  companyName: string
  alvara: string
  certificado: string
  bankName: string
  IBAN: string
  companyId: string
  background?: string 
}

export type IUser = Partial<ICompany> & {
  userId: string;
  firstName: string;
  lastName: string;
  birthDate: Date;
  email: string;
  gender: string;
  phone: string;
  photo: string;
  password: string;
  description: string;
  municipality: string;
  province: string;
  type: IUserType
};