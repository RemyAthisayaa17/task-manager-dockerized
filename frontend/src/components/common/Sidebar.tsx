import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { showToast } from "../../utils/toast";
import {
  FiCheckSquare,
  FiUsers,
  FiLogOut,
  FiMenu,
  FiX,
} from "react-icons/fi";

interface SidebarProps {
  children: React.ReactNode;
}

const Sidebar = ({ children }: SidebarProps) => {
  const { logout, isAdmin, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    showToast("Logged out successfully", "success");
    navigate("/login");
  };

  const navItems = [
    { to: "/dashboard", label: "Tasks", icon: FiCheckSquare },
    ...(isAdmin ? [{ to: "/admin", label: "Users", icon: FiUsers }] : []),
  ];

  const isActive = (path: string) => location.pathname === path;

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-slate-200">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center flex-shrink-0">
            <FiCheckSquare size={14} className="text-white" />
          </div>
          <span className="font-semibold text-slate-800 text-sm tracking-tight">
            TaskFlow
          </span>
        </div>
      </div>

      {/* Logout at top area */}
      <div className="px-3 pt-3 pb-1">
        <button
          onClick={handleLogout}
          title="Logout"
          className="group flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-slate-500
            hover:bg-red-50 hover:text-red-600 transition-colors duration-150 text-sm"
        >
          <FiLogOut size={15} />
          <span className="text-xs font-medium">Logout</span>
        </button>
      </div>

      {/* Divider */}
      <div className="mx-3 border-t border-slate-100 mb-2" />

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-0.5">
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest px-3 mb-2 mt-1">
          Navigation
        </p>
        {navItems.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium
              transition-colors duration-150
              ${
                isActive(to)
                  ? "bg-indigo-50 text-indigo-700 border border-indigo-100"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
          >
            <Icon size={15} className={isActive(to) ? "text-indigo-600" : ""} />
            {label}
          </Link>
        ))}
      </nav>

      {/* User info at bottom */}
      <div className="px-3 py-4 border-t border-slate-100">
        <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-slate-50">
          <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center
            text-white text-xs font-bold uppercase flex-shrink-0">
            {user?.name?.[0] ?? "U"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-slate-700 truncate">{user?.name}</p>
            <p className="text-[10px] text-slate-400 truncate capitalize">{user?.role}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-56 flex-col bg-white border-r border-slate-200 flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-56 bg-white border-r border-slate-200 z-50
          transform transition-transform duration-200 md:hidden
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="absolute top-3 right-3">
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1.5 rounded-md text-slate-400 hover:text-slate-700"
          >
            <FiX size={16} />
          </button>
        </div>
        <SidebarContent />
      </aside>

      {/* Main area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Mobile topbar */}
        <div className="md:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-slate-200">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-1.5 rounded-md text-slate-500 hover:bg-slate-100"
          >
            <FiMenu size={18} />
          </button>
          <span className="font-semibold text-slate-800 text-sm">TaskFlow</span>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Sidebar;
