import { Sidebar } from "../components/ui/Sidebar";
import { LogoutBar } from "../components/ui/LogoutBar";
import { Outlet } from "react-router-dom";
import { Footer } from "../components/ui/Footer";

export function PrincipalLayout() {
  return (
    <div className="flex min-h-screen bg-white overflow-x-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <LogoutBar username="Juan Pérez" />
        <main className="flex-grow p-4 pt-14 transition-all duration-300">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}