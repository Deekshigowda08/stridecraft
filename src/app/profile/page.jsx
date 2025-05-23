"use client";
import React, { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import Navbar from "../navbar/page";
import { db } from "../api/auth";
import { doc, getDoc, deleteDoc, updateDoc, arrayRemove } from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import emailjs from 'emailjs-com';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [orders, setorders] = useState([]);
  const [isloading, setisloading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = window.localStorage.getItem("useruid");
      if (!userId) {
        window.location.assign("https://stridecraft.vercel.app/loginandsingin");
      } else {
        try {
          const userDocRef = doc(db, "users", userId);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            setUser(userData);
            setorders(userData.orders || []);
          } else {
            console.log("No such document!");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      setisloading(true);

      const response = await fetch("/api/updateProfile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });

      if (response.ok) {
        toast.success("Profile updated successfully");
        setIsEditing(false);
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setisloading(false);
    }
  };

  const handleCancelOrder = async (orderToCancel) => {
    const confirmCancel = window.confirm("Are you sure you want to cancel this order?");
    if (!confirmCancel) return;

    try {
      const userId = window.localStorage.getItem("useruid");
      // Remove from user's orders array
      const userDocRef = doc(db, "users", userId);
      await updateDoc(userDocRef, {
        orders: arrayRemove(orderToCancel),
      });

      const emailParams = {
      to_name: user.name,
      to_email: user.email,
      message: `Hi ${user.name}, your order had been cancelled successfully!`,
      order_details: orderToCancel.cart.map(item => item.name).join(", "),
      address: user.address,
    };

    await emailjs.send(
      'service_o4g2msu',   
      'template_4fprgkb',   
      emailParams,
      'uteOLn79vEZztaE0K'     
    );
      setorders(prev => prev.filter(order => order.id !== orderToCancel.id));
      toast.success("Order cancelled successfully");
    } catch (error) {
      toast.error("Failed to cancel order");
      console.error("Cancel error:", error);
    }
  };

  if (!user) {
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
    <div className="min-h-screen bg-[#fef5e4]">
      <Navbar />
      <ToastContainer />
      <div className="max-w-4xl mx-auto p-6">
        {/* Profile Info */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-green-800 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-green-800">Profile Information</h2>
            <button onClick={() => setIsEditing(!isEditing)}>
              <FaEdit className="text-black text-xl" />
            </button>
          </div>
          <div className="space-y-4 text-black">
            <div>
              <label className="font-semibold block mb-1">Name:</label>
              <input
                type="text"
                name="name"
                value={user.name || ""}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full p-2 border border-black rounded-lg disabled:bg-gray-100"
              />
            </div>
            <div>
              <label className="font-semibold block mb-1">Email:</label>
              <input
                type="email"
                name="email"
                value={user.email}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full p-2 border border-black rounded-lg disabled:bg-gray-100"
              />
            </div>
            <div>
              <label className="font-semibold block mb-1">Phone:</label>
              <input
                type="text"
                name="phone"
                value={user.phone}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full p-2 border border-black rounded-lg disabled:bg-gray-100"
              />
            </div>
            <div>
              <label className="font-semibold block mb-1">Address:</label>
              <input
                type="text"
                name="address"
                value={user.address}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full p-2 border border-black rounded-lg disabled:bg-gray-100"
              />
            </div>

            {isEditing && (
              <button
                onClick={handleSubmit}
                disabled={isloading}
                className="bg-green-800 text-white px-4 py-2 rounded-lg mt-2"
              >
                {isloading ? "Saving..." : "Save Changes"}
              </button>
            )}
          </div>
        </div>

        {/* Orders Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-green-800">
          <h2 className="text-2xl font-bold text-green-800 mb-4">Order Details</h2>
          <div className="space-y-4">
            {orders.length === 0 && (
              <p className="text-sm text-gray-600">No orders found.</p>
            )}
            {orders.map((order) => (
              <div
                key={order.id}
                className="border border-black rounded-xl p-4 flex justify-between items-center bg-[#fef5e4] shadow-md"
              >
                <div>
                  <p className="text-xs font-semibold text-black">
                    {order.cart.map(item => item.name).join(", ")}
                  </p>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <span
                    className={`text-sm font-medium px-3 py-1 rounded-full ${order.status === "Delivered"
                      ? "bg-green-800 text-white"
                      : "bg-black text-white"
                      }`}
                  >
                    {order.status}
                  </span>
                  {order.status === "Pending" && (
                    <button
                      onClick={() => handleCancelOrder(order)}
                      className="bg-red-600 text-white text-xs px-3 py-1 rounded-full hover:bg-red-700"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
