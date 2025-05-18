"use client";
import Navbar from "@/app/navbar/page";
import React, { useEffect, useState } from "react";
import { db } from "@/app/api/auth";
import { doc, getDoc } from "firebase/firestore";
import { useSearchParams } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProductPage = () => {
  const searchParams = useSearchParams();
  const name = searchParams.get("name");
  const [products, setProducts] = useState([]);
  const [cartState, setCartState] = useState({}); // Track open size and added status

  useEffect(() => {
    const fetchFilteredProducts = async () => {
      const docRef = doc(db, "Products", "ctXW6grbOSp8QwWBZ4o5");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const rawData = docSnap.data();
        const productArray = Object.values(rawData);
        const filtered = productArray.filter(item => item.product === name);
        setProducts(filtered);
      } else {
        console.log("No such document!");
      }
    };

    fetchFilteredProducts();
  }, [name]);

  const handleAddToCartClick = (productId) => {
    setCartState((prev) => ({
      ...prev,
      [productId]: { ...prev[productId], selectingSize: true }
    }));
  };

  const handleSizeSelect = async (product, size) => {
    if (!(localStorage.getItem("useruid"))) {
      window.location.assign("https://stridecraft.vercel.app/loginandsingin");
      return; }
    const productId = product.id;
    setCartState((prev) => ({
      ...prev,
      [productId]: { selectingSize: false, added: true, size }
    }));
   
    const cartData = {
      uid: localStorage.getItem("useruid"),
      id: product.id,
      name: product.name,
      price: product.price,
      item:1,
      imageUrl: product.imageUrl,
      size,
    };

    try {
      let result=await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cartData),
      });
      if(result.status === 200) {
        toast.done("Added to cart successfully");
      }else{
        toast.error("Failed to add to cart");
      }
      if (result.ok) {
         toast.done("Added to cart successfully");
      }
    } catch (error) {
      toast.error(`ailed to add to cart:${error}`);
    }
  };

  if (!products.length) {
    return (
      <div className="bg-[#fef5e4] min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 border-4 border-green-800 border-dashed rounded-full animate-spin"></div>
          <p className="text-xl font-semibold text-green-800">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#ffeed1] min-h-screen">
      <Navbar />
      <ToastContainer />
      <div className="pt-10 px-6 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => {
            const state = cartState[product.id] || {};
            return (
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
                  <span className="text-green-400 font-bold text-xl">₹{product.price}</span>
                  <span className="line-through text-gray-400">₹{product["original price"]}</span>
                  <span className="text-sm text-red-400">
                    ({Math.round(((product["original price"] - product.price) / product["original price"]) * 100)}% OFF)
                  </span>
                </div>

                { state.selectingSize ? (
                  <div className="mt-4 space-x-2 flex justify-center flex-wrap">
                    {["8", "9", "10", "11"].map((size) => (
                      <button
                        key={size}
                        className="bg-green-700 text-white px-3 py-1 rounded-xl hover:bg-green-600 transition"
                        onClick={() => handleSizeSelect(product, size)}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                ) : (
                  <button
                    className="mt-4 w-full bg-green-700 text-white py-2 rounded-xl hover:bg-green-600 transition duration-300"
                    onClick={() => handleAddToCartClick(product.id)}
                  >
                    Add to Cart
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
