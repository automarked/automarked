import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { Vehicle } from "@/models/vehicle";
import { createdInstance } from "@/hooks/useApi";
import { toast } from "@/hooks/use-toast";

type ShoppingCartContextType = {
  vehicles: Vehicle[];
  loading: boolean;
  error: string | null;
  totalCartValue: number;
  fetchVehicles: () => Promise<void>;
  addVehicle: (vehicle: Vehicle) => Promise<void>;
  updateVehicle: (vehicleId: string, updatedData: Partial<Vehicle>) => Promise<void>;
  removeVehicle: (vehicleId: string) => Promise<void>;
  getFromShoppingCart: (id: string) => boolean
};

const ShoppingCartContext = createContext<ShoppingCartContextType | undefined>(undefined);

type ShoppingCartProviderProps = {
  userId: string;
  children: ReactNode;
};

export const ShoppingCartProvider = ({ userId, children }: ShoppingCartProviderProps) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCartValue, setTotalCartValue] = useState<number>(0);

  const showToast = (title: string, description: string) => {
    toast({
      title,
      description,
    });
  };

  const fetchVehicles = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await createdInstance.get<Vehicle[]>(`/shoppingCart/${userId}/cart`);
      setVehicles(response.data);
      fetchTotalCartValue();
    } catch (err: any) {
      setError(err.response?.data?.message || "Erro ao carregar os veículos.");
    } finally {
      setLoading(false);
    }
  };

  const getFromShoppingCart = useCallback((id: string) => {
    return vehicles.some(v => v.licensePlate === id)
  }, [vehicles])

  const fetchTotalCartValue = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await createdInstance.get<{ totalValue: number }>(`/shoppingCart/${userId}/total`);
      setTotalCartValue(response.data.totalValue);
    } catch (err: any) {
      setError(err.response?.data?.message || "Erro ao carregar o valor total do carrinho.");
    } finally {
      setLoading(false);
    }
  };

  const addVehicle = async (vehicle: Vehicle) => {
    setLoading(true);
    setError(null);
    try {
      const response = await createdInstance.post<Vehicle[]>(`/shoppingCart/${userId}/cart`, vehicle);
      setVehicles(response.data);
      showToast("Sucesso!", `${vehicle.brand + " " + vehicle.model} adicionado ao carrinho de compras!`);
      fetchTotalCartValue();
    } catch (err: any) {
      setError(err.response?.data?.message || "Erro ao adicionar o veículo.");
    } finally {
      setLoading(false);
    }
  };

  const updateVehicle = async (vehicleId: string, updatedData: Partial<Vehicle>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await createdInstance.put<Vehicle[]>(`/shoppingCart/${userId}/cart/${vehicleId}`, updatedData);
      setVehicles(response.data);
      
      fetchTotalCartValue();
    } catch (err: any) {
      setError(err.response?.data?.message || "Erro ao atualizar o veículo.");
    } finally {
      setLoading(false);
    }
  };

  const removeVehicle = async (vehicleId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await createdInstance.delete<Vehicle[]>(`/shoppingCart/${userId}/cart/${vehicleId}`);
      setVehicles(response.data);
      const vehicle = vehicles.find(v => v.licensePlate === vehicleId)
      showToast("Sucesso!", `${vehicle?.brand + " " + vehicle?.model} removido do seu carrinho!`);
      fetchTotalCartValue();
    } catch (err: any) {
      setError(err.response?.data?.message || "Erro ao remover o veículo.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, [userId]);

  return (
    <ShoppingCartContext.Provider
      value={{
        getFromShoppingCart,
        vehicles,
        loading,
        error,
        totalCartValue,
        fetchVehicles,
        addVehicle,
        updateVehicle,
        removeVehicle,
      }}
    >
      {children}
    </ShoppingCartContext.Provider>
  );
};

export const useShoppingCart = () => {
  const context = useContext(ShoppingCartContext);
  if (!context) {
    throw new Error("useShoppingCart deve ser usado dentro de um ShoppingCartProvider");
  }
  return context;
};
