import ScrollEffects from "@/components/ScrollEffects";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import StatsBar from "@/components/StatsBar";
import SongsSection from "@/components/SongsSection";
import AchievementsSection from "@/components/AchievementsSection";
import Endorsements from "@/components/Endorsements";
import ConnectSection from "@/components/ConnectSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <ScrollEffects />
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Hero />
        <StatsBar />
        <SongsSection />
        <AchievementsSection />
        <Endorsements />
        <ConnectSection />
      </main>
      <Footer />
    </>
  );
}
