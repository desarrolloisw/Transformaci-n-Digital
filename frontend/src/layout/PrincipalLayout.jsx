/**
 * PrincipalLayout component
 *
 * Provides the main layout structure for the application, including:
 * - Sidebar navigation
 * - Top logout bar
 * - Main content area (renders current route via <Outlet />)
 * - Footer
 *
 * Ensures a responsive, full-height layout with consistent UI across all pages.
 */
import { Sidebar } from "../components/ui/Sidebar";
import { LogoutBar } from "../components/ui/LogoutBar";
import { Outlet } from "react-router-dom";
import { Footer } from "../components/ui/Footer";

export function PrincipalLayout() {
  return (
    <div className="flex min-h-screen bg-white overflow-x-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <LogoutBar />
        <main className="flex-grow pt-14 transition-all duration-300">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}