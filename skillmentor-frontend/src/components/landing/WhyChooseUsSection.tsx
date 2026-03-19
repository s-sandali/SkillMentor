import { User, DollarSign, Trophy, Star } from "lucide-react";
import mentorImage from "@/assets/girl1.webp";

export function WhyChooseUsSection() {
  return (
    <section
      aria-label="Why Choose SkillMentor"
      className="relative max-w-7xl mx-auto px-6 py-20"
    >
      <div className="text-center mb-16 space-y-4 relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Why choose SkillMentor?</h2>
        <p className="text-gray-600 md:text-lg dark:text-gray-400 max-w-2xl mx-auto">
          Designed for better learning. Built for real success. Designed for better learning. Built for real success.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="flex flex-col gap-6">
          {/* Black Card */}
          <div className="bg-black text-white p-8 rounded-3xl flex-1 flex flex-col justify-center">
            <div className="bg-white/10 w-12 h-12 rounded-full flex items-center justify-center mb-12">
              <User className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Expert instructors</h3>
            <p className="text-gray-400 leading-relaxed">
              Our instructors are creative minds and strategic thinkers.
            </p>
          </div>

          {/* White Card */}
          <div className="bg-white text-black p-8 rounded-3xl flex-1 border border-gray-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] flex flex-col justify-center">
            <div className="bg-gray-100 w-12 h-12 rounded-full flex items-center justify-center mb-12">
              <DollarSign className="w-6 h-6 text-black" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Affordable pricing</h3>
            <p className="text-gray-500 leading-relaxed">
              We're a team of creative minds and strategic thinkers.
            </p>
          </div>
        </div>

        {/* Center Column - Image */}
        <div className="relative rounded-3xl overflow-hidden min-h-[400px] lg:min-h-full">
          <img
            src={mentorImage}
            alt="Student learning"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-6">
          {/* White Card */}
          <div className="bg-white text-black p-8 rounded-3xl flex-1 border border-gray-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] flex flex-col justify-center">
            <div className="bg-gray-100 w-12 h-12 rounded-full flex items-center justify-center mb-12">
              <Trophy className="w-6 h-6 text-black" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Awards</h3>
            <p className="text-gray-500 leading-relaxed">
              But along the way, our work has been honored.
            </p>
          </div>

          {/* White Card */}
          <div className="bg-white text-black p-8 rounded-3xl flex-1 border border-gray-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] flex flex-col justify-center">
            <div className="bg-gray-100 w-12 h-12 rounded-full flex items-center justify-center mb-12">
              <Star className="w-6 h-6 text-black" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Reviews</h3>
            <p className="text-gray-500 leading-relaxed">
              Strategic placements for testimonials, student success.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
