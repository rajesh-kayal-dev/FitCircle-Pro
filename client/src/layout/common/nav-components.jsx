import React, { useMemo, useCallback } from 'react';
import { Home, Compass, Dumbbell, Utensils, User, LogOut, Settings, Bell, Search as SearchIcon } from "lucide-react";
import { NavLink, useNavigate } from 'react-router';
import { Button, Avatar, cn } from '../../components/ui';

const NAV_ITEMS = [
  { path: '/feed', label: 'Feed', icon: Home },
  { path: '/explore', label: 'Search', icon: SearchIcon },
  { path: '/workouts', label: 'Workouts', icon: Dumbbell },
  { path: '/diet', label: 'Diet AI', icon: Utensils },
  { path: '/profile', label: 'Profile', icon: User },
];

import { useAuth } from '../../context/AuthContext';
import { getUserAvatar } from '../../utils/avatar';

export const Header = () => {
  const { user } = useAuth();
  
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between px-4 md:px-8 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
            <Dumbbell className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">FitCircle Pro</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center relative">
            <SearchIcon className="absolute left-3 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search influencers..."
              className="pl-9 pr-4 py-1.5 text-sm rounded-full border border-border bg-muted/50 focus:outline-none focus:ring-1 focus:ring-primary w-64"
            />
          </div>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-background"></span>
          </Button>
          <Avatar 
            src={getUserAvatar(user)} 
            fallback={user?.name?.substring(0, 2).toUpperCase() || "UP"} 
          />
        </div>
      </div>
    </header>
  );
};

export const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    navigate('/welcome');
  }, [navigate]);

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-border bg-background h-screen sticky top-0">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
            <Dumbbell className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">FitCircle Pro</span>
        </div>
        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map(({ path, label, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all group',
                  isActive
                    ? 'bg-accent text-accent-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )
              }
            >
              <Icon className="w-5 h-5 transition-transform group-hover:scale-105" />
              {label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-4 border-t border-border">
        <div className="flex flex-col gap-1">
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all text-muted-foreground hover:bg-muted hover:text-foreground',
                isActive && 'bg-accent text-accent-foreground'
              )
            }
          >
            <Settings className="w-5 h-5" />
            Settings
          </NavLink>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-destructive hover:bg-destructive/10 transition-all cursor-pointer text-left"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
        <div className="mt-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
          <p className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400 mb-1 tracking-wider">Pro Plan</p>
          <p className="text-xs text-blue-800/80 dark:text-blue-200/80">Premium access active until Dec 2026</p>
        </div>
      </div>
    </aside>
  );
};

export const BottomNav = () => (
  <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 h-16 bg-background/95 backdrop-blur border-t border-border flex items-center justify-around px-2 pb-safe">
    {NAV_ITEMS.map(({ path, label, icon: Icon }) => (
      <NavLink
        key={path}
        to={path}
        className={({ isActive }) =>
          cn(
            'flex flex-col items-center justify-center gap-1 transition-all',
            isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
          )
        }
      >
        <Icon className="w-5 h-5" />
        <span className="text-[10px] font-medium leading-none">{label}</span>
      </NavLink>
    ))}
  </nav>
);
