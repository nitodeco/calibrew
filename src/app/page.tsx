"use client";

import { FC } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CalibrationPage } from "@/components/pages/calibration";

const Home: FC = () => {
  return (
    <div className="grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-screen pb-8 gap-8 sm:p-2 font-[family-name:var(--font-geist-sans)]">
      <Header />
      <main className="w-full">
        <CalibrationPage />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
