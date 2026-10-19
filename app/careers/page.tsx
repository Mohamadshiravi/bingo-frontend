import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";
import Hero from "./components/sections/Hero";
import Beenbo from "./components/sections/Beenbo";
import Info from "./components/sections/Info";
import DownloadApp from "./components/sections/DownloadApp";
import Plans from "./components/sections/Plans";
import Comments from "./components/sections/Comments";
import FAQ from "./components/sections/FAQ";

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <Beenbo />
      <Info />
      <DownloadApp />
      <Plans />
      <Comments />
      <FAQ />
      <Footer />
    </>
  );
}
