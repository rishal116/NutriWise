
"use client";

import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageCircle,
  Clock,
  Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface ContactInfo {
  id: string;
  icon: LucideIcon;
  title: string;
  details: string;
  subtext: string;
  gradient: string;
  href?: string;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

const initialFormData: ContactFormData = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

const contactInfo: ContactInfo[] = [
  {
    id: "email",
    icon: Mail,
    title: "Email Us",
    details: "support@nutriwise.com",
    subtext: "We'll respond within 24 hours",
    gradient: "from-emerald-500 to-teal-600",
    href: "mailto:support@nutriwise.com",
  },
  {
    id: "phone",
    icon: Phone,
    title: "Call Us",
    details: "+1 (555) 123-4567",
    subtext: "Mon-Fri, 9AM-6PM EST",
    gradient: "from-teal-500 to-cyan-600",
    href: "tel:+15551234567",
  },
  {
    id: "address",
    icon: MapPin,
    title: "Visit Us",
    details: "123 Wellness Ave, Suite 100",
    subtext: "San Francisco, CA 94102",
    gradient: "from-emerald-600 to-teal-700",
  },
];

const faqs: FAQ[] = [
  {
    id: "response-time",
    question: "How quickly will I get a response?",
    answer:
      "We typically respond to all inquiries within 24 hours during business days.",
  },
  {
    id: "schedule-call",
    question: "Can I schedule a call with your team?",
    answer:
      "Yes! You can schedule a call through our contact form or by calling our support line.",
  },
  {
    id: "languages",
    question: "Do you offer support in multiple languages?",
    answer:
      "Currently, we offer support in English, Spanish, and French.",
  },
];

export default function ContactPage() {
  const [formData, setFormData] =
    useState<ContactFormData>(initialFormData);

  const handleChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ): void => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    // Replace this placeholder with your contact form API integration.
    console.log("Form submitted:", formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-20 sm:py-24">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute left-0 top-0 h-96 w-96 rounded-full bg-emerald-400 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-teal-400 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/60 px-4 py-2 backdrop-blur-sm">
            <Sparkles className="h-4 w-4 text-emerald-600" />

            <span className="text-sm font-semibold text-emerald-700">
              Get In Touch
            </span>
          </div>

          <h1 className="mb-6 text-4xl font-bold text-gray-900 sm:text-5xl lg:text-6xl">
            We&apos;d Love to{" "}
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
              Hear From You
            </span>
          </h1>

          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-gray-600 sm:text-xl">
            Have questions, feedback, or need support? Our team is here to
            help you on your wellness journey.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {contactInfo.map((info) => {
              const Icon = info.icon;

              return (
                <div
                  key={info.id}
                  className="group rounded-2xl bg-white p-6 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl lg:p-8"
                >
                  <div
                    className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${info.gradient} shadow-md transition-transform group-hover:scale-110`}
                  >
                    <Icon className="h-7 w-7 text-white" />
                  </div>

                  <h3 className="mb-2 text-xl font-bold text-gray-900">
                    {info.title}
                  </h3>

                  {info.href ? (
                    <a
                      href={info.href}
                      className="mb-1 inline-block font-semibold text-emerald-600 hover:text-emerald-700 hover:underline"
                    >
                      {info.details}
                    </a>
                  ) : (
                    <p className="mb-1 font-semibold text-emerald-600">
                      {info.details}
                    </p>
                  )}

                  <p className="text-sm text-gray-500">{info.subtext}</p>
                </div>
              );
            })}
          </div>

          {/* Contact Form & FAQ */}
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Contact Form */}
            <div className="rounded-3xl bg-white p-8 shadow-xl lg:p-10">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600">
                  <MessageCircle className="h-6 w-6 text-white" />
                </div>

                <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                  Send us a Message
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Full Name
                  </label>

                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    autoComplete="name"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-emerald-500"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Email Address
                  </label>

                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    autoComplete="email"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-emerald-500"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Subject
                  </label>

                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="">Select a topic</option>
                    <option value="general">General Inquiry</option>
                    <option value="support">Technical Support</option>
                    <option value="billing">Billing Question</option>
                    <option value="partnership">
                      Partnership Opportunity
                    </option>
                    <option value="feedback">Feedback</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="mb-2 block text-sm font-semibold text-gray-700"
                  >
                    Message
                  </label>

                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-emerald-500"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 py-4 font-semibold text-white shadow-lg transition-all hover:scale-105 hover:from-emerald-600 hover:to-teal-700 hover:shadow-xl"
                >
                  <Send className="h-5 w-5" />
                  Send Message
                </button>
              </form>
            </div>

            {/* FAQ Section */}
            <div>
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600">
                  <Clock className="h-6 w-6 text-white" />
                </div>

                <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                  Quick Answers
                </h2>
              </div>

              <div className="space-y-4">
                {faqs.map((faq) => (
                  <div
                    key={faq.id}
                    className="rounded-2xl bg-white p-6 shadow-md transition-shadow hover:shadow-lg"
                  >
                    <h3 className="mb-2 text-lg font-bold text-gray-900">
                      {faq.question}
                    </h3>

                    <p className="leading-relaxed text-gray-600">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>

              {/* Business Hours */}
              <div className="mt-8 rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-teal-50 p-6">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900">
                  <Clock className="h-5 w-5 text-emerald-600" />
                  Business Hours
                </h3>

                <div className="space-y-2 text-gray-700">
                  <div className="flex justify-between gap-4">
                    <span className="font-medium">Monday - Friday</span>
                    <span>9:00 AM - 6:00 PM EST</span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="font-medium">Saturday</span>
                    <span>10:00 AM - 4:00 PM EST</span>
                  </div>

                  <div className="flex justify-between gap-4">
                    <span className="font-medium">Sunday</span>
                    <span className="text-gray-500">Closed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
