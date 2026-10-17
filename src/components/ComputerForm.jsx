import { useEffect, useState } from "react";
import { X } from "lucide-react";

const CATEGORIES = ["Laptop", "Desktop", "Workstation", "Tablet"];
const STATUSES = ["Available", "Assigned"];

const emptyForm = {
  name: "",
  assetTag: "",
  category: "Laptop",
  assignedTo: "",
  status: "Available",
};

export default function ComputerForm({
  initialData,
  existingTags,
  onSubmit,
  onCancel,
}) {
  const isEditing = Boolean(initialData);
  const [form, setForm] = useState(initialData ? { ...initialData } : emptyForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") onCancel();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onCancel]);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((prev) => {
      const next = { ...prev, [name]: value };
      if (name === "status" && value === "Available") {
        next.assignedTo = "";
      }
      return next;
    });

    setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  function validate() {
    const newErrors = {};
    const name = form.name.trim();
    const assetTag = form.assetTag.trim().toUpperCase();
    const assignedTo = form.assignedTo.trim();

    if (!name) {
      newErrors.name = "Computer name is required.";
    }

    if (!assetTag) {
      newErrors.assetTag = "Asset tag is required.";
    } else if (existingTags.includes(assetTag)) {
      newErrors.assetTag = "This asset tag is already in use.";
    }

    if (form.status === "Assigned" && !assignedTo) {
      newErrors.assignedTo = "Enter who this computer is assigned to.";
    }

    return newErrors;
  }

  function handleSubmit(event) {
    event.preventDefault();

    const foundErrors = validate();
    if (Object.keys(foundErrors).length > 0) {
      setErrors(foundErrors);
      return;
    }

    onSubmit({
      name: form.name.trim(),
      assetTag: form.assetTag.trim().toUpperCase(),
      category: form.category,
      assignedTo: form.status === "Assigned" ? form.assignedTo.trim() : "",
      status: form.status,
    });
  }

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="computer-form-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <h2 id="computer-form-title">
            {isEditing ? "Edit Computer" : "Add Computer"}
          </h2>
          <button
            type="button"
            className="icon-button"
            onClick={onCancel}
            aria-label="Close form"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="name">Computer Name</label>
              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Dell Latitude 5440"
              />
              {errors.name && <p className="field-error">{errors.name}</p>}
            </div>

            <div className="form-field">
              <label htmlFor="assetTag">Asset Tag</label>
              <input
                id="assetTag"
                name="assetTag"
                type="text"
                value={form.assetTag}
                onChange={handleChange}
                placeholder="e.g. PC-004"
              />
              {errors.assetTag && (
                <p className="field-error">{errors.assetTag}</p>
              )}
            </div>

            <div className="form-field">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                value={form.category}
                onChange={handleChange}
              >
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={form.status}
                onChange={handleChange}
              >
                {STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-field form-field-full">
              <label htmlFor="assignedTo">Assigned To</label>
              <input
                id="assignedTo"
                name="assignedTo"
                type="text"
                value={form.assignedTo}
                onChange={handleChange}
                disabled={form.status === "Available"}
                placeholder={
                  form.status === "Available" ? "Not assigned" : "e.g. Ahmed"
                }
              />
              {errors.assignedTo && (
                <p className="field-error">{errors.assignedTo}</p>
              )}
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {isEditing ? "Save Changes" : "Add Computer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}