import { Button } from "@/components/ui/button";

export function ScheduleCallSection() {
  return (
    <section 
      aria-label="Schedule a Call"
      className="relative max-w-7xl mx-auto px-6 py-16 flex flex-col items-center justify-center text-center space-y-6"
    >
      <h2 className="lg:text-5xl md:text-4xl sm:text-3xl text-3xl font-bold tracking-tight relative z-10">
        Schedule a Call
      </h2>
      <p className="max-w-2xl text-gray-500 md:text-lg dark:text-gray-400">
        Ready to take the next step in your career? Book a one-on-one session with our expert mentors today.
      </p>
      <Button size="lg" className="text-lg">
        Book a Session
      </Button>
    </section>
  );
}
