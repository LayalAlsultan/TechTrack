
import { createContext, useContext, useState } from "react";

const ComputerContext = createContext(null);

const initialComputers = [
  {
    id: 1,
    name: "Dell Latitude 5440",
    assetTag: "PC-001",
    category: "Laptop",
    assignedTo: "Ahmed",
    status: "Assigned",
  },
  {
    id: 2,
    name: "HP ProBook 450",
    assetTag: "PC-002",
    category: "Laptop",
    assignedTo: "",
    status: "Available",
  },
  {
    id: 3,
    name: "Lenovo ThinkCentre",
    assetTag: "PC-003",
    category: "Desktop",
    assignedTo: "Sara",
    status: "Assigned",
  },
];

export function ComputerProvider({ children }) {
  const [computers, setComputers] = useState(initialComputers);

  return (
    <ComputerContext.Provider value={{ computers, setComputers }}>
      {children}
    </ComputerContext.Provider>
  );
}

export function useComputers() {
  const context = useContext(ComputerContext);

  if (!context) {
    throw new Error(
      "useComputers must be used inside ComputerProvider"
    );
  }

  return context;
}
