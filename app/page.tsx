import Header from "@/components/layouts/Header";
import Hero from "./components/sections/Hero";
import Beenbo from "./components/sections/Beenbo";
import FallenText from "./components/sections/FallenText";
import Test from "./components/sections/Test";
import Posts from "./components/sections/Posts";
import Info from "./components/sections/Info";
import SwapCards from "./components/sections/SwapCards";
import Calculator from "./components/sections/Calculator";
import Footer from "@/components/layouts/Footer";
import { Metadata } from "next";
import { getTranslate } from "@/tolgee/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslate();

  return {
    title: t("landing.title"),
    description: "beenbo",
  };
}

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <Beenbo />
      <FallenText />
      <Test />
      <Posts />
      <Info />
      <Calculator />
      <SwapCards />
      <Footer />
    </>
  );
}
