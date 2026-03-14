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
        "https://images.unsplash.com/photo-1607746882042-944635dfe10e"
    },
    {
      id: "story2",
      title: "SkillMentor helped me break into tech",
      description: "Henry Jhongson — Software Engineer at Google",
      href: "#",
      image:
        "https://images.unsplash.com/photo-1603415526960-f7e0328d3d6c"
    },
    {
      id: "story3",
      title: "The mentorship completely changed my career",
      description: "Lisa Thompson — Product Designer",
      href: "#",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330"
    },
    {
      id: "story4",
      title: "From beginner to professional developer",
      description: "David Kim — Frontend Engineer",
      href: "#",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e"
    }
  ]
}

export function SuccessStoriesSection() {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <Gallery4 {...successStories} />
      </div>
    </section>
  )
}
