import Link from "next/link";
import { Bricolage_Grotesque } from "next/font/google";
import { Award, Heart, Target, Users, type LucideIcon } from "lucide-react";

const font = Bricolage_Grotesque({ subsets: ["latin"], display: "swap" });

type Stat = { number: string; label: string };
type Value = { icon: LucideIcon; title: string; description: string };
type Member = { name: string; role: string };

const stats: Stat[] = [
  { number: "100K+", label: "Active users" },
  { number: "50+", label: "Expert nutritionists" },
  { number: "200+", label: "Challenges completed" },
  { number: "4.9 / 5", label: "Average rating" },
];

const values: Value[] = [
  {
    icon: Heart,
    title: "Health first",
    description:
      "Every recommendation is evidence-based and built around your wellbeing, not trends.",
  },
  {
    icon: Users,
    title: "Community driven",
    description:
      "Share your progress, swap recipes, and keep each other going.",
  },
  {
    icon: Award,
    title: "Expert guidance",
    description:
      "Certified nutritionists review your goals and adjust your plan as you go.",
  },
  {
    icon: Target,
    title: "Goal oriented",
    description:
      "Set realistic targets and get the tools to reach them without crash diets.",
  },
];

const team: Member[] = [
  { name: "Sarah Johnson", role: "Founder & CEO" },
  { name: "Michael Chen", role: "Head of Nutrition" },
  { name: "Emily Davis", role: "Community Manager" },
  { name: "David Brown", role: "Chief Technology Officer" },
];

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F0B429]";

export default function AboutPage() {
  return (
    <div
      className={`${font.className} min-h-screen bg-[#F7F8F3] text-[#10231C] antialiased`}
    >
      {/* Hero */}
      <section className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[1.2fr_1fr] lg:items-center lg:gap-16 lg:px-8 lg:py-28">
        <div>
          <h1 className="text-5xl font-extrabold leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
            Eat well without the guesswork.
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-[#10231C]/75 sm:text-xl">
            NutriWise pairs you with certified nutritionists, daily challenges,
            and a community that keeps you going, so healthy habits actually
            last.
          </p>
          <Link
            href="/signup"
            className={`mt-10 inline-block rounded-full bg-[#10231C] px-7 py-3.5 font-bold text-[#F7F8F3] transition-colors hover:bg-[#2F6B4F] ${focusRing}`}
          >
            Get started
          </Link>
        </div>

        <aside
          aria-label="NutriWise in numbers"
          className="w-full max-w-md border-2 border-[#10231C] bg-white p-5 lg:justify-self-end"
        >
          <h2 className="text-3xl font-extrabold leading-none tracking-tight">
            NutriWise facts
          </h2>
          <p className="mt-1 text-sm text-[#10231C]/70">
            Serving members since 2020
          </p>
          <div className="mt-3 h-3 bg-[#10231C]" />
          <dl>
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex items-baseline justify-between gap-4 border-b border-[#10231C]/25 py-3 last:border-b-0"
              >
                <dt className="font-medium">{stat.label}</dt>
                <dd className="text-3xl font-extrabold tracking-tight">
                  {stat.number}
                </dd>
              </div>
            ))}
          </dl>
          <div className="h-1.5 bg-[#10231C]" />
        </aside>
      </section>

      {/* Story */}
      <section className="border-t border-[#10231C]/15">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-12 lg:gap-12 lg:px-8">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:col-span-4">
            Our story
          </h2>
          <div className="space-y-5 text-lg leading-relaxed text-[#10231C]/80 lg:col-span-7">
            <p>
              We started NutriWise in 2020 to make professional nutrition
              guidance available to everyone, whatever their location or budget.
            </p>
            <p>
              Most people don&rsquo;t fail at healthy eating from lack of
              willpower. They lack personal guidance, accountability, and people
              to do it with. So we built one place that combines expert
              consultations, engaging challenges, and a supportive community.
            </p>
            <p>
              Today, over 100,000 members use NutriWise to change how they think
              about food and to keep the results.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-[#10231C] text-[#F7F8F3]">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <h2 className="max-w-2xl text-3xl font-extrabold tracking-tight sm:text-4xl">
            What goes into every plan
          </h2>
          <ul className="mt-12 grid gap-x-12 md:grid-cols-2">
            {values.map((value) => (
              <li
                key={value.title}
                className="flex gap-5 border-t border-[#F7F8F3]/25 py-8"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#F0B429] text-[#10231C]">
                  <value.icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-xl font-bold">{value.title}</h3>
                  <p className="mt-2 max-w-md leading-relaxed text-[#F7F8F3]/75">
                    {value.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Team */}
      <section>
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            The people behind NutriWise
          </h2>
          <ul className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member) => (
              <li key={member.name}>
                <div
                  aria-hidden="true"
                  className="flex h-20 w-20 items-center justify-center rounded-full bg-[#2F6B4F] text-3xl font-extrabold text-[#F7F8F3]"
                >
                  {member.name.charAt(0)}
                </div>
                <h3 className="mt-4 text-xl font-bold">{member.name}</h3>
                <p className="text-[#10231C]/70">{member.role}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#F0B429]">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-8 px-4 py-16 sm:px-6 sm:py-20 md:flex-row md:items-center md:justify-between lg:px-8">
          <h2 className="max-w-xl text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
            Start with one small change.
          </h2>
          <Link
            href="/signup"
            className="shrink-0 rounded-full bg-[#10231C] px-8 py-4 text-lg font-bold text-[#F7F8F3] transition-colors hover:bg-[#2F6B4F] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#10231C]"
          >
            Create your free account
          </Link>
        </div>
      </section>
    </div>
  );
}
