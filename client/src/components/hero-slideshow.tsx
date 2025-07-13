import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Import all the slideshow images
import slide1 from "@assets/1_1751298558711.jpeg";
import slide2 from "@assets/2_1751298558713.jpeg";
import slide3 from "@assets/3_1751298558708.jpeg";
import slide7 from "@assets/7_1751298558701.jpeg";
import slide4 from "@assets/4_1751298558706.jpeg";
import slide5 from "@assets/5_1751298558698.jpeg";
import slide6 from "@assets/6_1751298558703.jpeg";
import slide9 from "@assets/9_1751298558714.jpeg";

const slides = [
  {
    image: slide1,
    title: "Community Permaculture Gardens",
    description: "Building sustainable food systems in refugee communities"
  },
  {
    image: slide2,
    title: "Soil Regeneration Techniques",
    description: "Transforming degraded land into fertile growing spaces"
  },
  {
    image: slide3,
    title: "Water Harvesting Systems",
    description: "Collecting and storing rainwater for dry season farming"
  },
  {
    image: slide7,
    title: "Composting and Soil Building",
    description: "Creating nutrient-rich soil from organic waste"
  },
  {
    image: slide4,
    title: "Agroforestry Integration",
    description: "Combining trees with crops for sustainable yields"
  },
  {
    image: slide5,
    title: "Mushroom Cultivation",
    description: "Sustainable protein production using local materials"
  },
  {
    image: slide6,
    title: "Natural Building Techniques",
    description: "Eco-friendly construction using earth and natural materials"
  },
  {
    image: slide9,
    title: "Livelihood Development",
    description: "Creating economic opportunities through sustainable practices"
  }
];

interface HeroSlideshowProps {
  children: React.ReactNode;
}

export default function HeroSlideshow({ children }: HeroSlideshowProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlaying(false); // Stop auto-play when user interacts
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlaying(false); // Stop auto-play when user interacts
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Slideshow */}
      <div className="absolute inset-0 z-0">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            {/* Dark overlay for better text readability */}
            <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          </div>
        ))}
      </div>

      {/* Slide Navigation Controls */}
      <div className="absolute top-1/2 left-4 transform -translate-y-1/2 z-20">
        <button
          onClick={prevSlide}
          className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors backdrop-blur-sm"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
      </div>

      <div className="absolute top-1/2 right-4 transform -translate-y-1/2 z-20">
        <button
          onClick={nextSlide}
          className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors backdrop-blur-sm"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentSlide
                ? "bg-white"
                : "bg-white/40 hover:bg-white/60"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {children}
      </div>

      {/* Current Slide Information */}
      <div className="absolute bottom-20 left-6 z-20 text-white max-w-md">
        <h3 className="text-lg font-semibold mb-1">
          {slides[currentSlide].title}
        </h3>
        <p className="text-sm opacity-90">
          {slides[currentSlide].description}
        </p>
      </div>
    </div>
  );
}