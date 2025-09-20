"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { IoClose } from "react-icons/io5";
import { IoMdMenu } from "react-icons/io";

const Navbar = () => {
  const navItems = [
    { name: "Home", link: "/" },
    { name: "Generate Story", link: "#generate-story" },
    { name: "About Us", link: "#about-us" },
  ];

  const [menuOpen, setMenuOpen] = useState(false);
  const [height, setHeight] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (menuRef.current) {
      setHeight(menuRef.current.scrollHeight);
    }
  }, [menuOpen]);

  return (
    <nav className="relative w-full h-18 shadow-lg flex items-center bg-background lg:px-12 px-4">
      <div className="flex items-center mr-auto">
        <Image src="/Logo.png" alt="Logo" width={50} height={50} priority />
        <span className="max-sm:hidden font-medium text-3xl bg-clip-text text-transparent bg-[linear-gradient(90deg,#6122C0_0%,#7846C2_12.98%,#7B49C6_25.48%,#8D77D7_49.52%,#7B49C6_77.4%,#7846C2_89.9%,#6122C0_100%)]">
          KahaaniBot
        </span>
      </div>

      <button
        className="lg:hidden p-2 focus:outline-none rounded-sm hover:bg-text-secondary transition-colors"
        type="button"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label={menuOpen ? "Close menu" : "Open menu"}
      >
        {menuOpen ? (
          <IoClose className="h-6 w-6 text-text-secondary" />
        ) : (
          <IoMdMenu className="h-6 w-6 text-text-secondary" />
        )}
      </button>

      <div className="hidden lg:block">
        <div className="flex font-medium items-center gap-8 text-secondary">
          {navItems.map((item) => (
            <Link key={item.name} href={item.link} className="text-lg">
              {item.name}
            </Link>
          ))}

          <button className="px-3 font-medium py-1 border border-secondary hover:bg-secondary hover:text-white rounded-full transition cursor-pointer">
            Get Started
          </button>
        </div>
      </div>

      {/* Dropdown with transition */}
      <div
        className={`lg:hidden absolute top-full right-0 z-10 w-full overflow-hidden transition-all duration-300 ease-in-out shadow-lg border-t border-text-secondary bg-background`}
        style={{
          maxHeight: menuOpen ? `${height}px` : "0px",
          opacity: menuOpen ? 1 : 0,
        }}
      >
        <div ref={menuRef}>
          <ul className="flex flex-col font-medium">
            {navItems.map((item, index) => (
              <li key={index} className="border-b border-secondary px-4">
                <Link
                  href={item.link}
                  className="block py-2"
                  onClick={() => setMenuOpen(false)}
                >
                  {item.name}
                </Link>
              </li>
            ))}
            <button className="px-4 text-left text-background bg-secondary font-medium py-2 transition cursor-pointer">
              Get Started
            </button>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
