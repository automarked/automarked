import React, { useCallback, useState } from "react";
import CarCard from "./car-card";
import { InventoryItem } from "@/models/inventory";
import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";
import { FaTrash } from "react-icons/fa";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import useInventory from "@/hooks/useInventory";
import { useAuth } from "@/contexts/AuthContext";

const CarGrid: React.FC<{ inventory: InventoryItem[], searchOnList: string, onDelete: (item: InventoryItem) => void }> = ({ inventory, searchOnList, onDelete }) => {
  const [vehicle, setVehicle] = useState<InventoryItem>()
  const { user } = useAuth();

  return (
    <>
      <AlertDialog open={!!vehicle} onOpenChange={() => setVehicle(undefined)}>
        <AlertDialogContent className="rounded-[2rem] max-w-72 h-auto p-0">
          <div>
            <Image
              src={vehicle?.vehicles.gallery[0] ?? ""}
              alt={vehicle?.vehicles.vehicleId ?? 'car-image'}
              width={200}
              height={200}
              className="w-full rounded-t-[2rem] h-full object-cover"
            />
          </div>
          <AlertDialogHeader className="px-4">
            <AlertDialogTitle className="leading-6">Tem a certeza que deseja apagar este veículo?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta açao não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="px-4 pb-4">
            <AlertDialogCancel className="rounded-3xl py-4" onClick={() => setVehicle(undefined)}>Não, cancela</AlertDialogCancel>
            <AlertDialogAction className="rounded-3xl py-4" onClick={() => vehicle ? onDelete(vehicle) : () => { }}>Tenho</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {searchOnList.trim() && (
        <div className="mb-2">Resultados para <strong className="font-bold">{searchOnList}</strong></div>
      )}
      {inventory.length > 0 && (
        <div className="grid custom-grid sm:grid-cols-4 md:grid-cols-5 xl:grid-cols-7 gap-2">
          {searchOnList.trim() ? inventory.filter(car =>
            `
        ${car.vehicles.brand} 
        ${car.vehicles.model} 
        ${car.vehicles.color} 
        ${car.vehicles.condition}
      `
              .toLowerCase()
              .includes(
                searchOnList.toLowerCase()
              ))
            .map((car) => (
              <CarCard onDelete={setVehicle} key={car.vehicles.vehicleId} vehicle={car} />
            )) : inventory.map((car) => (
              <CarCard onDelete={setVehicle} key={car.vehicles.vehicleId} vehicle={car} />
            ))}
        </div>
      )}
      {inventory.length === 0 && (
        <div className="w-full flex flex-col items-center text-center">
          <br />
          <Image
            src="/images/inventory.png"
            alt="not found"
            width={250}
            height={250}
            className="backdrop-opacity-0 mix-blend-multiply"
          />
          <br />
          <small className="text-gray-400">Seu inventário está vazio! <br /> Os seus veículos aparecerão aqui depois que forem adicionados!</small>
          <br />
          <br />
          <Link href="/seller/inventory/new" className="w-full">
            <Button className="w-full max-w-md py-6 mb-6 bg-black text-white rounded-full text-base font-medium">
              Adicionar
            </Button>
          </Link>
        </div>
      )}
    </>
  );
};

export default CarGrid;
