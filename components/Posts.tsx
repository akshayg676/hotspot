import Link from "next/link";
import React from "react";
import { Post } from "../typings.d";
import { urlFor } from "../sanity";
interface Props {
  posts: [Post];
}

const Posts = ({ posts }: Props) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 p-2 md:p-6">
      {posts.map((post) => (
        <Link key={post._id} href={`post/${post.slug.current}`}>
          <div className="border rounded-lg group cursor-pointer overflow-hidden  text-[#f0f0f0] bg-[#357938]">
            <img
              className="h-60 w-full object-cover group-hover:scale-105 transition-transform duration-200 ease-in-out"
              src={urlFor(post.mainImage).url()!}
              alt=""
            />
            <div className="flex justify-between gap-5 p-5">
              <div>
                <div className="flex justify-between gap-2 pb-4">
                  <p className="text-lg font-bold ">{post.title}</p>
                  <img
                    className="h-12 w-12 rounded-full"
                    src={urlFor(post.author.image).url()!}
                    alt=""
                  />
                </div>

                <p className="text-xs">
                  {post.description} by{" "}
                  <span className="underline decoration-[#f0f0f0] decoration-1 font-bold">
                    {post.author.name}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Posts;
