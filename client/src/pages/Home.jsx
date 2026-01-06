import React from "react";
import MainBanner from "../components/ui/MainBanner";
import Categories from "../features/shop/components/Categories";
import BestSeller from "../features/shop/components/BestSeller";
import BottomBanner from "../components/ui/BottomBanner";

const Home = () => {
  return (
    <div className="mt-10">
      <MainBanner />
      <Categories />
      <BestSeller />
      <BottomBanner />
    </div>
  );
};

export default Home;
