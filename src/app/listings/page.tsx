import { Suspense } from 'react';
import ListingsContent from './ListingsContent';

export default function ListingsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando listados...</p>
        </div>
      </div>
    }>
      <ListingsContent />
    </Suspense>
  );
}
