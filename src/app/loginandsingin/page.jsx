"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FcGoogle } from "react-icons/fc";
import Navbar from "../navbar/page";
  import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { signUpUser, loginUser, signInWithGoogle} from "../api/auth" 

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
    toast.info("Please fill in both email and password.");
      return;
    }

    try {
      if (isLogin) {
        let data=await loginUser(email, password);
        if (!data) {
          toast.error("Invalid email or password");
          setIsLogin(false);
          return;
        }
        window.location.assign("https://stridecraft.vercel.app/profile");
      } else {
        let data=await signUpUser(email, password);
        if (!data) {
          toast.error("Email already exists");
          setIsLogin(true);
          return;
        }
        window.location.assign("https://stridecraft.vercel.app/profile");
      }

      // You can redirect here if needed
    } catch (error) {
      toast.error("Authentication failed: " + error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      toast.done("Google sign-in successful!");
      // Redirect or navigate after login
    } catch (error) {
      toast.done("Google sign-in failed: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#fef5e4]">
      {/* Navbar */}
      <Navbar />
      <ToastContainer />

      {/* Auth Form */}
      <div className="flex items-center justify-center py-12">
        <div className="w-full md:max-w-md h-full md:bg-white md:py-8 md:px-8 py-24 px-8 md:rounded-2xl md:shadow-xl md:border md:border-green-800">
          <h2 className="md:text-3xl text-6xl font-bold md:mb-6 mb-16 text-center text-green-800">
            {isLogin ? "Login" : "Sign Up"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-black"
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-black"
            />
            <Button type="submit" className="w-full bg-green-800 hover:bg-black text-white">
              {isLogin ? "Login" : "Sign Up"}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <Button
              variant="outline"
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-2 border-black"
            >
              <FcGoogle className="text-xl" /> Continue with Google
            </Button>
          </div>

          <p className="mt-6 text-center text-sm">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <span
              className="text-green-800 font-semibold cursor-pointer hover:underline"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Sign Up" : "Login"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
