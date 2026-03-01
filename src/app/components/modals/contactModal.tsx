"use client";

import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { toast } from "react-toastify";

type ContactModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const ContactModal = ({ isOpen, onClose }: ContactModalProps) => {
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    message: string;
  }>({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.message.trim()
    ) {
      toast.warning("Please fill in all fields.");
      return;
    }

    toast.success("Message sent successfully!");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="px-4 fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="bg-background rounded-lg shadow-2xl p-6 w-full max-w-md"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl text-primary font-semibold">Contact Us</h2>

          <button
            className="text-gray-500 hover:text-gray-700 focus:outline-none cursor-pointer"
            onClick={onClose}
            aria-label="Close contact form"
          >
            <IoClose size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            className="border border-primary text-black rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />

          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            className="border border-primary text-black rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />

          <textarea
            name="message"
            placeholder="Your Message"
            value={formData.message}
            onChange={handleChange}
            className="border border-primary text-black rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            rows={4}
          />

          <button
            type="submit"
            className="bg-primary hover:scale-105 cursor-pointer text-white px-4 py-2 rounded-md hover:bg-primary-dark transition"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactModal;
