import Sale from "@/models/sale";
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { createdInstance } from "@/hooks/useApi";
import { useSocketContext } from "./SocketContext";

interface SalesContextType {
  sales: Sale[];
  getSale: (id: string) => Sale | undefined;
  addSale: (sale: Sale) => void;
  createSale: (formData: FormData) => Promise<{ message: string, sale: Sale }>
}

const SalesContext = createContext<SalesContextType | undefined>(undefined);

export const SalesProvider: React.FC<{ children: ReactNode, userId: string }> = ({ children, userId }) => {
  const { socket } = useSocketContext()
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {

    if (socket) {
      socket.on(`sale-state-updated`, (sale: Sale) => {        
        setSales(oldSalesArray => oldSalesArray.map((saleItem) => {
          if (saleItem.saleId !== sale.saleId) 
            return saleItem
          return sale
        }))
      })
    }

    const fetchSales = async () => {
      try {
        const response = await createdInstance.get<Sale[]>(`/sales/buyer/${userId}`);
        setSales(response.data);
      } catch (error) {
        console.error("Error fetching sales:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, [socket]);

  const createSale = useCallback(async (formData: FormData) => {
    if (!formData.get('sellerId') || !formData.get('buyerId') || !formData.get('price') || !formData.get('vehicle') || !formData.get('address') || !formData.get('file')) {
      return;
    }
    try {
      const response = await createdInstance.post('/sales', formData);

      if (response.status === 201) {
        addSale(response.data.sale)
        return response.data
      } else {
        return false
      }
    } catch (error) {
      console.error('Erro ao realizar o pedido:', error);
    }
  }, [])

  const addSale = (sale: Sale) => {
    setSales((prevSales) => [...prevSales, sale]);
  };

  const getSale = (id: string) => {
    const index = sales.findIndex(sale => sale.saleId.includes(id));
    if (index > -1) {
      return sales[index];
    }
  }

  if (loading) {
    return <div>Loading sales...</div>;
  }

  return (
    <SalesContext.Provider value={{ sales, addSale, getSale, createSale }}>
      {children}
    </SalesContext.Provider>
  );
};

// Hook for consuming the context
export const useSalesContext = (): SalesContextType => {
  const context = useContext(SalesContext);
  if (!context) {
    throw new Error("useSales must be used within a SalesProvider");
  }
  return context;
};
