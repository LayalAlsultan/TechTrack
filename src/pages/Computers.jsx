import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";

import { useComputers } from "../context/ComputerContext";
import ComputerForm from "../components/ComputerForm";
import "../styles/computers.css";

export default function Computers() {
  const { computers, addComputer, updateComputer, deleteComputer } =
    useComputers();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingComputer, setEditingComputer] = useState(null);

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

      <section className="panel">
        <div className="panel-header">
          <h2>All Computers</h2>
          <span>{computers.length} assets</span>
        </div>

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