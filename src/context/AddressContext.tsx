// src/context/AddressContext.tsx
"use client";

import { createContext, useContext, useState, useEffect, useRef, ReactNode } from "react";

export interface Address {
  id: string;
  label: string; // "Home", "Office", etc.
  name: string;
  phone: string;
  address: string;
  city: string;
  isDefault: boolean;
}

interface AddressContextType {
  addresses: Address[];
  addAddress: (address: Omit<Address, "id">) => string;
  updateAddress: (id: string, address: Partial<Address>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  getDefaultAddress: () => Address | null;
  isHydrated: boolean;
}

const AddressContext = createContext<AddressContextType | undefined>(undefined);

export function AddressProvider({ children }: { children: ReactNode }) {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;

    try {
      const saved = localStorage.getItem("goalwear-addresses");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setAddresses(parsed);
      }
    } catch (err) {
      console.error("Failed to parse addresses", err);
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    localStorage.setItem("goalwear-addresses", JSON.stringify(addresses));
  }, [addresses, isHydrated]);

  const addAddress = (addressData: Omit<Address, "id">): string => {
    const newId = Date.now().toString();
    const newAddress: Address = { ...addressData, id: newId };

    setAddresses((prev) => {
      // যদি এটি প্রথম address হয়, তবে default বানাব
      if (prev.length === 0) newAddress.isDefault = true;

      // যদি নতুন address default হয়, আগের default remove করব
      if (newAddress.isDefault) {
        return [newAddress, ...prev.map((a) => ({ ...a, isDefault: false }))];
      }
      return [...prev, newAddress];
    });

    return newId;
  };

  const updateAddress = (id: string, updates: Partial<Address>) => {
    setAddresses((prev) =>
      prev.map((a) => {
        if (a.id === id) return { ...a, ...updates };
        // যদি updates.isDefault true হয়, অন্য সবার isDefault false করব
        if (updates.isDefault) return { ...a, isDefault: false };
        return a;
      })
    );
  };

  const deleteAddress = (id: string) => {
    setAddresses((prev) => {
      const filtered = prev.filter((a) => a.id !== id);
      // যদি delete করার পর একটাও default না থাকে, প্রথমটি default বানাব
      if (filtered.length > 0 && !filtered.some((a) => a.isDefault)) {
        filtered[0].isDefault = true;
      }
      return filtered;
    });
  };

  const setDefaultAddress = (id: string) => {
    setAddresses((prev) =>
      prev.map((a) => ({ ...a, isDefault: a.id === id }))
    );
  };

  const getDefaultAddress = (): Address | null => {
    return addresses.find((a) => a.isDefault) || addresses[0] || null;
  };

  return (
    <AddressContext.Provider
      value={{
        addresses,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
        getDefaultAddress,
        isHydrated,
      }}
    >
      {children}
    </AddressContext.Provider>
  );
}

export function useAddresses() {
  const context = useContext(AddressContext);
  if (!context) throw new Error("useAddresses must be used within AddressProvider");
  return context;
}