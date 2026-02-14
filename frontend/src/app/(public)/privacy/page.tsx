"use client";

import React from "react";
import { Shield, Lock, Eye, Database, UserCheck, Bell, Sparkles } from "lucide-react";

export default function PrivacyPage() {
  const lastUpdated = "January 15, 2024";

  const highlights = [
    {
      icon: Shield,
      title: "Your Data is Protected",
      description: "We use industry-standard encryption to keep your information secure.",
      gradient: "from-emerald-500 to-teal-600"
    },
    {
      icon: Eye,
      title: "Transparency First",
      description: "We're clear about what data we collect and how we use it.",
      gradient: "from-teal-500 to-cyan-600"
    },
    {
      icon: UserCheck,
      title: "You're in Control",
      description: "Manage your privacy settings and data preferences anytime.",
      gradient: "from-emerald-600 to-teal-700"
    }
  ];

  const sections = [
    {
      title: "1. Information We Collect",
      icon: Database,
      content: `We collect several types of information to provide and improve our Service:

**Personal Information:**
• Name, email address, and phone number
• Profile information (age, gender, health goals)
• Payment and billing information
• Communication preferences

**Health & Wellness Data:**
• Dietary preferences and restrictions
• Weight, height, and body measurements
• Activity levels and exercise habits
• Progress tracking data
• Challenge participation and results

**Automatically Collected Information:**
• Device information (type, operating system)
• IP address and location data
• Usage data (features used, time spent)
• Cookies and similar tracking technologies

**Information from Third Parties:**
• Social media profile information (if you connect accounts)
• Payment processor information
• Analytics providers`
    },
    {
      title: "2. How We Use Your Information",
      icon: Lock,
      content: `We use the information we collect for the following purposes:

**To Provide Our Services:**
• Create and manage your account
• Provide personalized nutrition recommendations
• Connect you with certified nutritionists
• Enable participation in challenges and communities
• Process payments and subscriptions

**To Improve Our Services:**
• Analyze usage patterns and trends
• Develop new features and functionality
• Conduct research and development
• Optimize user experience

**To Communicate With You:**
• Send service-related notifications
• Provide customer support
• Share updates, newsletters, and promotional content
• Respond to your inquiries

**For Safety and Security:**
• Detect and prevent fraud
• Protect against security threats
• Enforce our Terms of Service
• Comply with legal obligations`
    },
    {
      title: "3. Information Sharing",
      icon: UserCheck,
      content: `We do not sell your personal information. We may share your information only in these circumstances:

**With Your Consent:**
• When you explicitly authorize us to share information
• When you participate in public features like community forums

**With Service Providers:**
• Payment processors for billing
• Cloud storage providers
• Analytics and marketing platforms
• Customer support tools
(All service providers are bound by confidentiality agreements)

**With Nutritionists:**
• When you book consultations, relevant health information is shared with your assigned nutritionist
• Nutritionists are bound by professional confidentiality

**For Legal Reasons:**
• To comply with legal obligations
• To respond to lawful requests from authorities
• To protect our rights and safety
• In connection with a merger or acquisition (with notice to you)`
    },
    {
      title: "4. Data Security",
      icon: Shield,
      content: `We take data security seriously and implement multiple protective measures:

**Technical Safeguards:**
• Industry-standard encryption (SSL/TLS)
• Secure data centers with physical security
• Regular security audits and assessments
• Intrusion detection and prevention systems

**Administrative Safeguards:**
• Employee access controls and training
• Regular security policy reviews
• Incident response procedures
• Third-party security certifications

**User Safeguards:**
• Strong password requirements
• Two-factor authentication (optional)
• Account activity monitoring
• Automatic logout on inactive sessions

While we implement robust security measures, no method of transmission over the Internet is 100% secure. We cannot guarantee absolute security.`
    },
    {
      title: "5. Your Privacy Rights",
      icon: Eye,
      content: `You have several rights regarding your personal information:

**Access and Portability:**
• Request a copy of your personal data
• Download your information in a portable format

**Correction and Update:**
• Update your profile information anytime
• Correct inaccurate data

**Deletion:**
• Request deletion of your account and associated data
• Note: Some information may be retained for legal compliance

**Opt-Out Rights:**
• Unsubscribe from marketing emails
• Disable cookies through browser settings
• Opt out of personalized advertising

**California Residents (CCPA):**
• Right to know what personal information is collected
• Right to delete personal information
• Right to opt-out of sale (we don't sell data)
• Right to non-discrimination

**EU/UK Residents (GDPR):**
• Right to access and data portability
• Right to rectification and erasure
• Right to restrict processing
• Right to object to processing
• Right to withdraw consent`
    },
    {
      title: "6. Cookies and Tracking",
      icon: Bell,
      content: `We use cookies and similar technologies to enhance your experience:

**Essential Cookies:**
• Required for basic functionality
• Authentication and security
• Cannot be disabled

**Analytics Cookies:**
• Understand how users interact with our Service
• Improve performance and features
• Can be disabled through settings

**Marketing Cookies:**
• Personalize advertisements
• Measure campaign effectiveness
• Can be disabled through settings

You can manage cookie preferences through your browser settings or our cookie consent manager.`
    },
    {
      title: "7. Children's Privacy",
      content: `NutriWise is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you believe we have inadvertently collected such information, please contact us immediately, and we will delete it.`
    },
    {
      title: "8. International Data Transfers",
      content: `Your information may be transferred to and processed in countries other than your country of residence. We ensure appropriate safeguards are in place, including:

• Standard contractual clauses approved by the European Commission
• Privacy Shield certification (where applicable)
• Your explicit consent when required`
    },
    {
      title: "9. Data Retention",
      content: `We retain your information for as long as necessary to:

• Provide our services
• Comply with legal obligations
• Resolve disputes
• Enforce our agreements

When you delete your account, we will delete or anonymize your personal information within 90 days, except where retention is required by law.`
    },
    {
      title: "10. Changes to Privacy Policy",
      content: `We may update this Privacy Policy from time to time. We will notify you of significant changes via:

• Email notification
• In-app notification
• Prominent notice on our website

Your continued use of the Service after such changes constitutes acceptance of the updated Privacy Policy.`
    },
    {
      title: "11. Contact Us",
      content: `If you have questions or concerns about this Privacy Policy, please contact us:

**Email:** privacy@nutriwise.com
**Mail:** Privacy Team, NutriWise, 123 Wellness Ave, Suite 100, San Francisco, CA 94102
**Phone:** +1 (555) 123-4567

**Data Protection Officer:**
For EU/UK inquiries: dpo@nutriwise.com`
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
            <Shield className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-semibold text-emerald-700">Your Privacy Matters</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Privacy{" "}
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
              Policy
            </span>
          </h1>
          
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-2">
            We're committed to protecting your privacy and being transparent about how we collect, use, and protect your information.
          </p>
          <p className="text-sm text-gray-500">
            Last Updated: {lastUpdated}
          </p>
        </div>
      </section>

      {/* Privacy Highlights */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-16">
            {highlights.map((highlight, idx) => (
              <div
                key={idx}
                className="bg-white p-6 lg:p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group"
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${highlight.gradient} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-md`}>
                  <highlight.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {highlight.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {highlight.description}
                </p>
              </div>
            ))}
          </div>

          {/* Privacy Policy Content */}
          <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-10 lg:p-12">
            <div className="mb-8">
              <p className="text-gray-600 leading-relaxed">
                This Privacy Policy describes how NutriWise ("we," "us," or "our") collects, uses, and shares your personal information when you use our website, mobile application, and services.
              </p>
            </div>

            <div className="space-y-10">
              {sections.map((section, idx) => (
                <div key={idx} className="border-l-4 border-emerald-500 pl-6">
                  <div className="flex items-center gap-3 mb-4">
                    {section.icon && (
                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                        <section.icon className="w-5 h-5 text-white" />
                      </div>
                    )}
                    <h2 className="text-2xl font-bold text-gray-900">
                      {section.title}
                    </h2>
                  </div>
                  <div className="text-gray-600 leading-relaxed whitespace-pre-line">
                    {section.content}
                  </div>
                </div>
              ))}
            </div>

            {/* Summary Box */}
            <div className="mt-12 p-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200">
              <div className="flex items-start gap-3">
                <Sparkles className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Your Privacy, Our Priority
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    We're committed to maintaining the highest standards of data protection and privacy. If you have any questions or concerns about how we handle your information, please don't hesitate to contact our privacy team.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Questions About Your Privacy?
          </h2>
          <p className="text-white/90 mb-6">
            Our privacy team is here to help address any concerns.
          </p>
          <button className="px-8 py-3 bg-white text-emerald-600 font-semibold rounded-full hover:bg-gray-100 transition-all transform hover:scale-105 shadow-2xl">
            Contact Privacy Team
          </button>
        </div>
      </section>
    </div>
  );
}