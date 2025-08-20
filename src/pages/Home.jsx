import Hero from "../components/Hero";
import MobileCategoryChips from "../components/MobileCategoryChips";
import Deals from "../components/Deals";
import HomeOutdoor from "../components/HomeOutdoor";
import ConsumerElectronics from "../components/ConsumerElectronics";
import QuoteBanner from "../components/QuoteBanner";
import FeaturedProducts from "../components/FeaturedProducts";
import Suppliers from "../components/Suppliers";
import Services from "../components/Services";
import Newsletter from "../components/Newsletter";


export default function Home() {
  return (
    <main className="bg-gray-50">
      <MobileCategoryChips />
      <Hero />
      <Deals />
      <HomeOutdoor />
      <ConsumerElectronics />
      <QuoteBanner />
      <FeaturedProducts />
      <Suppliers />
      <Services />
      <Newsletter />
    </main>
  );
}
