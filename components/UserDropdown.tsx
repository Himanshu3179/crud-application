"use client";

import { useEffect, useRef, useState } from "react";
import { User } from "lucide-react";
import { signOut } from "next-auth/react";

export default function UserDropdown({ name }: { name: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="absolute top-7 right-8" ref={dropdownRef}>
      {/* ✅ User Name Button */}
      <button
        onClick={toggleDropdown}
        className="flex items-center px-4 py-4 rounded-full bg-[#2d2d2d] text-white transition"
      >
        <User className="h-6 w-6" />
      </button>

      {/* ✅ Dropdown Content */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-[#2d2d2d] border border-gray-600 rounded-md shadow-lg">
          <p className="px-4 py-2 text-white text-sm">Hello, {name}</p>
          <button
            className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 transition"
            onClick={() => signOut()}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
