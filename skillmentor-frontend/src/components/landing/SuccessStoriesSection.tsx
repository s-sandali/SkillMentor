import { Gallery4 } from "@/components/ui/gallery4";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const successStories = {
  title: "Success stories that inspire",
  description:
    "Our learners have used SkillMentor to transition careers, secure promotions, and break into competitive industries.",
  items: [
    {
      id: "story1",
      title: "SkillMentor's UX Design track was a complete game-changer for my career",
      description: "Mark Manhold - UI Designer at Google",
      href: "#",
      image: "https://images.pexels.com/photos/7972568/pexels-photo-7972568.jpeg",
    },
    {
      id: "story2",
      title: "I went from zero coding knowledge to a full-time engineering role",
      description: "Henry Jhongson - Software Engineer at Meta",
      href: "#",
      image: "https://static.sliit.lk/wp-content/uploads/2019/08/26031316/SLIIT-faculty-of-Computing-img.jpg",
    },
    {
      id: "story3",
      title: "My mentor helped me nail 6 system design interviews in a row",
      description: "Lisa Thompson - Senior Product Designer at Airbnb",
      href: "#",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIBRkRR1u1scE_boyGUNumRh5LxCZ1d-630A&s",
    },
    {
      id: "story4",
      title: "Went from backend intern to frontend lead in under a year",
      description: "David Kim - Frontend Engineer at Stripe",
      href: "#",
      image: "https://www.teachhub.com/wp-content/uploads/2021/09/Aug-30-Challenges-Faced-by-a-First-Generation-College-Student_web-768x519.jpg",
    },
  ],
};

export function SuccessStoriesSection() {
  const ref = useScrollAnimation<HTMLDivElement>({ threshold: 0.06 });

  return (
    <section id="stories" className="relative py-24">
      <div ref={ref} className="anim max-w-7xl mx-auto px-6 relative z-10">

        <Gallery4 {...successStories} />
      </div>
    </section>
  );
}
