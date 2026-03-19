import { Gallery4 } from "@/components/ui/gallery4"

const successStories = {
  title: "Success stories that inspire",
  description:
    "Our learners have used SkillMentor to transition careers, secure promotions, and break into competitive industries.",
  items: [
    {
      id: "story1",
      title: "SkillMentor's UX Design track was a complete game-changer",
      description: "Mark Manhold — UI Designer at Google",
      href: "#",
      image:
        "https://images.pexels.com/photos/7972568/pexels-photo-7972568.jpeg"
    },
    {
      id: "story2",
      title: "SkillMentor helped me break into tech",
      description: "Henry Jhongson — Software Engineer at Google",
      href: "#",
      image:"https://images.pexels.com/photos/3861447/pexels-photo-3861447.jpeg"
    },
    {
      id: "story3",
      title: "The mentorship completely changed my career",
      description: "Lisa Thompson — Product Designer",
      href: "#",
      image:
        "https://images.pexels.com/photos/6755174/pexels-photo-6755174.jpeg"
    },
    {
      id: "story4",
      title: "From beginner to professional developer",
      description: "David Kim — Frontend Engineer",
      href: "#",
      image:
        "https://images.pexels.com/photos/5717549/pexels-photo-5717549.jpeg"
    }
  ]
}

export function SuccessStoriesSection() {
  return (
    <section className="relative py-24">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <Gallery4 {...successStories} />
      </div>
    </section>
  )
}
