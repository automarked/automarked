"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface MaterialLayoutProps {
  isOpen: boolean;
  isLoading: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
  openSidebar: () => void;
  setLoading: (param: boolean) => void
}

const MaterialLayoutContext = createContext<MaterialLayoutProps | undefined>(
  undefined
);

export const MaterialLayoutProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const toggleSidebar = () => setIsOpen((prev) => !prev);
  const closeSidebar = () => setIsOpen(false);
  const openSidebar = () => setIsOpen(true);

  return (
    <MaterialLayoutContext.Provider
      value={{ isOpen, toggleSidebar, closeSidebar, openSidebar, setLoading: setIsLoading, isLoading }}
    >
      {children}
    </MaterialLayoutContext.Provider>
  );
};

export const useMaterialLayout = () => {
  const context = useContext(MaterialLayoutContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};
