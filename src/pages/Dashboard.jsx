import {
  Monitor,
  CheckCircle2,
  UserRound,
} from "lucide-react";

import { useComputers } from "../context/ComputerContext";

export default function Dashboard() {
  const { computers } = useComputers();

  const total = computers.length;

  const available = computers.filter(
    (computer) => computer.status === "Available"
  ).length;

  const assigned = computers.filter(
    (computer) => computer.status === "Assigned"
  ).length;

  const stats = [
    {
      label: "Total Computers",
      value: total,
      icon: Monitor,
    },
    {
      label: "Available",
      value: available,
      icon: CheckCircle2,
    },
    {
      label: "Assigned",
      value: assigned,
      icon: UserRound,
    },
  ];

  return (
    <div>
      <header className="page-header">
        <h1>Dashboard</h1>
        <p className="subtitle">
          Monitor and manage your computer assets.
        </p>
      </header>

      <section className="stats-grid">
        {stats.map(({ label, value, icon: Icon }) => (
          <article className="stat-card" key={label}>
            <div className="stat-icon">
              <Icon size={24} />
            </div>
            <p className="stat-label">{label}</p>
            <h2>{value}</h2>
          </article>
        ))}
      </section>

      <section className="panel">
        <div className="panel-header">
          <h2>Computer Inventory</h2>
          <span>{total} assets</span>
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
              </tr>
            </thead>

            <tbody>
              {computers.map((computer) => (
                <tr key={computer.id}>
                  <td>{computer.assetTag}</td>
                  <td>{computer.name}</td>
                  <td>{computer.category}</td>
                  <td>{computer.assignedTo || "—"}</td>
                  <td>
                    <span
                      className={`status status-${computer.status.toLowerCase()}`}
                    >
                      {computer.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}