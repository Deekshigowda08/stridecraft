"use client";
import React, { useEffect, useState, useRef } from "react";
import { db } from "../api/auth";
import { doc, updateDoc, getDoc, collection, addDoc, arrayUnion } from "firebase/firestore";
import Navbar from "../navbar/page";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import emailjs from 'emailjs-com';

export default function CartPage() {
    const [cart, setCart] = useState([]);
    const [address, setAddress] = useState("");
    const timeoutRef = useRef(null);
    const [data, setdata] = useState({});
    const userId = typeof window !== "undefined" ? window.localStorage.getItem("useruid") : null;
    const [loading, setLoading] = useState(true);
    const [isloading, setisloading] = useState(false);


    useEffect(() => {
        const fetchUserData = async () => {
            if (!userId) {
                window.location.assign("https://stridecraft.vercel.app/loginandsingin");
                return;
            }

            try {
                const userDocRef = doc(db, "users", userId);
                const userDocSnap = await getDoc(userDocRef);

                if (userDocSnap.exists()) {
                    const data = userDocSnap.data();
                    setCart(data.cart || []);
                    setAddress(data.address || "");
                    setdata(data);
                } else {
                    console.log("No such document!");
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUserData();
        setTimeout(() => {
            setLoading(false)
        }, 1000);

    }, []);

    const syncCartToDatabase = async (updatedCart) => {
        if (!userId) return;
        const userDocRef = doc(db, "users", userId);
        await updateDoc(userDocRef, { cart: updatedCart });
    };

    const handleQuantity = (id, delta) => {
        setCart((prevCart) => {
            const updatedCart = prevCart.map((item) =>
                item.id === id && parseInt(item.item) + delta > 0
                    ? { ...item, item: parseInt(item.item) + delta }
                    : item
            );
            clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => syncCartToDatabase(updatedCart), 200);
            return updatedCart;
        });
    };

    const handleDelete = (id) => {
        const updatedCart = cart.filter((item) => item.id !== id);
        setCart(updatedCart);
        syncCartToDatabase(updatedCart);
    };


const handlePlaceOrder = async () => {
  setisloading(true);

  if (!(address && data.phone && data.name)) {
    toast.info("Please fill in all the details", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      style: {
        backgroundColor: "#f87171",
        color: "#016630",
        fontWeight: "bold"
      }
    });
    window.location.assign("https://stridecraft.vercel.app/profile");
    return;
  }

  const cost = cart.reduce((sum, item) => sum + parseInt(item.price) * parseInt(item.item), 0);
  if (cart.length === 0) {
    setisloading(false);
    return toast.info("Your cart is empty");
  }

  if (cost <= 10000) {
    setisloading(false);
    return toast.info("Please add more items to your cart, minimum order value is ₹10,000");
  }

  toast.success("Order placed successfully");
  setisloading(false);

  const orderData = {
    uid: userId,
    id: Date.now().toString(), // Use string for compatibility
    cart,
    address,
    phone: data.phone,
    name: data.name,
    total: cost,
    status: "Pending",
    placedAt: new Date().toISOString(),
  };

  try {
    // 1. Save to Firestore
    await addDoc(collection(db, "Orders"), orderData);

    const userDocRef = doc(db, "users", userId);
    const userSnap = await getDoc(userDocRef);
    const userData = userSnap.exists() ? userSnap.data() : {};
    const existingOrders = userData.orders || [];
    const updatedOrders = [...existingOrders, orderData];

    await updateDoc(userDocRef, {
      cart: [],
      orders: updatedOrders,
    });

    // 2. Send Email via EmailJS
    const emailParams = {
      to_name: data.name,
      to_email: userData.email,
      message: `Hi ${data.name}, your order totaling ₹${cost} has been placed successfully!`,
      order_details: cart.map(item => `${item.name} (x${item.item}) - ₹${item.price * item.item}`).join('\n'),
      address: address,
    };

    await emailjs.send(
      'service_o4g2msu',   
      'template_4fprgkb',   
      emailParams,
      'uteOLn79vEZztaE0K'     
    );

    toast.success("Confirmation email sent!");
    setCart([]);

  } catch (error) {
    console.error("Order placement error:", error);
    toast.error("Something went wrong. Please try again.");
  }
};



    const total = cart.reduce((sum, item) => sum + parseInt(item.price) * parseInt(item.item), 0);
    if (loading) {
        return (
            <div className="bg-[#fef5e4] min-h-screen flex items-center justify-center">

                <div className="flex flex-col items-center space-y-4">
                    <div className="w-16 h-16 border-4 border-green-800 border-dashed rounded-full animate-spin"></div>
                    <p className="text-xl font-semibold text-green-800">Loading...</p>
                </div>
            </div>

        )
    } else {

        return (
            <div className="min-h-screen bg-[#fef5e4]">
                <Navbar />
                <div className="max-w-4xl mx-auto p-4 sm:p-6">
                    <ToastContainer />
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-green-800 mb-8">
                        <h2 className="text-2xl font-bold text-green-800 mb-4">Your Cart</h2>
                        {cart.map((item) => (
                            <div
                                key={item.addedAt}
                                className="flex flex-col sm:flex-row items-center sm:items-start sm:justify-between border border-black rounded-xl p-6 mb-6 bg-[#fffdf7] shadow-lg"
                            >
                                <div className="w-70 h-40 md:w-80 md:h-50 overflow-hidden rounded-lg shadow-md mb-4 sm:mb-0">
                                    <img
                                        src={item.imageUrl}
                                        alt={item.name}
                                        className="w-full p-1 h-full object-fill rounded-lg"
                                    />
                                </div>
                                <div className="flex-1 sm:ml-6 text-black text-center sm:text-left mb-4 sm:mb-0">
                                    <p className="font-bold text-xl mb-1">{item.name}</p>
                                    <p className="mb-1">Size: <span className="font-medium">{item.size}</span></p>
                                    <p className="mb-2">Price: ₹{item.price}</p>
                                    <div className="flex items-center justify-center sm:justify-start space-x-2 mt-2">
                                        <button
                                            onClick={() => handleQuantity(item.id, -1)}
                                            className="bg-black text-white px-3 py-1 rounded text-lg"
                                        >
                                            −
                                        </button>
                                        <span className="text-lg">{item.item}</span>
                                        <button
                                            onClick={() => handleQuantity(item.id, 1)}
                                            className="bg-green-800 text-white px-3 py-1 rounded text-lg"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDelete(item.id)}
                                    className="bg-red-600 text-white px-5 py-2 rounded shadow-md mt-4 sm:mt-0"
                                >
                                    Delete
                                </button>
                            </div>
                        ))}

                        <div className="mt-6 text-black">
                            <label className="block mb-2 font-semibold">Delivery Address:</label>
                            <textarea
                                className="w-full p-3 border border-black rounded-lg"
                                rows="3"
                                value={address}
                                disabled={true}
                            ></textarea>
                        </div>

                        <div className="mt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <p className="text-xl font-bold text-green-800">Total: ₹{total}</p>
                            <button
                                onClick={handlePlaceOrder}
                                disabled={isloading}
                                className="bg-green-800 text-white px-6 py-3 rounded-lg w-full sm:w-auto"
                            >
                                Place Order
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
