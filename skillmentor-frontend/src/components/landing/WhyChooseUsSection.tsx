import { User, CalendarCheck, BadgeDollarSign, Star } from "lucide-react";
import mentorImage from "@/assets/girl1.webp";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const features = [
  {
    icon: User,
    title: "Expert Mentors",
    body: "Work with certified practitioners from top companies who bring real-world experience to every session.",
  },
  {
    icon: CalendarCheck,
    title: "Flexible Scheduling",
    body: "Book sessions that fit your timetable mornings, evenings, or weekends. No rigid class schedules.",
  },
  {
    icon: BadgeDollarSign,
    title: "Transparent Pricing",
    body: "Pay only for what you need. No hidden fees, no subscriptions just straightforward session pricing.",
  },
  {
    icon: Star,
    title: "Proven Results",
    body: "Over 90% of our learners report landing a role or promotion within 6 months of consistent mentorship.",
  },
];

export function WhyChooseUsSection() {
  const headingRef = useScrollAnimation<HTMLDivElement>({ threshold: 0.1 });
  const gridRef = useScrollAnimation<HTMLDivElement>({ threshold: 0.05 });

  return (
    <section
      id="why-us"
      aria-label="Why Choose SkillMentor"
      className="relative max-w-7xl mx-auto px-6 py-24"
    >
      {/* Heading */}
      <div ref={headingRef} className="anim text-center mb-16 space-y-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
          Why SkillMentor
        </p>
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">
          Everything you need to level up.
        </h2>
        <p className="text-gray-500 md:text-lg max-w-xl mx-auto leading-relaxed">
          Designed for real learning outcomes not just course completions.
        </p>
      </div>

      {/* Bento grid */}
      <div ref={gridRef} className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left column — 2 feature cards */}
        <div className="flex flex-col gap-5">
          {features.slice(0, 2).map((f, i) => (
            <div
              key={f.title}
              className={`anim anim-delay-${i + 1} flex-1 rounded-3xl p-8 flex flex-col justify-between min-h-[200px] ${i === 0
                ? "bg-black text-white"
                : "bg-white border border-gray-100 shadow-sm text-gray-900"
                }`}
            >
              <div
                className={`w-11 h-11 rounded-full flex items-center justify-center mb-8 ${i === 0 ? "bg-white/10" : "bg-gray-100"
                  }`}
              >
                <f.icon className={`w-5 h-5 ${i === 0 ? "text-white" : "text-gray-700"}`} />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">{f.title}</h3>
                <p className={`text-sm leading-relaxed ${i === 0 ? "text-gray-400" : "text-gray-500"}`}>
                  {f.body}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Center — full-bleed image */}
        <div className="anim anim-delay-2 relative rounded-3xl overflow-hidden min-h-[420px] lg:min-h-full">
          <img
            src={mentorImage}
            alt="Mentor helping a student"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* overlay badge */}
          <div className="absolute bottom-5 left-5 right-5 rounded-2xl bg-black/70 backdrop-blur-sm px-5 py-4 text-white">
            <p className="text-xs text-white/60 uppercase tracking-widest mb-1">
              Learner outcome
            </p>
            <p className="font-semibold text-sm leading-snug">
              "I landed my first cloud role in 4 months thanks to SkillMentor."
            </p>
            <p className="text-xs text-white/50 mt-1.5">— Ravi P., AWS Solutions Architect</p>
          </div>
        </div>

        {/* Right column — 2 feature cards */}
        <div className="flex flex-col gap-5">
          {features.slice(2).map((f, i) => (
            <div
              key={f.title}
              className={`anim anim-delay-${i + 3} flex-1 rounded-3xl p-8 bg-white border border-gray-100 shadow-sm text-gray-900 flex flex-col justify-between min-h-[200px]`}
            >
              <div className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center mb-8">
                <f.icon className="w-5 h-5 text-gray-700" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
