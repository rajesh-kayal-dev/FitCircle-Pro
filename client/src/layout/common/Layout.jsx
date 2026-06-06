import React, { Suspense } from 'react';
import { Outlet } from 'react-router';
import { Sidebar, BottomNav, Header } from './nav-components';

export const Layout = () => {
  return (
    <div className="flex min-h-screen bg-background text-foreground selection:bg-primary/10 selection:text-primary">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <Header className="md:hidden" />
        <main className="flex-1 px-4 py-6 md:px-8 max-w-7xl mx-auto w-full pb-24 md:pb-6">
          <Suspense fallback={
            <div className="flex items-center justify-center min-h-[50vh]">
              <div className="w-12 h-12 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            </div>
          }>
            <Outlet />
          </Suspense>
        </main>
        <BottomNav />
      </div>
    </div>
  );
};
