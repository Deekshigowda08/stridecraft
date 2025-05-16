"use client";
import { Suspense } from 'react';
import ProductPage from './compoent';

export default function Products() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ProductPage />
    </Suspense>
  );
}

