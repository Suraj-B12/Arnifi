import { Outlet } from "react-router";
import Navbar from "./Navbar";

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}
