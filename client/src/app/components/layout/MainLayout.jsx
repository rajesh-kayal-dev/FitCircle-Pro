import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router";
import { Sidebar } from "./Sidebar";
import { BottomNav } from "./BottomNav";

export function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen bg-brand-bg text-brand-text">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className="flex-1 flex flex-col lg:pl-[280px]">
        <main className="flex-1 p-4 md:p-6 lg:p-8 pb-24 lg:pb-8 max-w-[1440px] mx-auto w-full">
          <Outlet />
        </main>

        <BottomNav />
      </div>
    </div>
  );
}
