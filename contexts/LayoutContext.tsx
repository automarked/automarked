"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface MaterialLayoutProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
  openSidebar: () => void;
}

const MaterialLayoutContext = createContext<MaterialLayoutProps | undefined>(
  undefined
);

export const MaterialLayoutProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => setIsOpen((prev) => !prev);
  const closeSidebar = () => setIsOpen(false);
  const openSidebar = () => setIsOpen(true);

  return (
    <MaterialLayoutContext.Provider
      value={{ isOpen, toggleSidebar, closeSidebar, openSidebar }}
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
