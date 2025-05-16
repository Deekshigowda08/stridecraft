"use client";
import Navbar from "@/app/navbar/page";
import React, { useEffect, useState } from "react";
import { db } from "@/app/api/auth";
import { doc, getDoc } from "firebase/firestore";
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

const ProductPage = () => {
  const searchParams = useSearchParams();
  const name = searchParams.get("name");
   const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchFilteredProducts = async () => {
      const docRef = doc(db, "Products", "ctXW6grbOSp8QwWBZ4o5"); 
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const rawData = docSnap.data(); // this is a map with numeric keys

        // Convert map to array
        const productArray = Object.values(rawData);

        // Filter based on condition
        const filtered = productArray.filter(
          item => item.product === name 
        );

        setProducts(filtered);
      } else {
        console.log("No such document!");
      }
    };

    fetchFilteredProducts();
  }, []);
  

  if (!products.length) {
    return (
      <div className="bg-[#ffeed1] min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold text-gray-800">Loading...</h1>
      </div>
    );
    
  }
  else if (products.length === 0) {
    return (
      <div className="bg-[#ffeed1] min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold text-gray-800">No products found</h1>
      </div>
    );
  }
  else {
  return (
    <Suspense fallback={<div>Loading...</div>}>
    <div className="bg-[#ffeed1] min-h-screen">
      {/* Fixed Navbar */}
      <Navbar/>
      {/* Main Content */}
      <div className="pt-10 px-6 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="border bg-black rounded-2xl shadow-md hover:shadow-xl transition duration-300 p-4"
            >
              <div className="w-full h-60 bg-gray-100 flex items-center justify-center overflow-hidden rounded-xl mb-4">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="object-contain w-full h-full"
                />
              </div>
              <h2 className="text-lg font-semibold text-white">{product.name}</h2>
              <div className="mt-2 flex items-center space-x-2">
                <span className="text-green-400 font-bold text-xl">
                  ₹{product.price}
                </span>
                <span className="line-through text-gray-400">
                  ₹{product["original price"]}
                </span>
                <span className="text-sm text-red-400">
                  (
                  {Math.round(
                    ((product["original price"] - product.price) /
                      product["original price"]) *
                      100
                  )}
                  % OFF)
                </span>
              </div>
              <button className="mt-4 w-full bg-green-700 text-white py-2 rounded-xl hover:bg-green-600 transition duration-300">
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
    </Suspense>
  );
}
};

export default ProductPage;
