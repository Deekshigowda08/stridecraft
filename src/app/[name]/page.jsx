import React from "react";
import { FaShoelace, FaRegCircleUser } from "react-icons/fa6";
import { MdOutlineShoppingCart } from "react-icons/md";

const products = [
  {
    id: 1,
    name: "Running Shoes",
    image: "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/fc4622c4-2769-4665-aa6e-42c974a7705e/AIR+FORCE+1+%2707.png",
    price: 2499,
    originalPrice: 3999,
  },
  {
    id: 2,
    name: "Casual Sneakers",
    image: "https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/8b0d4d2e-d306-4b50-b335-e9c8202144d8/NIKE+DUNK+LOW+SE.png",
    price: 1999,
    originalPrice: 2999,
  },
  {
    id: 3,
    name: "Formal Shoes",
    image: "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco,u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/24750e81-85ed-4b0e-8cd8-becf0cd97b2f/WMNS+AIR+JORDAN+1+MID.png",
    price: 3499,
    originalPrice: 4999,
  },
  {
    id: 4,
    name: "Sport Shoes",
    image: "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco,u_126ab356-44d8-4a06-89b4-fcdcc8df0245,c_scale,fl_relative,w_1.0,h_1.0,fl_layer_apply/c1e356c1-1581-4f2e-a1b2-5274ef23a1ba/WMNS+AIR+JORDAN+1+ELEVATE+LOW.png",
    price: 2999,
    originalPrice: 4299,
  },
  // Add more products as needed
];

const ProductPage = () => {
  return (
    <div className="bg-[#ffeed1] min-h-screen">
      {/* Fixed Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-[#fef5e4] px-6 py-4 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FaShoelace className="text-4xl text-black" />
            <h1 className="text-4xl text-green-800 font-serif font-bold ml-2">
              StrideCraft
            </h1>
          </div>
          <div className="flex items-center">
            <FaRegCircleUser className="text-3xl text-black" />
            <MdOutlineShoppingCart className="text-3xl ml-4 text-black" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-24 px-6 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="border bg-black rounded-2xl shadow-md hover:shadow-xl transition duration-300 p-4"
            >
              <div className="w-full h-60 bg-gray-100 flex items-center justify-center overflow-hidden rounded-xl mb-4">
                <img
                  src={product.image}
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
                  ₹{product.originalPrice}
                </span>
                <span className="text-sm text-red-400">
                  (
                  {Math.round(
                    ((product.originalPrice - product.price) /
                      product.originalPrice) *
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
  );
};

export default ProductPage;
