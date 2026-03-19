import { ArrowRight } from "lucide-react";

type ShowcaseItem = {
  image: string;
  label: string;
  type: string;
  offset: string;
  badgeClass?: string;
};

const showcaseItems: ShowcaseItem[] = [
  {
    image: "https://images.pexels.com/photos/5905483/pexels-photo-5905483.jpeg",
    label: "DEVOPS",
    type: "text",
    offset: "mt-12",
  },
  {
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
    label: "CLOUD",
    type: "text",
    offset: "mt-32",
  },
  {
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
    label: "UI/UX",
    type: "text",
    offset: "mt-4",
  },
  {
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a",
    label: "QA",
    type: "text",
    
    offset: "mt-24",
  },
  {
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7",
    label: "BA",
    type: "text",
    offset: "mt-8",
  },
  {
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d",
    label: "CYBER",
    type: "text",
    
    offset: "mt-28",
  },
];

function CardContent({ item }: { item: ShowcaseItem }) {
  return (
    <>
      <img
        src={item.image}
        alt={item.label}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <div className="absolute bottom-4 left-0 right-0 flex justify-center pb-2">
        {item.type === "text" ? (
          <span className="text-white font-bold text-lg tracking-wider uppercase drop-shadow-md">
            {item.label}
          </span>
        ) : (
          <span
            className={`px-4 py-1 text-sm font-bold rounded-md shadow-sm ${item.badgeClass}`}
          >
            {item.label}
          </span>
        )}
      </div>
    </>
  );
}

export function MentorShowcaseSection() {
  return (
    <section className="relative pt-24 pb-10 overflow-hidden">
      {/* Scattered subtle filled squares */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
         <div className="absolute top-[15%] left-[10%] w-[4rem] h-[4rem] bg-gray-200 rounded-xl" />
         <div className="absolute top-[35%] left-[2%] w-[4rem] h-[4rem] bg-gray-200 rounded-xl" />
         <div className="absolute top-[20%] right-[10%] w-[4rem] h-[4rem] bg-gray-200 rounded-xl" />
         <div className="absolute top-[45%] right-[2%] w-[4rem] h-[4rem] bg-gray-200 rounded-xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
        <h2 className="text-4xl md:text-5xl lg:text-5xl font-extrabold tracking-tight text-gray-900 leading-[1.1] max-w-2xl mx-auto">
          Upgrade your skills. unlock<br />new opportunities.
        </h2>
        
        <div className="flex justify-center mt-8">
          <button className="flex items-center rounded-full bg-black text-white pl-6 pr-1 py-1 hover:bg-gray-800 transition-colors shadow-lg hover:shadow-xl">
            <span className="mr-4 font-semibold text-xs tracking-widest uppercase">Explore Our Courses</span>
            <div className="bg-white text-black rounded-full p-2 flex items-center justify-center">
              <ArrowRight className="h-4 w-4" />
            </div>
          </button>
        </div>

        {/* The images container */}
        <div className="mt-16 sm:mt-24 relative w-full -mx-6 px-6 sm:mx-0 sm:px-0 overflow-x-auto overflow-y-hidden no-scrollbar pb-32">
          <div className="flex justify-start sm:justify-center gap-4 sm:gap-6 min-w-max mx-auto px-4">
            {showcaseItems.map((item, index) => (
              <div key={index} className={`relative flex-none w-[140px] sm:w-[150px] md:w-[160px] ${item.offset}`}>
                
                {/* The Main Card */}
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl z-20 hover:-translate-y-2 transition-transform duration-300 ring-1 ring-black/5">
                  <CardContent item={item} />
                </div>
                
                {/* The Reflection */}
                <div 
                  className="relative aspect-[3/4] rounded-2xl overflow-hidden mt-2 z-10 opacity-30 select-none pointer-events-none transform"
                  style={{
                    transform: 'scaleY(-1)',
                    maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 50%)',
                    WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 50%)'
                  }}
                >
                  <CardContent item={item} />
                </div>
                
              </div>
            ))}
          </div>
          
          {/* Bottom fade overlay for entire row */}
          <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-white via-white/80 to-transparent z-30 pointer-events-none" />
        </div>
      </div>
    </section>
  );
}
