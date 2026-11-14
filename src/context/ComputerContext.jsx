
import { createContext, useContext, useEffect, useState } from "react";

const ComputerContext = createContext(null);

const API_URL = "http://localhost:8080/api/computers";
const PAGE_SIZE = 2;

export function ComputerProvider({ children }) {
    const [computers, setComputers] = useState([]);
    const [page, setPage] = useState(0);
    const [isLastPage, setIsLastPage] = useState(false);
    const [error, setError] = useState("");
    const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    fetch(`${API_URL}?page=${page}&size=${PAGE_SIZE}&sort=id,asc`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Server error");
        }
        return response.json();
      })
      .then((data) => {
        setComputers(data);
        setIsLastPage(data.length < PAGE_SIZE);
        setError("");
      })
      .catch(() => {
        setError("Could not load computers. Is the Spring server running?");
      });
  }, [page, reloadKey]);

  function goToNextPage() {
    setPage((prev) => prev + 1);
  }

  function goToPreviousPage() {
    setPage((prev) => Math.max(prev - 1, 0));
  } 

    async function addComputer(computer) {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...computer,
        assignedTo: computer.assignedTo || null,
      }),
    });

    if (response.ok) {
      setReloadKey((prev) => prev + 1);
    } else {
      setError("Could not add the computer.");
    }
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
    <ComputerContext.Provider value={{computers, setComputers, page, isLastPage, error, goToNextPage, goToPreviousPage, addComputer, updateComputer, deleteComputer,}}>
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
