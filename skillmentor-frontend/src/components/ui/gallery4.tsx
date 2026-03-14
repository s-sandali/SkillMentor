import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { type CarouselApi } from "@/components/ui/carousel";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";

export interface Gallery4Props {
  title: string;
  description: string;
  items: {
    id: string;
    title: string;
    description: string;
    href: string;
    image: string;
  }[];
}

export const Gallery4 = ({
  title = "Gallery",
  description = "Explore our latest works.",
  items = [],
}: Gallery4Props) => {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!carouselApi) {
      return;
    }
    const updateSelection = () => {
      setCanScrollPrev(carouselApi.canScrollPrev());
      setCanScrollNext(carouselApi.canScrollNext());
      setCurrentIndex(carouselApi.selectedScrollSnap());
    };
    updateSelection();
    carouselApi.on("select", updateSelection);
    return () => {
      carouselApi.off("select", updateSelection);
    };
  }, [carouselApi]);

  return (
    <div className="w-full">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-2">{title}</h2>
          <p className="text-muted-foreground max-w-2xl">{description}</p>
        </div>
        
        <div className="flex gap-2 shrink-0">
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 rounded-full"
            disabled={!canScrollPrev}
            onClick={() => carouselApi?.scrollPrev()}
            aria-label="Previous slide"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 rounded-full"
            disabled={!canScrollNext}
            onClick={() => carouselApi?.scrollNext()}
            aria-label="Next slide"
          >
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <Carousel
        setApi={setCarouselApi}
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-4 pl-4 md:pl-0">
          {items.map((item) => (
            <CarouselItem key={item.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
              <a href={item.href} className="group block h-full">
                <div className="relative h-[400px] w-full overflow-hidden rounded-2xl">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="absolute inset-0 p-6 flex flex-col justify-end">
                    <h3 className="text-xl font-semibold text-white mb-2 line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-white/80 line-clamp-2 text-sm">
                      {item.description}
                    </p>
                  </div>
                </div>
              </a>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Slide indicators */}
      <div className="mt-8 flex justify-center gap-2">
        {items.map((_, index) => (
          <button
            key={index}
            className={`h-2 rounded-full transition-all ${
              index === currentIndex ? "w-8 bg-primary" : "w-2 bg-primary/30"
            }`}
            onClick={() => carouselApi?.scrollTo(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
