'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HealthCheck from '@/components/HealthCheck';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { href: '/admin/leads', label: 'Leads' },
    { href: '/admin/newsletter', label: 'Newsletter' },
    { href: '/admin/categories', label: 'Categorías' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Panel de Administración</h1>
              <p className="text-gray-600">Gestiona leads, suscriptores y categorías</p>
            </div>
            <div className="w-full sm:w-auto">
              <HealthCheck />
            </div>
          </div>
        </div>

        {/* Navegación */}
        <nav className="mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2">
            <div className="flex flex-wrap gap-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-4 py-2 rounded-md font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Contenido */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {children}
        </div>
      </div>

      <Footer />
    </div>
  );
}

