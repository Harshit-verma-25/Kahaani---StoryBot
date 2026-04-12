"use client";

import { useEffect, useRef, useState } from "react";
import { IoChevronDown } from "react-icons/io5";

type SelectOption<T extends string> = {
  value: T;
  label: string;
};

type CustomSelectProps<T extends string> = {
  id?: string;
  name?: string;
  value: T | "" | null;
  options: SelectOption<T>[];
  onChange: (value: T) => void;
  placeholder?: string;
  className?: string; // injected into the wrapper div
  buttonClassName?: string; // injected into the button
};

const CustomSelect = <T extends string>({
  id,
  name,
  value,
  options,
  onChange,
  placeholder = "Select an option",
  className = "",
  buttonClassName = "",
}: CustomSelectProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const selectedLabel = options.find((option) => option.value === value)?.label;

  return (
    <div className={`relative ${className}`.trim()} ref={selectRef}>
      <button
        type="button"
        id={id}
        name={name}
        className={`outline-none text-black w-full text-left flex items-center justify-between ${
          buttonClassName ||
          "p-2 border border-primary rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition"
        }`}
        onClick={() => setIsOpen((prevState) => !prevState)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span>{selectedLabel ?? placeholder}</span>
        <IoChevronDown className={`transition ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute mt-2 w-full bg-background border border-primary rounded-xl shadow-lg z-20 overflow-hidden">
          <div className="max-h-40 overflow-y-auto scrollbar-brand">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 transition hover:bg-primary/10 ${
                  value === option.value
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-secondary"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
