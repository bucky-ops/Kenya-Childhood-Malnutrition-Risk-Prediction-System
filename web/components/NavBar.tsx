'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HeartPulse, Map as MapIcon, LayoutDashboard, Info, MessageCircle, Newspaper, Share2 } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/map', label: 'Interactive Map', icon: MapIcon },
  { href: '/about', label: 'About Us', icon: Info },
  { href: '/qa', label: 'Q&A', icon: MessageCircle },
  { href: '/blog', label: 'News & Blog', icon: Newspaper },
  { href: '/stories', label: 'Share a Story', icon: Share2 },
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="flex items-center gap-2 text-emerald-700 font-bold">
            <HeartPulse className="w-5 h-5" aria-hidden="true" />
            <span className="hidden sm:inline">Kenya Malnutrition</span>
          </Link>
          <ul className="flex items-center gap-1 overflow-x-auto">
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                      active
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                    aria-current={active ? 'page' : undefined}
                  >
                    <Icon className="w-4 h-4" aria-hidden="true" />
                    <span className="hidden sm:inline">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </nav>
  );
}
