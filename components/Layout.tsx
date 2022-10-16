import React, { ReactNode } from "react";
import Head from "next/head";
import Footer from "./Footer";

type Props = {
  children: React.ReactNode;
};

const Layout = ({ children }: Props) => {
  return (
    <div>
      <Head>
        <title>Hot Spot</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {children}
      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default Layout;
