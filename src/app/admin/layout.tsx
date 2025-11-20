'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HealthCheck from '@/components/HealthCheck';
import { authApi } from '@/lib/api';
import { User } from '@/types';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      // Si estamos en la página de login, no verificar autenticación
      if (pathname === '/admin/login') {
        setLoading(false);
        return;
      }

      if (!authApi.isAuthenticated()) {
        router.push('/admin/login');
        return;
      }

      try {
        // Verificar que el token sea válido
        const currentUser = await authApi.verify();
        setUser(currentUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error verificando autenticación:', error);
        // Si hay error, limpiar y redirigir a login
        await authApi.logout();
        router.push('/admin/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router, pathname]);

  const handleLogout = async () => {
    await authApi.logout();
    router.push('/admin/login');
  };

  const navItems = [
    { href: '/admin/verification', label: 'Verificación' },
    { href: '/admin/businesses', label: 'Directorios' },
    { href: '/admin/leads', label: 'Leads' },
    { href: '/admin/newsletter', label: 'Newsletter' },
    { href: '/admin/categories', label: 'Categorías' },
  ];

  // Si estamos en login, no mostrar el layout de admin
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // Mostrar loading mientras se verifica autenticación
  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Panel de Administración</h1>
              <p className="text-gray-600">
                Gestiona directorios, leads, suscriptores y categorías
                {user && (
                  <span className="ml-2 text-sm text-gray-500">
                    • {user.full_name}
                  </span>
                )}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-full sm:w-auto">
                <HealthCheck />
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm whitespace-nowrap"
              >
                Cerrar Sesión
              </button>
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

