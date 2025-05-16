"use client";
import { Suspense } from 'react';
import ProductPage from './compoent';

export default function Products() {
  return (
    <Suspense fallback={<div className="bg-[#fef5e4] min-h-screen flex items-center justify-center">
  <div className="flex flex-col items-center space-y-4">
    <div className="w-16 h-16 border-4 border-green-800 border-dashed rounded-full animate-spin"></div>
    <p className="text-xl font-semibold text-green-800">Loading...</p>
  </div>
</div>}>
      <ProductPage />
    </Suspense>
  );
}

