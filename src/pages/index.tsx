import Header from "@/components/Header";
import Hero from "@/components/Hero";
import RecommendationFeed from "@/components/RecommendationFeed";
import FeaturedSection from "@/components/FeaturedSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <RecommendationFeed />
      <FeaturedSection />
      <Footer />
    </div>
  );
};

export default Index;
