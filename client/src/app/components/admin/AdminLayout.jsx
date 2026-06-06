import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";

export function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-50 overflow-x-hidden">
      <AdminSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      
      <main className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'lg:pl-[280px]' : ''}`}>
        <AdminHeader toggleSidebar={toggleSidebar} />
        <div className="p-6 md:p-8 flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
