'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Compass,
  LayoutDashboard,
  MapPinPlus,
  ExternalLink,
  LogOut,
  Loader2,
  Menu,
  X,
  ShieldCheck,
} from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Add Location', href: '/admin/spots/new', icon: MapPinPlus },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(pathname !== '/admin/login');

  useEffect(() => {
    if (pathname === '/admin/login') {
      setLoading(false);
      return;
    }

    let isMounted = true;
    async function verifyAuth() {
      try {
        const res = await fetch('/api/admin/auth', { method: 'GET' });
        if (!res.ok) {
          router.replace('/admin/login');
        } else {
          if (isMounted) setLoading(false);
        }
      } catch {
        router.replace('/admin/login');
      }
    }

    verifyAuth();

    return () => {
      isMounted = false;
    };
  }, [pathname, router]);

  // Skip layout for login page
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // Show loading gate while verifying authentication
  if (loading) {
    return (
      <div className=min-h-screen bg-[#0B130E] flex flex-col items-center justify-center gap-3>
        <div className=w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FF6B4A] via-emerald-600 to-emerald-800 flex items-center justify-center shadow-[0_0_20px_rgba(255,107,74,0.3)] animate-pulse>
          <ShieldCheck size={24} className=text-white />
        </div>
        <div className=flex items-center gap-2 text-slate-300 text-sm font-medium>
          <Loader2 size={16} className=animate-spin text-[#FF6B4A] />
          <span>Verifying Admin Access...</span>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    router.replace('/admin/login');
  };

  return (
    <div className=min-h-screen bg-[#0B130E] flex>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className=fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={ixed lg:sticky top-0 left-0 z-50 h-screen w-[260px] bg-[#0A120D] border-r border-emerald-500/15 flex flex-col transition-transform duration-300 }
      >
        {/* Brand */}
        <div className=p-5 flex items-center justify-between>
          <Link href=/admin className=flex items-center gap-2.5>
            <div className=w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF6B4A] via-emerald-600 to-emerald-800 flex items-center justify-center shadow-[0_0_15px_rgba(255,107,74,0.25)]>
              <Compass size={18} className=text-slate-100 />
            </div>
            <div>
              <span className=text-sm font-black text-slate-100>
                Explore<span className=text-[#FF6B4A]>Pakur</span>
              </span>
              <span className=block text-[10px] text-slate-500 -mt-0.5 font-bold tracking-wider>ADMIN PANEL</span>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className=lg:hidden text-slate-400 hover:text-slate-200 transition-colors
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className=flex-1 px-3 py-4 space-y-1>
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={lex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all }
              >
                <Icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className=p-4 space-y-2 border-t border-emerald-500/10>
          <Link
            href=/
            target=_blank
            className=flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs text-slate-400 hover:text-slate-200 hover:bg-[#111E16] transition-all font-medium
          >
            <ExternalLink size={14} />
            View Live Site
          </Link>
          <button
            onClick={handleLogout}
            className=w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs text-red-400 hover:text-red-300 hover:bg-red-900/20 transition-all font-medium
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className=flex-1 min-w-0>
        {/* Top Bar (mobile) */}
        <div className=lg:hidden flex items-center justify-between px-4 py-3 border-b border-emerald-500/10 bg-[#0A120D] sticky top-0 z-30>
          <button
            onClick={() => setSidebarOpen(true)}
            className=text-slate-300 hover:text-[#FF6B4A] transition-colors
          >
            <Menu size={22} />
          </button>
          <span className=text-sm font-black text-slate-100>
            Explore<span className=text-[#FF6B4A]>Pakur</span>
          </span>
          <div className=w-6 />
        </div>

        {/* Page Content */}
        <div className=p-4 sm:p-6 lg:p-8 max-w-7xl>
          {children}
        </div>
      </main>
    </div>
  );
}
