import { useState } from "react";
import { Plus, Pencil, Trash2, ChevronLeft, ChevronRight, Search } from "lucide-react";

import { useComputers } from "../context/ComputerContext";
import ComputerForm from "../components/ComputerForm";
import "../styles/computers.css";

export default function Computers() {
    const { computers, page, isLastPage, error, goToNextPage, goToPreviousPage, addComputer, updateComputer, deleteComputer, findComputerById,} = 
    useComputers();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingComputer, setEditingComputer] = useState(null);
  const [searchId, setSearchId] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [searchMessage, setSearchMessage] = useState("");

  function openAddForm() {
    setEditingComputer(null);
    setIsFormOpen(true);
  }

  function openEditForm(computer) {
    setEditingComputer(computer);
    setIsFormOpen(true);
  }

  function closeForm() {
    setIsFormOpen(false);
    setEditingComputer(null);
  }

  function handleSubmit(data) {
    if (editingComputer) {
      updateComputer(editingComputer.id, data);
    } else {
      addComputer(data);
    }
    closeForm();
  }

  function handleDelete(computer) {
    const confirmed = window.confirm(
      `Delete ${computer.name} (${computer.assetTag})? This cannot be undone.`
    );
    if (confirmed) {
      deleteComputer(computer.id);
    }
  }

  async function handleSearch(event) {
    event.preventDefault();
    const id = searchId.trim();

    if (!id) {
      setSearchResult(null);
      setSearchMessage("Enter an ID to search.");
      return;
    }

    try {
      const computer = await findComputerById(id);

      if (computer) {
        setSearchResult(computer);
        setSearchMessage("");
      } else {
        setSearchResult(null);
        setSearchMessage(`No computer found with ID ${id}.`);
      }
    } catch {
      setSearchResult(null);
      setSearchMessage("Could not reach the server. Is the Spring server running?");
    }
  }

  function clearSearch() {
    setSearchId("");
    setSearchResult(null);
    setSearchMessage("");
  }
  

  const existingTags = computers
    .filter((c) => !editingComputer || c.id !== editingComputer.id)
    .map((c) => c.assetTag.toUpperCase());

  return (
    <div>
      <header className="page-header page-header-row">
        <div>
          <h1>Computers</h1>
          <p className="subtitle">
            Add, edit, and remove computers in your inventory.
          </p>
        </div>

        <button type="button" className="btn btn-primary" onClick={openAddForm}>
          <Plus size={18} />
          <span>Add Computer</span>
        </button>
      </header>

      <section className="panel search-panel">
        <div className="panel-header">
          <h2>Search by ID</h2>
        </div>

        <form className="search-form" onSubmit={handleSearch}>
          <input
            type="number"
            min="1"
            value={searchId}
            onChange={(event) => setSearchId(event.target.value)}
            placeholder="e.g. 2"
            aria-label="Computer ID"
          />
          <button type="submit" className="btn btn-primary">
            <Search size={18} />
            <span>Search</span>
          </button>
          {(searchResult || searchMessage) && (
            <button type="button" className="btn btn-secondary" onClick={clearSearch}>
              Clear
            </button>
          )}
        </form>

        {searchMessage && <p className="search-message">{searchMessage}</p>}

        {searchResult && (
          <div className="table-wrapper search-result">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Asset Tag</th>
                  <th>Computer Name</th>
                  <th>Category</th>
                  <th>Assigned To</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{searchResult.id}</td>
                  <td>{searchResult.assetTag}</td>
                  <td>{searchResult.name}</td>
                  <td>{searchResult.category}</td>
                  <td>{searchResult.assignedTo || "Not assigned"}</td>
                  <td>
                    <span
                      className={`status status-${searchResult.status.toLowerCase()}`}
                    >
                      {searchResult.status}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="panel">
        <div className="panel-header">
          <h2>All Computers</h2>
          <span>Page {page + 1}</span>
        </div>

        {error && <p className="error-message">{error}</p>}
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Asset Tag</th>
                <th>Computer Name</th>
                <th>Category</th>
                <th>Assigned To</th>
                <th>Status</th>
                <th className="actions-header">Actions</th>
              </tr>
            </thead>

            <tbody>
              {computers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="empty-state">
                    No computers yet. Click "Add Computer" to create one.
                  </td>
                </tr>
              ) : (
                computers.map((computer) => (
                  <tr key={computer.id}>
                    <td>{computer.assetTag}</td>
                    <td>{computer.name}</td>
                    <td>{computer.category}</td>
                    <td>{computer.assignedTo || "Not assigned"}</td>
                    <td>
                      <span
                        className={`status status-${computer.status.toLowerCase()}`}
                      >
                        {computer.status}
                      </span>
                    </td>
                    <td className="actions-cell">
                      <button
                        type="button"
                        className="action-button"
                        onClick={() => openEditForm(computer)}
                        aria-label={`Edit ${computer.name}`}
                        title="Edit"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        type="button"
                        className="action-button action-delete"
                        onClick={() => handleDelete(computer)}
                        aria-label={`Delete ${computer.name}`}
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
                    </table>
        </div>

        <div className="pagination">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={goToPreviousPage}
            disabled={page === 0}
          >
            <ChevronLeft size={18} />
            <span>Previous</span>
          </button>

          <span className="pagination-info">Page {page + 1}</span>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={goToNextPage}
            disabled={isLastPage}
          >
            <span>Next</span>
            <ChevronRight size={18} />
          </button>
        </div>
      </section>

      {isFormOpen && (
        <ComputerForm
          key={editingComputer ? editingComputer.id : "new"}
          initialData={editingComputer}
          existingTags={existingTags}
          onSubmit={handleSubmit}
          onCancel={closeForm}
        />
      )}
    </div>
  );
}