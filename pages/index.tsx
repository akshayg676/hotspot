import type { NextPage } from "next";
import Image from "next/image";
import Banner from "../components/Banner";
import Header from "../components/Header";

const Home: NextPage = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <Header />
      <Banner />
    </div>
  );
};

export default Home;
