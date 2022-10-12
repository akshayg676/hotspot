import type { NextPage } from "next";
import Image from "next/image";
import { Banner, Header, Posts } from "../components";
import { sanityClient, urlFor } from "../sanity";
import { Post } from "../typings.d";
interface Props {
  posts: [Post];
}
const Home = ({ posts }: Props) => {
  return (
    <div className="max-w-7xl mx-auto">
      <Header />
      <Banner />
      <Posts posts={posts} />
    </div>
  );
};

export default Home;

export const getServerSideProps = async () => {
  const postQuery = `*[_type == 'post']{
_id,
title,
author-> {
  name,
  image
},
description,
mainImage,
slug,
}`;
  const posts = await sanityClient.fetch(postQuery);
  return {
    props: {
      posts,
    },
  };
};
