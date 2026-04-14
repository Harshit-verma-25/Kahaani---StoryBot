"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import CustomSelect from "../components/forms/customSelect";
import { MdOutlineFileUpload } from "react-icons/md";
import { ContactFormData, JoinOurTeamFormData } from "../lib/types/types";

const ENQUIRY_OPTIONS = [
  { value: "general", label: "General Enquiry" },
  { value: "partnerships", label: "Partnerships" },
  { value: "support", label: "Support" },
  { value: "feedback", label: "Feedback" },
] as const;

const ROLE_OPTIONS = [
  { value: "Frontend Developer", label: "Frontend Developer" },
  { value: "Backend Developer", label: "Backend Developer" },
  { value: "UI/UX Designer", label: "UI/UX Designer" },
  { value: "Content Writer", label: "Content Writer" },
  { value: "Marketing Intern", label: "Marketing Intern" },
] as const;

const ContactUsPage = () => {
  const [contactFormData, setContactFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    enquiry: "general",
    message: "",
  });

  const [joinTeamFormData, setJoinTeamFormData] = useState<JoinOurTeamFormData>(
    {
      name: "",
      email: "",
      phone: "",
      role: "",
      resume: null,
    },
  );

  const [isSubmittingContact, setIsSubmittingContact] = useState(false);
  const [isSubmittingJoinTeam, setIsSubmittingJoinTeam] = useState(false);

  const handleContactChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setContactFormData({ ...contactFormData, [e.target.name]: e.target.value });
  };

  const handleJoinTeamChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const target = e.target;
    if (target.name === "resume" && "files" in target && target.files) {
      setJoinTeamFormData({ ...joinTeamFormData, resume: target.files[0] });
    } else {
      setJoinTeamFormData({ ...joinTeamFormData, [target.name]: target.value });
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (Object.values(contactFormData).some((value) => !value)) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      setIsSubmittingContact(true);

      await axios.post("/api/contact", contactFormData);
      toast.success("Contact form submitted successfully!");
      setContactFormData({
        name: "",
        email: "",
        phone: "",
        enquiry: "general",
        message: "",
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit contact form.");
    } finally {
      setIsSubmittingContact(false);
    }
  };

  const handleJoinTeamSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (Object.values(joinTeamFormData).some((value) => !value)) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      setIsSubmittingJoinTeam(true);

      const formData = new FormData();
      formData.append("name", joinTeamFormData.name);
      formData.append("email", joinTeamFormData.email);
      formData.append("phone", joinTeamFormData.phone);
      formData.append("role", joinTeamFormData.role);
      if (joinTeamFormData.resume) {
        formData.append("resume", joinTeamFormData.resume);
      }

      await axios.post("/api/applications", formData);
      toast.success("Application submitted successfully!");
      setJoinTeamFormData({
        name: "",
        email: "",
        phone: "",
        role: "",
        resume: null,
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit application.");
    } finally {
      setIsSubmittingJoinTeam(false);
    }
  };

  return (
    <section className="min-h-screen bg-background flex items-center justify-center pt-8">
      <div className="max-w-7xl w-full mx-auto flex flex-col items-center justify-center px-4 gap-6 md:pb-28 pb-10">
        <div className="text-center">
          <h1 className="text-3xl sm:text-[40px] text-primary font-medium">
            Connect with KahaaniBot Team
          </h1>
          <p className="text-secondary/70 text-center font-normal">
            Connect with our team for partnerships, support, suggestions,
            <br /> or to build something meaningful together.
          </p>
        </div>

        {/* Contact Form */}
        <div
          className="bg-background p-8 w-full border-primary border"
          onClick={(event) => event.stopPropagation()}
        >
          <h2 className="text-2xl text-primary font-semibold">
            Send Us a Message
          </h2>
          <p className="text-secondary/70 uppercase font-normal mb-8 text-[1rem]">
            right SUPPORT based on your QUERY.
          </p>

          <form className="flex flex-col gap-4" onSubmit={handleContactSubmit}>
            <div className="grid grid-cols-2 gap-8">
              {[
                {
                  label: "Full Name",
                  name: "name",
                  placeholder: "Your Name",
                  type: "text",
                },
                {
                  label: "Email Address",
                  name: "email",
                  placeholder: "Your Email",
                  type: "email",
                },
                {
                  label: "Phone Number",
                  name: "phone",
                  placeholder: "+91",
                  type: "tel",
                },
                {
                  label: "How can we help you?",
                  name: "enquiry",
                  placeholder: "Your Inquiry",
                  type: "select",
                },
              ].map((field) => (
                <div className="flex flex-col gap-2" key={field.name}>
                  <label
                    htmlFor={field.name}
                    className="font-medium uppercase text-secondary/70"
                  >
                    {field.label}
                  </label>
                  {field.type !== "select" ? (
                    <input
                      type={field.type}
                      name={field.name}
                      placeholder={field.placeholder}
                      value={
                        contactFormData[field.name as keyof ContactFormData]
                      }
                      onChange={handleContactChange}
                      className="border-b border-primary text-black focus:outline-none focus:border-b-2 focus:border-primary"
                    />
                  ) : (
                    <CustomSelect
                      name={field.name}
                      options={[...ENQUIRY_OPTIONS]}
                      value={
                        contactFormData[field.name as keyof ContactFormData]
                      }
                      onChange={(val) =>
                        setContactFormData({
                          ...contactFormData,
                          [field.name]: val,
                        })
                      }
                      placeholder={field.placeholder}
                      className="w-full"
                      buttonClassName="border-b border-primary text-black focus:outline-none focus:border-b-2 focus:border-primary"
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-2 mt-4">
              <label
                htmlFor="message"
                className="font-medium uppercase text-secondary/70"
              >
                Details of your request
              </label>
              <textarea
                name="message"
                placeholder="Write your message here—we'll get back to you soon."
                value={contactFormData.message}
                onChange={handleContactChange}
                className="border-b border-primary text-black focus:outline-none focus:border-b-2 focus:border-primary resize-none"
                rows={4}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmittingContact}
              className="w-fit mt-4 bg-primary hover:scale-105 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md hover:bg-primary-dark transition"
            >
              {isSubmittingContact ? "Submitting..." : "Submit Enquiry"}
            </button>
          </form>
        </div>

        {/* Join our team */}
        <div
          className="bg-background p-8 w-full border-primary border mt-8"
          onClick={(event) => event.stopPropagation()}
        >
          <h2 className="text-2xl text-primary font-semibold">
            Join Our Team at KahaaniBot
          </h2>
          <p className="text-secondary/70 uppercase font-normal mb-8 text-[1rem]">
            Build the future of storytelling.
          </p>

          <form className="flex flex-col gap-4" onSubmit={handleJoinTeamSubmit}>
            <div className="grid grid-cols-2 gap-8">
              {[
                {
                  label: "Full Name",
                  name: "name",
                  placeholder: "Your Name",
                  type: "text",
                },
                {
                  label: "Email Address",
                  name: "email",
                  placeholder: "Your Email",
                  type: "email",
                },
                {
                  label: "Phone Number",
                  name: "phone",
                  placeholder: "+91",
                  type: "tel",
                },
                {
                  label: "Position Applying For",
                  name: "role",
                  placeholder: "Select Role",
                  type: "select",
                },
              ].map((field) => (
                <div className="flex flex-col gap-2" key={field.name}>
                  <label
                    htmlFor={field.name}
                    className="font-medium uppercase text-secondary/70"
                  >
                    {field.label}
                  </label>
                  {field.type !== "select" ? (
                    <input
                      type={field.type}
                      name={field.name}
                      placeholder={field.placeholder}
                      value={
                        joinTeamFormData[
                          field.name as keyof JoinOurTeamFormData
                        ] as string
                      }
                      onChange={handleJoinTeamChange}
                      className="border-b border-primary text-black focus:outline-none focus:border-b-2 focus:border-primary"
                    />
                  ) : (
                    <CustomSelect
                      name={field.name}
                      options={[...ROLE_OPTIONS]}
                      value={
                        joinTeamFormData[
                          field.name as keyof JoinOurTeamFormData
                        ] as string
                      }
                      onChange={(val) =>
                        setJoinTeamFormData({
                          ...joinTeamFormData,
                          [field.name]: val,
                        })
                      }
                      placeholder={field.placeholder}
                      className="w-full"
                      buttonClassName="border-b border-primary text-black focus:outline-none focus:border-b-2 focus:border-primary"
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-2 mt-4">
              <label
                htmlFor="resume"
                className="font-medium uppercase text-secondary/70"
              >
                upload resume
              </label>

              <div className="relative">
                <input
                  type="file"
                  id="resume"
                  name="resume"
                  accept=".pdf,.doc,.docx"
                  onChange={handleJoinTeamChange}
                  className="hidden"
                />
                <label
                  htmlFor="resume"
                  className="border-b border-primary text-secondary/70 focus:outline-none flex items-center gap-1 w-full cursor-pointer"
                >
                  <MdOutlineFileUpload />
                  {joinTeamFormData.resume
                    ? joinTeamFormData.resume.name
                    : "Browse file"}
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmittingJoinTeam}
              className="w-fit mt-4 bg-primary hover:scale-105 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md hover:bg-primary-dark transition"
            >
              {isSubmittingJoinTeam ? "Submitting..." : "Submit Application"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactUsPage;
