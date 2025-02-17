import { useState, useEffect } from "react";
import { Vehicle } from "@/models/vehicle";
import { createdInstance } from "./useApi";

const useShoppingCart = (userId: string) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCartValue, setTotalCartValue] = useState<number>(0);  // Estado para o valor total do carrinho

  // Carrega todos os veículos do carrinho
  const fetchVehicles = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await createdInstance.get<Vehicle[]>(`/shoppingCart/${userId}/cart`);
      setVehicles(response.data);
      // Após carregar os veículos, busca o valor total do carrinho
      fetchTotalCartValue();
    } catch (err: any) {
      setError(err.response?.data?.message || "Erro ao carregar os veículos.");
    } finally {
      setLoading(false);
    }
  };

  // Função para obter o valor total do carrinho
  const fetchTotalCartValue = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await createdInstance.get<{ totalValue: number }>(`/shoppingCart/${userId}/total`);
      setTotalCartValue(response.data.totalValue);  // Atualiza o valor total do carrinho
    } catch (err: any) {
      setError(err.response?.data?.message || "Erro ao carregar o valor total do carrinho.");
    } finally {
      setLoading(false);
    }
  };

  // Adiciona um veículo ao carrinho
  const addVehicle = async (vehicle: Vehicle) => {
    setLoading(true);
    setError(null);
    try {
      const response = await createdInstance.post<Vehicle[]>(`/shoppingCart/${userId}/cart`, vehicle);
      setVehicles(response.data);
      fetchTotalCartValue();  // Atualiza o valor total após adicionar o veículo
    } catch (err: any) {
      setError(err.response?.data?.message || "Erro ao adicionar o veículo.");
    } finally {
      setLoading(false);
    }
  };

  // Atualiza um veículo no carrinho
  const updateVehicle = async (vehicleId: string, updatedData: Partial<Vehicle>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await createdInstance.put<Vehicle[]>(`/shoppingCart/${userId}/cart/${vehicleId}`, updatedData);
      setVehicles(response.data);
      fetchTotalCartValue();  // Atualiza o valor total após atualizar o veículo
    } catch (err: any) {
      setError(err.response?.data?.message || "Erro ao atualizar o veículo.");
    } finally {
      setLoading(false);
    }
  };

  // Remove um veículo do carrinho
  const removeVehicle = async (vehicleId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await createdInstance.delete<Vehicle[]>(`/shoppingCart/${userId}/cart/${vehicleId}`);
      setVehicles(response.data);
      fetchTotalCartValue();  // Atualiza o valor total após remover o veículo
    } catch (err: any) {
      setError(err.response?.data?.message || "Erro ao remover o veículo.");
    } finally {
      setLoading(false);
    }
  };

  // Carrega os veículos automaticamente ao montar o hook
  useEffect(() => {
    fetchVehicles();
  }, [userId]);

  return {
    vehicles,
    loading,
    error,
    totalCartValue,  // Valor total do carrinho
    fetchVehicles,
    addVehicle,
    updateVehicle,
    removeVehicle,
  };
};

export default useShoppingCart;