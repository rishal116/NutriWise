
import {
  Shield,
  Eye,
  Database,
  UserCheck,
  Bell,
  Lock,
  Sparkles,
  Mail,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const LAST_UPDATED = "January 15, 2024";

const PRIVACY_EMAIL = "privacy@nutriwise.com";
const DPO_EMAIL = "dpo@nutriwise.com";

interface PrivacyHighlight {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  gradient: string;
}

interface PrivacySection {
  id: string;
  title: string;
  icon?: LucideIcon;
  content: string[];
}

const highlights: PrivacyHighlight[] = [
  {
    id: "data-protection",
    icon: Shield,
    title: "Your Data is Protected",
    description:
      "We use industry-standard encryption to keep your information secure.",
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    id: "transparency",
    icon: Eye,
    title: "Transparency First",
    description:
      "We're clear about what data we collect and how we use it.",
    gradient: "from-teal-500 to-cyan-600",
  },
  {
    id: "user-control",
    icon: UserCheck,
    title: "You're in Control",
    description:
      "Manage your privacy settings and data preferences anytime.",
    gradient: "from-emerald-600 to-teal-700",
  },
];

const sections: PrivacySection[] = [
  {
    id: "information-collected",
    title: "1. Information We Collect",
    icon: Database,
    content: [
      "We collect several types of information to provide and improve our Service:",
      "**Personal Information:**",
      "• Name, email address, and phone number\n• Profile information (age, gender, health goals)\n• Payment and billing information\n• Communication preferences",
      "**Health & Wellness Data:**",
      "• Dietary preferences and restrictions\n• Weight, height, and body measurements\n• Activity levels and exercise habits\n• Progress tracking data\n• Challenge participation and results",
      "**Automatically Collected Information:**",
      "• Device information (type, operating system)\n• IP address and location data\n• Usage data (features used, time spent)\n• Cookies and similar tracking technologies",
      "**Information from Third Parties:**",
      "• Social media profile information (if you connect accounts)\n• Payment processor information\n• Analytics providers",
    ],
  },
  {
    id: "information-usage",
    title: "2. How We Use Your Information",
    icon: Lock,
    content: [
      "We use the information we collect for the following purposes:",
      "**To Provide Our Services:**",
      "• Create and manage your account\n• Provide personalized nutrition recommendations\n• Connect you with certified nutritionists\n• Enable participation in challenges and communities\n• Process payments and subscriptions",
      "**To Improve Our Services:**",
      "• Analyze usage patterns and trends\n• Develop new features and functionality\n• Conduct research and development\n• Optimize user experience",
      "**To Communicate With You:**",
      "• Send service-related notifications\n• Provide customer support\n• Share updates, newsletters, and promotional content\n• Respond to your inquiries",
      "**For Safety and Security:**",
      "• Detect and prevent fraud\n• Protect against security threats\n• Enforce our Terms of Service\n• Comply with legal obligations",
    ],
  },
  {
    id: "information-sharing",
    title: "3. Information Sharing",
    icon: UserCheck,
    content: [
      "We do not sell your personal information. We may share your information only in these circumstances:",
      "**With Your Consent:**",
      "• When you explicitly authorize us to share information\n• When you participate in public features like community forums",
      "**With Service Providers:**",
      "• Payment processors for billing\n• Cloud storage providers\n• Analytics and marketing platforms\n• Customer support tools\n\nAll service providers are bound by confidentiality agreements.",
      "**With Nutritionists:**",
      "• When you book consultations, relevant health information is shared with your assigned nutritionist\n• Nutritionists are bound by professional confidentiality",
      "**For Legal Reasons:**",
      "• To comply with legal obligations\n• To respond to lawful requests from authorities\n• To protect our rights and safety\n• In connection with a merger or acquisition (with notice to you)",
    ],
  },
  {
    id: "data-security",
    title: "4. Data Security",
    icon: Shield,
    content: [
      "We take data security seriously and implement multiple protective measures:",
      "**Technical Safeguards:**",
      "• Industry-standard encryption (SSL/TLS)\n• Secure data centers with physical security\n• Regular security audits and assessments\n• Intrusion detection and prevention systems",
      "**Administrative Safeguards:**",
      "• Employee access controls and training\n• Regular security policy reviews\n• Incident response procedures\n• Third-party security certifications",
      "**User Safeguards:**",
      "• Strong password requirements\n• Two-factor authentication (optional)\n• Account activity monitoring\n• Automatic logout on inactive sessions",
      "While we implement robust security measures, no method of transmission over the Internet is 100% secure. We cannot guarantee absolute security.",
    ],
  },
  {
    id: "privacy-rights",
    title: "5. Your Privacy Rights",
    icon: Eye,
    content: [
      "You have several rights regarding your personal information:",
      "**Access and Portability:**",
      "• Request a copy of your personal data\n• Download your information in a portable format",
      "**Correction and Update:**",
      "• Update your profile information anytime\n• Correct inaccurate data",
      "**Deletion:**",
      "• Request deletion of your account and associated data\n• Note: Some information may be retained for legal compliance",
      "**Opt-Out Rights:**",
      "• Unsubscribe from marketing emails\n• Disable cookies through browser settings\n• Opt out of personalized advertising",
      "**California Residents (CCPA):**",
      "• Right to know what personal information is collected\n• Right to delete personal information\n• Right to opt-out of sale (we don't sell data)\n• Right to non-discrimination",
      "**EU/UK Residents (GDPR):**",
      "• Right to access and data portability\n• Right to rectification and erasure\n• Right to restrict processing\n• Right to object to processing\n• Right to withdraw consent",
    ],
  },
  {
    id: "cookies",
    title: "6. Cookies and Tracking",
    icon: Bell,
    content: [
      "We use cookies and similar technologies to enhance your experience:",
      "**Essential Cookies:**",
      "• Required for basic functionality\n• Authentication and security\n• Cannot be disabled",
      "**Analytics Cookies:**",
      "• Understand how users interact with our Service\n• Improve performance and features\n• Can be disabled through settings",
      "**Marketing Cookies:**",
      "• Personalize advertisements\n• Measure campaign effectiveness\n• Can be disabled through settings",
      "You can manage cookie preferences through your browser settings or our cookie consent manager.",
    ],
  },
  {
    id: "childrens-privacy",
    title: "7. Children's Privacy",
    content: [
      "NutriWise is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you believe we have inadvertently collected such information, please contact us immediately, and we will delete it.",
    ],
  },
  {
    id: "international-transfers",
    title: "8. International Data Transfers",
    content: [
      "Your information may be transferred to and processed in countries other than your country of residence. We ensure appropriate safeguards are in place, including:",
      "• Standard contractual clauses approved by the European Commission\n• Privacy Shield certification (where applicable)\n• Your explicit consent when required",
    ],
  },
  {
    id: "data-retention",
    title: "9. Data Retention",
    content: [
      "We retain your information for as long as necessary to:",
      "• Provide our services\n• Comply with legal obligations\n• Resolve disputes\n• Enforce our agreements",
      "When you delete your account, we will delete or anonymize your personal information within 90 days, except where retention is required by law.",
    ],
  },
  {
    id: "policy-changes",
    title: "10. Changes to Privacy Policy",
    content: [
      "We may update this Privacy Policy from time to time. We will notify you of significant changes via:",
      "• Email notification\n• In-app notification\n• Prominent notice on our website",
      "Your continued use of the Service after such changes constitutes acceptance of the updated Privacy Policy.",
    ],
  },
  {
    id: "contact",
    title: "11. Contact Us",
    content: [
      "If you have questions or concerns about this Privacy Policy, please contact us:",
      "**Mail:** Privacy Team, NutriWise, 123 Wellness Ave, Suite 100, San Francisco, CA 94102",
      "**Phone:** +1 (555) 123-4567",
      "**Data Protection Officer:** For EU/UK inquiries, contact:",
    ],
  },
];

export default function PrivacyPage() {
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
            <Shield className="h-4 w-4 text-emerald-600" />

            <span className="text-sm font-semibold text-emerald-700">
              Your Privacy Matters
            </span>
          </div>

          <h1 className="mb-6 text-4xl font-bold text-gray-900 sm:text-5xl lg:text-6xl">
            Privacy{" "}
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
              Policy
            </span>
          </h1>

          <p className="mx-auto mb-2 max-w-3xl text-lg text-gray-600">
            We&apos;re committed to protecting your privacy and being
            transparent about how we collect, use, and protect your information.
          </p>

          <p className="text-sm text-gray-500">
            Last Updated: {LAST_UPDATED}
          </p>
        </div>
      </section>

      {/* Privacy Highlights */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {highlights.map((highlight) => {
              const Icon = highlight.icon;

              return (
                <div
                  key={highlight.id}
                  className="group rounded-2xl bg-white p-6 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl lg:p-8"
                >
                  <div
                    className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${highlight.gradient} shadow-md transition-transform group-hover:scale-110`}
                  >
                    <Icon className="h-7 w-7 text-white" />
                  </div>

                  <h3 className="mb-3 text-xl font-bold text-gray-900">
                    {highlight.title}
                  </h3>

                  <p className="leading-relaxed text-gray-600">
                    {highlight.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Privacy Policy Content */}
          <div className="rounded-3xl bg-white p-8 shadow-xl sm:p-10 lg:p-12">
            <div className="mb-8">
              <p className="leading-relaxed text-gray-600">
                This Privacy Policy describes how NutriWise (&quot;we,&quot;
                &quot;us,&quot; or &quot;our&quot;) collects, uses, and shares
                your personal information when you use our website, mobile
                application, and services.
              </p>
            </div>

            <div className="space-y-10">
              {sections.map((section) => {
                const Icon = section.icon;

                return (
                  <section
                    key={section.id}
                    className="border-l-4 border-emerald-500 pl-6"
                  >
                    <div className="mb-4 flex items-center gap-3">
                      {Icon && (
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600">
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                      )}

                      <h2 className="text-2xl font-bold text-gray-900">
                        {section.title}
                      </h2>
                    </div>

                    <div className="space-y-4 leading-relaxed text-gray-600">
                      {section.content.map((paragraph, index) => (
                        <p
                          key={`${section.id}-${index}`}
                          className="whitespace-pre-line"
                        >
                          {paragraph}
                        </p>
                      ))}

                      {section.id === "contact" && (
                        <div className="space-y-2">
                          <p>
                            <strong>Email:</strong>{" "}
                            <a
                              href={`mailto:${PRIVACY_EMAIL}`}
                              className="font-medium text-emerald-700 hover:text-emerald-800 hover:underline"
                            >
                              {PRIVACY_EMAIL}
                            </a>
                          </p>

                          <p>
                            <strong>Data Protection Officer:</strong>{" "}
                            <a
                              href={`mailto:${DPO_EMAIL}`}
                              className="font-medium text-emerald-700 hover:text-emerald-800 hover:underline"
                            >
                              {DPO_EMAIL}
                            </a>
                          </p>
                        </div>
                      )}
                    </div>
                  </section>
                );
              })}
            </div>

            {/* Summary */}
            <div className="mt-12 rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 p-6">
              <div className="flex items-start gap-3">
                <Sparkles className="mt-1 h-6 w-6 shrink-0 text-emerald-600" />

                <div>
                  <h3 className="mb-2 text-lg font-bold text-gray-900">
                    Your Privacy, Our Priority
                  </h3>

                  <p className="leading-relaxed text-gray-700">
                    We&apos;re committed to maintaining the highest standards
                    of data protection and privacy. If you have any questions
                    or concerns about how we handle your information, please
                    don&apos;t hesitate to contact our privacy team.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-600 py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 text-2xl font-bold text-white sm:text-3xl">
            Questions About Your Privacy?
          </h2>

          <p className="mb-6 text-white/90">
            Our privacy team is here to help address any concerns.
          </p>

          <a
            href={`mailto:${PRIVACY_EMAIL}`}
            className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3 font-semibold text-emerald-600 shadow-2xl transition-all hover:scale-105 hover:bg-gray-100"
          >
            <Mail className="h-4 w-4" />
            Contact Privacy Team
          </a>
        </div>
      </section>
    </div>
  );
}
