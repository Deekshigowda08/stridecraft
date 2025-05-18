"use client"
import React from 'react'
import { FaShoelace, FaRegCircleUser } from "react-icons/fa6";
import { MdOutlineShoppingCart } from "react-icons/md";

export default function Navbar() {
  return (
    <div className="sticky top-0 bg-[#fef5e4] w-full z-50 px-4 py-2 shadow-md">
                <div className="flex flex-row items-center justify-between gap-2 mb-4">
                    <button onClick={()=>{
window.location.assign("https://stridecraft.vercel.app/")
                    }} className="flex items-center justify-center">
                        <FaShoelace className="text-4xl text-black" />
                        <h1 className="text-3xl sm:text-4xl text-green-800 font-serif font-bold ml-2">
                            StrideCraft
                        </h1>
                    </button>
                    <div className="flex items-center justify-center mt-2 sm:mt-0">
                        <button onClick={()=>{window.location.assign("https://stridecraft.vercel.app/profile")}}><FaRegCircleUser className="text-3xl text-black" /></button>
                        <button onClick={()=>{window.location.assign("https://stridecraft.vercel.app/cart")}}><MdOutlineShoppingCart className="text-3xl ml-4 text-black" /></button>
                    </div>
                </div>
            </div>
  )
}
