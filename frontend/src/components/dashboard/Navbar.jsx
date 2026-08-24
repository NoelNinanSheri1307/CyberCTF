import { useState } from "react";
import { LogOut, Trophy, User, LayoutDashboard, Menu, X, Shield } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function DashboardNavbar({ username, onLogout }) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    {
      to: "/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      activeColor: "text-red-400",
    },
    {
      to: "/leaderboard",
      label: "Leaderboard",
      icon: Trophy,
      activeColor: "text-yellow-400",
    },
    {
      to: "/profile",
      label: "Profile",
      icon: User,
      activeColor: "text-cyan-400",
    },
  ];

  return (
    <nav className="relative z-20 border-b border-red-500/40 bg-black/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        {/* Main top bar flex row */}
        <div className="flex justify-between items-center">
          {/* Logo / Brand Title */}
          <Link to="/dashboard" className="flex items-center gap-2 group">
            <Shield className="w-5 h-5 text-red-500 group-hover:rotate-12 transition-transform duration-300" />
            <h1 className="glitch-cycle text-lg sm:text-xl font-bold tracking-wider">
              CTF <span className="text-red-400">Control Center</span>
            </h1>
          </Link>

          {/* Desktop Navigation (>= md) */}
          <div className="hidden md:flex items-center gap-3">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium transition duration-200 ${
                    isActive
                      ? "bg-red-500/30 border border-red-500 text-white shadow-[0_0_10px_rgba(244,66,39,0.3)]"
                      : "text-gray-300 hover:text-white hover:bg-gray-900 border border-transparent"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${link.activeColor}`} />
                  {link.label}
                </Link>
              );
            })}

            <span className="text-red-200 text-xs px-2.5 py-1 bg-red-950/60 rounded border border-red-800/80 font-mono">
              Operative: {username}
            </span>

            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-red-500/20 border border-red-500/40 hover:bg-red-500/30 hover:border-red-500 transition duration-200 text-sm text-red-300"
            >
              <LogOut className="w-4 h-4 text-red-400" />
              Logout
            </button>
          </div>

          {/* Mobile Hamburger Button (< md) */}
          <div className="flex items-center gap-2 md:hidden">
            <span className="text-red-200 text-[11px] px-2 py-0.5 bg-red-950/60 rounded border border-red-800/80 font-mono truncate max-w-[120px]">
              {username}
            </span>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded bg-red-950/50 border border-red-500/40 text-red-400 hover:text-white hover:bg-red-900/40 focus:outline-none transition"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu (< md) */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 pt-3 border-t border-red-500/30 flex flex-col gap-2 pb-1 animate-fadeIn">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded text-sm font-medium transition ${
                    isActive
                      ? "bg-red-500/30 border border-red-500 text-white"
                      : "text-gray-300 hover:text-white hover:bg-gray-900/80"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${link.activeColor}`} />
                  {link.label}
                </Link>
              );
            })}

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onLogout();
              }}
              className="flex items-center gap-2.5 px-3 py-2 mt-1 rounded bg-red-950/40 border border-red-500/40 text-red-300 hover:bg-red-900/50 transition text-sm text-left"
            >
              <LogOut className="w-4 h-4 text-red-400" />
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
