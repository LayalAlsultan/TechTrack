
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

  function addComputer(computer) {
    setComputers((prev) => {
      const nextId =
        prev.length > 0 ? Math.max(...prev.map((c) => c.id)) + 1 : 1;
      return [...prev, { ...computer, id: nextId }];
    });
  }

  function updateComputer(id, updates) {
    setComputers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates, id } : c))
    );
  }

  function deleteComputer(id) {
    setComputers((prev) => prev.filter((c) => c.id !== id));
  }

  return (
    <ComputerContext.Provider value={{computers, setComputers, addComputer, updateComputer, deleteComputer,}}>
      {children}
    </ComputerContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useComputers() {
  const context = useContext(ComputerContext);

  if (!context) {
    throw new Error(
      "useComputers must be used inside ComputerProvider"
    );
  }

  return context;
}
