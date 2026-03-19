import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What types of mentors and learning paths do you offer?",
    answer:
      "SkillMentor connects you with specialists across cloud, data, cybersecurity, UI/UX, QA, and interview preparation. Each mentor session is designed to help you build practical skills, prepare for certifications, and move toward specific career goals.",
  },
  {
    question: "Are the sessions beginner-friendly?",
    answer:
      "Yes. Many learners start with foundational guidance, and mentors can tailor the pace to your current level. Whether you are switching careers or sharpening existing skills, the experience is meant to feel structured and approachable.",
  },
  {
    question: "How do I book a session with a mentor?",
    answer:
      "You can browse available mentors, review their expertise, and schedule a session that fits your timeline. The booking flow is designed to make it easy to compare options and choose the mentor who matches your learning goals.",
  },
  {
    question: "Do mentors help with certifications and interview prep?",
    answer:
      "Absolutely. Many mentors focus on industry certifications, technical interviews, portfolio feedback, and real-world problem solving. The goal is to support both your immediate milestones and your long-term career growth.",
  },
  {
    question: "Can I continue learning with the same mentor over time?",
    answer:
      "Yes. If you find a mentor whose teaching style works well for you, you can continue with follow-up sessions to build momentum, deepen your knowledge, and stay accountable as you progress.",
  },
];

export function FaqSection() {
  return (
    <section
      aria-label="Frequently asked questions"
      className="relative mx-auto w-full max-w-5xl px-6 py-20"
    >
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
          Frequently asked questions
        </h2>
        <p className="mt-4 text-base leading-7 text-gray-600 md:text-lg">
          Everything you need to know about learning with mentors, booking
          sessions, and building momentum on your career path.
        </p>
      </div>

      <div className="mt-12">
        <Accordion
          type="single"
          collapsible
          defaultValue="faq-0"
          className="space-y-4"
        >
          {faqs.map((faq, index) => (
            <AccordionItem key={faq.question} value={`faq-${index}`}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
