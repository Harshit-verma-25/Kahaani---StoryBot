"use client";

import { FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleSubscribe = async () => {
    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }

    if (!email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setIsSubscribing(true);
    toast.info("Subscribing...");

    try {
      const response = await axios.post("/api/subscribe", { email });

      if (response.status === 200) {
        toast.success(
          "Subscription successful! Check your email for a welcome message."
        );
        setEmail("");
      }
    } catch (error) {
      console.error("Subscription error:", error);
      toast.error("Subscription failed. Please try again later.");
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <footer className="w-full bg-primary text-white lg:p-16 sm:p-10 p-4 bg-[url('/footer-pattern.png')] bg-cover bg-center">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
        {/* Left Section */}
        <div className="flex flex-col items-center md:items-start gap-6 text-center md:text-left">
          <h2 className="font-medium text-3xl">KahaaniBot</h2>

          <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 md:gap-6">
            {[
              { name: "Home", href: "/" },
              { name: "About Us", href: "/about-us" },
              { name: "Join Our Team", href: "#" },
            ].map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="hover:text-secondary"
              >
                {item.name}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4 md:gap-3 justify-center md:justify-start">
            {["FaInstagram", "FaLinkedin", "FaYoutube"].map((item) => (
              <div key={item} className="hover:text-secondary cursor-pointer">
                {item === "FaInstagram" && <FaInstagram size={24} />}
                {item === "FaLinkedin" && <FaLinkedin size={24} />}
                {item === "FaYoutube" && <FaYoutube size={24} />}
              </div>
            ))}
          </div>
        </div>

        {/* Right Section */}
        <div className="flex flex-col items-center md:items-start gap-6 text-center md:text-left">
          <p className="text-2xl max-w-xl">
            Never miss a moment of storytelling magic.
          </p>

          <div className="w-full max-w-xl flex flex-col sm:flex-row justify-center md:justify-start gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-full outline-none border border-white text-white placeholder:text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              className="px-6 cursor-pointer py-2 bg-white text-primary rounded-full hover:bg-white/80 transition"
              onClick={handleSubscribe}
              disabled={isSubscribing}
            >
              {isSubscribing ? "Sending..." : "Subscribe"}
            </button>
          </div>

          <span className="text-white/60 text-sm max-w-xl">
            By subscribing you agree with our Privacy Policy and provide consent
            to receive updates from our company.
          </span>
        </div>

        {/* Bottom Row */}
        <div className="col-span-1 md:col-span-2 flex flex-col md:flex-row items-center md:justify-between border-t-2 border-t-white pt-6 gap-4 md:gap-0 text-center md:text-left">
          <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 md:gap-6">
            {[
              { name: "Privacy Policy", href: "#" },
              { name: "Terms of Service", href: "#" },
              { name: "Contact Us", href: "#" },
            ].map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="underline hover:text-secondary"
              >
                {link.name}
              </a>
            ))}
          </div>
          <p>© {new Date().getFullYear()} KahaaniBot. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
