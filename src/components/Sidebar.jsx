
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Monitor,
  Users,
} from "lucide-react";

const links = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/computers", label: "Computers", icon: Monitor },
  { to: "/about", label: "About Us", icon: Users },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <Monitor size={28} />
        <div>
          <h2>TechTrack</h2>
          <p>Computer Asset Management</p>
        </div>
      </div>

      <p className="nav-heading">Menu</p>

      <nav>
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `nav-link ${isActive ? "active" : ""}`
            }
          >
            <Icon size={19} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        SE411 Project
      </div>
    </aside>
  );
}
