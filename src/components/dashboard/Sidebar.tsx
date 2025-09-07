import React from 'react';
import Link from 'next/link';

const Sidebar: React.FC<{ role?: string, className?: string, active?: string }> = ({ role = 'user', className = '', active = '' }) => {
  const menu: { name: string; link: string }[] = [
    { name: 'Dashboard', link: '/dashboard/user' },
    { name: 'Proposals', link: '/proposals' },
    { name: 'Users', link: '/users' },
    { name: 'Companies', link: '/businesses' },
    { name: 'Messages', link: '/chat' },
    { name: 'Events', link: '/events' },
  ];

  // role-based additions
  if (role === 'admin') {
    menu.unshift({ name: 'Admin', link: '/dashboard/admin' });
  }
  if (role === 'business') {
    menu.unshift({ name: 'Business', link: '/dashboard/business' });
  }

  return (
    <aside className={`w-64 p-4 ${className} hidden lg:block`}>
      <div className="sticky top-20">
        <div className="bg-white/70 backdrop-blur-sm border border-gray-200 rounded-2xl p-4 shadow-sm">
          <div className="mb-4">
            <div className="text-sm font-semibold text-gray-800">Navigation</div>
            <div className="text-xs text-gray-600">{role.charAt(0).toUpperCase() + role.slice(1)}</div>
          </div>

          <nav className="space-y-1">
            {menu.map((m) => (
              <Link href={m.link} key={m.link}>
                <a
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition ${
                    active === m.link
                      ? 'bg-gradient-to-r from-[#f26722] to-[#ff8f57] text-white shadow'
                      : 'text-gray-700 hover:bg-white/50 hover:shadow'
                  }`}
                >
                  <span>{m.name}</span>
                  {active === m.link && <span className="text-xs">●</span>}
                </a>
              </Link>
            ))}
          </nav>

          <div className="mt-6 pt-4 border-t border-gray-100 text-xs text-gray-600">
            <div className="font-medium">Quick Actions</div>
            <div className="mt-2 space-y-2">
              <Link href="/proposals/new"><a className="block px-3 py-2 rounded-lg text-sm bg-white/80 hover:shadow">Post Proposal</a></Link>
              <Link href="/events/new"><a className="block px-3 py-2 rounded-lg text-sm bg-white/80 hover:shadow">Create Event</a></Link>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
