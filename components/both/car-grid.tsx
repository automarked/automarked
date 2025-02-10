import React from "react";
import CarCard from "./car-card";
import { InventoryItem } from "@/models/inventory";
import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";
import { Vehicle } from "@/models/vehicle";
import ShoppingCartItem from "../ui/seller/shopping-cart-item";
import { apiBaseURL } from "@/constants/api";

const CarGrid: React.FC<{ disposition?: "flex" | "grid",shopping?: boolean, inventory: Vehicle[], searchOnList: string }> = ({ inventory, searchOnList, shopping = false, disposition = "grid" }) => {
  return (
    <>
      {searchOnList.trim() && (
        <div className="mb-2">Resultados para <strong className="font-bold">{searchOnList}</strong></div>
      )}
      {inventory?.length > 0 && (
        <div data-shopping={disposition === "flex"} 
        className="flex data-[shopping=true]:flex-col data-[shopping=false]:grid custom-grid sm:grid-cols-4 md:grid-cols-5 xl:grid-cols-7 gap-2">
          {searchOnList.trim() ? inventory.filter(car =>
            `
        ${car.brand} 
        ${car.model} 
        ${car.color} 
        ${car.condition}
      `
              .toLowerCase()
              .includes(
                searchOnList.toLowerCase()
              ))
            .map((car) => (
              <>
                {disposition === "flex" ? (
                  <ShoppingCartItem
                    image={car.gallery[0]}
                    title={`${car.brand} ${car.model} - ${car.condition} ${car.color}`}
                    subtitle={`${car.licensePlate} ${car.manufactureYear}`}
                    price={`${car.price}`}
                    initialQuantity={2}
                  />
                ) : (
                  <CarCard key={car.vehicleId} vehicle={car} />
                )}
              </>
            )) : inventory.map((car) => (
              <>
                {disposition === "flex" ? (
                  <ShoppingCartItem
                    image={car.gallery[0]}
                    title={`${car.brand} ${car.model} - ${car.condition} ${car.color}`}
                    subtitle={`${car.licensePlate} ${car.manufactureYear}`}
                    price={`${car.price}`}
                    initialQuantity={2}
                  />
                ) : (
                  <CarCard key={car.vehicleId} vehicle={car} />
                )}
              </>
            ))}
        </div>
      )}

    </>
  );
};

export default CarGrid;
