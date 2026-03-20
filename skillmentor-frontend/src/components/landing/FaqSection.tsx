import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const faqs = [
  {
    question: "What types of mentors and learning paths do you offer?",
    answer:
      "SkillMentor connects you with specialists across cloud, data, cybersecurity, UI/UX, QA, DevOps, and interview preparation. Each mentor session is tailored to help you build practical skills, prepare for certifications, and move toward specific career goals.",
  },
  {
    question: "Are the sessions beginner-friendly?",
    answer:
      "Yes. Many learners start with foundational guidance, and mentors adapt the pace to your current level. Whether you're switching careers or sharpening existing skills, sessions are structured to feel approachable and productive from day one.",
  },
  {
    question: "How do I book a session with a mentor?",
    answer:
      "Browse mentor profiles, review their expertise and ratings, then pick a time slot that works for you. The booking flow is designed to be quick — you can go from browsing to confirmed session in under two minutes.",
  },
  {
    question: "Do mentors help with certifications and interview prep?",
    answer:
      "Absolutely. Many mentors specialise in AWS, GCP, Azure certifications, system design interviews, and technical whiteboarding. The goal is to help you hit both short-term milestones and long-term career objectives.",
  },
  {
    question: "Can I continue learning with the same mentor over time?",
    answer:
      "Yes. If a mentor's style clicks with you, you can rebook them at any time. Building an ongoing relationship with your mentor is one of the most effective ways to accelerate your growth and stay accountable.",
  },
];

export function FaqSection() {
  const headingRef = useScrollAnimation<HTMLDivElement>({ threshold: 0.1 });
  const accordionRef = useScrollAnimation<HTMLDivElement>({ threshold: 0.06 });

  return (
    <section
      id="faq"
      aria-label="Frequently asked questions"
      className="relative mx-auto w-full max-w-4xl px-6 py-24"
    >
      {/* Heading */}
      <div ref={headingRef} className="anim mx-auto max-w-2xl text-center mb-14">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
          Got questions?
        </p>
        <h2 className="text-4xl font-extrabold tracking-tight text-gray-900 md:text-5xl">
          Frequently asked questions
        </h2>
        <p className="mt-4 text-base leading-7 text-gray-500 md:text-lg">
          Everything you need to know about learning with mentors,
          booking sessions, and building momentum on your career path.
        </p>
      </div>

      {/* Accordion */}
      <div ref={accordionRef} className="anim">
        <Accordion
          type="single"
          collapsible
          defaultValue="faq-0"
          className="space-y-3"
        >
          {faqs.map((faq, index) => (
            <AccordionItem
              key={faq.question}
              value={`faq-${index}`}
              className={`anim anim-delay-${Math.min(index + 1, 5)} rounded-2xl border border-gray-200 bg-white px-6 shadow-sm data-[state=open]:shadow-md transition-shadow`}
            >
              <AccordionTrigger className="text-left font-semibold text-gray-900 hover:no-underline py-5">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-500 leading-relaxed pb-5">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
