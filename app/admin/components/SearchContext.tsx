"use client";

import React, { createContext, useContext, useState } from "react";

interface SearchContextType {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
}

const SearchContext = createContext<SearchContextType>({
  searchTerm: "",
  setSearchTerm: () => {},
  isMobileMenuOpen: false,
  setIsMobileMenuOpen: () => {},
});

export const useSearch = () => useContext(SearchContext);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <SearchContext.Provider value={{ searchTerm, setSearchTerm, isMobileMenuOpen, setIsMobileMenuOpen }}>
      {children}
    </SearchContext.Provider>
  );
}


