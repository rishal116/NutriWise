"use client";

import React from "react";
import { FileText, Shield, AlertCircle, Sparkles } from "lucide-react";

export default function TermsPage() {
  const lastUpdated = "January 15, 2024";

  const sections = [
    {
      title: "1. Acceptance of Terms",
      content: `By accessing and using NutriWise ("the Service"), you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these terms, please do not use our Service.`
    },
    {
      title: "2. Description of Service",
      content: `NutriWise provides a comprehensive wellness platform that includes nutrition guidance, diet planning, expert consultations, community features, and wellness challenges. The Service is designed to support your health and wellness goals through personalized recommendations and professional guidance.`
    },
    {
      title: "3. User Accounts",
      content: `To access certain features of the Service, you must create an account. You are responsible for:
      
• Maintaining the confidentiality of your account credentials
• All activities that occur under your account
• Notifying us immediately of any unauthorized use
• Providing accurate and complete information during registration

We reserve the right to suspend or terminate accounts that violate these terms or are inactive for extended periods.`
    },
    {
      title: "4. User Conduct",
      content: `You agree to use the Service in compliance with all applicable laws and regulations. You will not:

• Post or transmit harmful, threatening, or offensive content
• Harass, abuse, or harm other users
• Impersonate any person or entity
• Violate any intellectual property rights
• Attempt to gain unauthorized access to our systems
• Use the Service for any illegal or unauthorized purpose
• Interfere with the proper functioning of the Service`
    },
    {
      title: "5. Health Disclaimer",
      content: `NutriWise provides general nutrition and wellness information. This information is not intended to:

• Replace professional medical advice
• Diagnose, treat, cure, or prevent any disease
• Serve as a substitute for consultation with qualified healthcare providers

Always consult with your healthcare provider before making significant changes to your diet or exercise routine, especially if you have pre-existing health conditions.`
    },
    {
      title: "6. Nutritionist Services",
      content: `Our certified nutritionists provide professional guidance based on the information you provide. However:

• Consultations are for educational purposes only
• Nutritionists are independent professionals, not employees
• You are responsible for implementing recommendations safely
• Results may vary based on individual circumstances
• We do not guarantee specific health outcomes`
    },
    {
      title: "7. Subscription and Payments",
      content: `Certain features require a paid subscription. By subscribing, you agree to:

• Pay all applicable fees as described at the time of purchase
• Automatic renewal unless cancelled before the renewal date
• Our refund policy as stated in our billing terms
• Price changes with 30 days notice for existing subscribers

You can cancel your subscription at any time through your account settings.`
    },
    {
      title: "8. Intellectual Property",
      content: `All content, features, and functionality of the Service are owned by NutriWise and are protected by copyright, trademark, and other intellectual property laws. You may not:

• Copy, modify, or distribute our content without permission
• Use our trademarks or branding without authorization
• Create derivative works based on our Service
• Reverse engineer or attempt to extract source code`
    },
    {
      title: "9. Privacy and Data Protection",
      content: `Your privacy is important to us. Our collection and use of personal information is governed by our Privacy Policy. By using the Service, you consent to our data practices as described in the Privacy Policy.`
    },
    {
      title: "10. Termination",
      content: `We reserve the right to terminate or suspend your account and access to the Service at our discretion, without notice, for conduct that we believe:

• Violates these Terms of Service
• Is harmful to other users or our business
• Exposes us to legal liability
• Is otherwise inappropriate

Upon termination, your right to use the Service will immediately cease.`
    },
    {
      title: "11. Limitation of Liability",
      content: `To the fullest extent permitted by law, NutriWise shall not be liable for:

• Indirect, incidental, special, or consequential damages
• Loss of profits, data, or business opportunities
• Damages resulting from unauthorized access to your account
• Any health outcomes or results from using the Service

Our total liability shall not exceed the amount you paid us in the past 12 months.`
    },
    {
      title: "12. Modifications to Terms",
      content: `We reserve the right to modify these terms at any time. We will notify users of significant changes via email or through the Service. Your continued use of the Service after such modifications constitutes your acceptance of the updated terms.`
    },
    {
      title: "13. Governing Law",
      content: `These Terms shall be governed by and construed in accordance with the laws of the State of California, United States, without regard to its conflict of law provisions.`
    },
    {
      title: "14. Contact Information",
      content: `If you have any questions about these Terms of Service, please contact us at:

Email: legal@nutriwise.com
Address: 123 Wellness Ave, Suite 100, San Francisco, CA 94102
Phone: +1 (555) 123-4567`
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-20 sm:py-24">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-400 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <FileText className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-semibold text-emerald-700">Legal</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Terms of{" "}
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
              Service
            </span>
          </h1>
          
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Last Updated: {lastUpdated}
          </p>
        </div>
      </section>

      {/* Important Notice */}
      <section className="py-8 bg-gradient-to-r from-emerald-500 to-teal-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start gap-4 text-white">
            <AlertCircle className="w-6 h-6 flex-shrink-0 mt-1" />
            <div>
              <p className="font-semibold mb-1">Important Notice</p>
              <p className="text-sm text-white/90">
                Please read these Terms of Service carefully before using NutriWise. By using our Service, you agree to be bound by these terms.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-10 lg:p-12">
            <div className="prose prose-lg max-w-none">
              <div className="mb-8">
                <p className="text-gray-600 leading-relaxed">
                  Welcome to NutriWise. These Terms of Service ("Terms") govern your access to and use of our website, mobile application, and services (collectively, the "Service"). Please read these Terms carefully.
                </p>
              </div>

              <div className="space-y-10">
                {sections.map((section, idx) => (
                  <div key={idx} className="border-l-4 border-emerald-500 pl-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      {section.title}
                    </h2>
                    <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                      {section.content}
                    </p>
                  </div>
                ))}
              </div>

              {/* Acceptance Section */}
              <div className="mt-12 p-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200">
                <div className="flex items-start gap-3">
                  <Shield className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      Agreement Acknowledgment
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      By creating an account or using NutriWise, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service and our Privacy Policy.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            Have Questions About Our Terms?
          </h2>
          <p className="text-gray-600 mb-6">
            Our legal team is here to help clarify any concerns you may have.
          </p>
          <button className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold rounded-full transition-all transform hover:scale-105 shadow-lg">
            Contact Legal Team
          </button>
        </div>
      </section>
    </div>
  );
}