/**
 * LogoutBar component
 *
 * Displays a fixed top bar with user info and a dropdown for logout.
 * Handles dropdown open/close, click outside to close, and logout navigation.
 *
 * Features:
 *   - Shows current username and avatar
 *   - Dropdown menu for logout action
 *   - Responsive and styled for consistent UI
 */

import { useState, useRef, useEffect } from "react";
import { HiChevronDown, HiLogout } from "react-icons/hi";
import { logout, getUsername } from "../../api/auth.api";
import { useNavigate } from "react-router-dom";
import defaultUserImg from "../../assets/img/default_user.png";

export const LogoutBar = () => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="fixed top-0 right-0 z-30 w-full flex justify-end items-center h-14 bg-[#00478f] shadow-md pr-4 md:pr-8"
      style={{ 
        transition: "margin-left 0.3s",
      }}
    >
      <div className="relative" ref={dropdownRef}>
        <button
          className="flex items-center gap-2 px-3 py-2 rounded-full bg-[#00478f] text-white font-semibold hover:bg-blue-800 transition-colors focus:outline-none"
          onClick={() => setOpen((o) => !o)}
        >
          <img
            src={defaultUserImg}
            alt="Usuario"
            className="w-8 h-8 rounded-full border-2 border-white object-cover bg-white"
            draggable={false}
          />
          <span className="hidden sm:inline">Bienvenid@</span>
          <span className="font-bold hidden sm:inline">{getUsername()}</span>
          <HiChevronDown className={`transition-transform ${open ? "rotate-180" : ""}`} size={22} />
        </button>
        {open && (
          <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg py-2 z-50 animate-fade-in">
            <button
              className="flex items-center gap-2 w-full px-4 py-2 text-[#00478f] hover:bg-blue-100 font-semibold transition-colors"
              onClick={() => {
                logout();
                navigate("/login", { replace: true });
              }}
            >
              <HiLogout size={20} />
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
      <style>
        {`
          @keyframes fade-in {
            from { opacity: 0; transform: translateY(-10px);}
            to { opacity: 1; transform: translateY(0);}
          }
          .animate-fade-in {
            animation: fade-in 0.2s ease;
          }
        `}
      </style>
    </div>
  );
};