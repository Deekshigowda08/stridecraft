"use client";
import React, { useState } from "react";
import { FaShoelace, FaRegCircleUser } from "react-icons/fa6";
import { MdOutlineShoppingCart } from "react-icons/md";
import Navbar from "../navbar/page";

export default function CartPage() {
    const [cart, setCart] = useState([
        {
            id: 1,
            image: "https://th.bing.com/th/id/OIP.ZxQM47KwVgtd2WpzealytQHaHa?rs=1&pid=ImgDetMain",
            name: "Running Shoes",
            quantity: 1,
            size: "M",
            price: 120,
        },
        {
            id: 2,
            image: "https://th.bing.com/th/id/OIP.ZxQM47KwVgtd2WpzealytQHaHa?rs=1&pid=ImgDetMain",
            name: "Sneaker Socks",
            quantity: 2,
            size: "L",
            price: 20,
        },
    ]);

    const [address, setAddress] = useState("");

    const handleQuantity = (id, delta) => {
        setCart((prev) =>
            prev.map((item) =>
                item.id === id && item.quantity + delta > 0
                    ? { ...item, quantity: item.quantity + delta }
                    : item
            )
        );
    };

    const handleDelete = (id) => {
        setCart((prev) => prev.filter((item) => item.id !== id));
    };

    const handlePlaceOrder = () => {
        if (!address) return alert("Please enter your address");
        alert("Order placed successfully");
        // You can POST cart and address to your backend here
    };

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <div className="min-h-screen bg-[#fef5e4]">
            {/* Navbar */}
            <Navbar/>

            {/* Cart Section */}
            <div className="max-w-4xl mx-auto p-4 sm:p-6">
                <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 border border-green-800 mb-8">
                    <h2 className="text-2xl font-bold text-green-800 mb-4">Your Cart</h2>
                    {cart.map((item) => (
                        <div
                            key={item.id}
                            className="flex flex-col sm:flex-row items-center sm:items-start sm:justify-between border border-black rounded-xl p-4 mb-4 bg-[#fef5e4] shadow-md"
                        >
                            <div className="w-32 h-32 flex-shrink-0 overflow-hidden rounded-lg mb-4 sm:mb-0">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex-1 sm:ml-4 text-black text-center sm:text-left mb-4 sm:mb-0">
                                <p className="font-bold text-lg">{item.name}</p>
                                <p>Size: {item.size}</p>
                                <p>Price: ₹{item.price}</p>
                            </div>
                            <div className="flex flex-row items-center justify-evenly w-full sm:w-auto">
                                
                            <div className="flex items-center justify-center mt-4 space-x-2 mb-4 sm:mb-0">
                                <button
                                    onClick={() => handleQuantity(item.id, -1)}
                                    className="bg-black text-white px-2 py-1 rounded"
                                >
                                    -
                                </button>
                                <span>{item.quantity}</span>
                                <button
                                    onClick={() => handleQuantity(item.id, 1)}
                                    className="bg-green-800 text-white px-2 py-1 rounded"
                                >
                                    +
                                </button>
                            </div>
                            <button
                                onClick={() => handleDelete(item.id)}
                                className="bg-red-600 text-white md:ml-14 px-4 py-2 rounded"
                            >
                                Delete
                            </button>
                            
                            </div>
                        </div>
                    ))}

                    <div className="mt-6 text-black">
                        <label className="block mb-2 font-semibold">Delivery Address:</label>
                        <textarea
                            className="w-full p-2 border border-black rounded-lg"
                            rows="3"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                        ></textarea>
                    </div>

                    <div className="mt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <p className="text-lg font-bold text-green-800">Total: ₹{total}</p>
                        <button
                            onClick={handlePlaceOrder}
                            className="bg-green-800 text-white px-6 py-2 rounded-lg w-full sm:w-auto"
                        >
                            Place Order
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

