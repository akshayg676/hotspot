import Image from "next/image";
import Link from "next/link";
import React from "react";
import logo from "../public/logo.png";
type Props = {};

const Header = (props: Props) => {
  return (
    <header className="flex justify-between p-5 max-w-7xl mx-auto">
      <div className="flex items-center space-x-9">
        <Link href="/">
          <Image
            className="object-contain cursor-pointer"
            width="120px"
            height="100px"
            src={logo}
          />
        </Link>
        <div className="hidden md:inline-flex items-center space-x-5">
          <h2>About</h2>
          <h2>Contact</h2>
        </div>
      </div>
      <div className="flex items-center space-x-5 text-green-600">
        <h3>Sign In</h3>
        <h3 className="border px-4 py-1 rounded-full border-green-600">
          Get Started
        </h3>
      </div>
    </header>
  );
};

export default Header;
