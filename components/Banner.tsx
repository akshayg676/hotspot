import React from "react";

import logo from "../public/banner.png";

const Banner = () => {
  return (
    <div className="flex items-center justify-between text-[#f0f0f0] bg-[#48A14D] border-y border-black py-10 lg:py-5">
      <div className="px-10 space-y-5">
        <h1 className="text-6xl max-w-xl font-serif">
          <span className="underline decoration-[#f0f0f0] decoration-4">
            Hot Spot
          </span>
          &nbsp;is a place to read, write and connect
        </h1>
        <h2 className="text-xl">
          It's easy and free to post your thinking on any topic and connect with
          millions of readers
        </h2>
      </div>
      <div className="px-10 space-x-5">
        <img
          className="hidden md:inline-flex h-32 lg:h-32"
          src={logo.src}
          alt=""
        />
      </div>
    </div>
  );
};

export default Banner;
