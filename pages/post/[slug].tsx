import { GetStaticProps } from "next";
import React from "react";
import { Header } from "../../components";
import { sanityClient, urlFor } from "../../sanity";
import { Post } from "../../typings.d";
import PortableText from "react-portable-text";
import moment from "moment";

interface Props {
  postDetails: Post;
}

const Post = ({ postDetails }: Props) => {
  return (
    <div>
      <Header />
      <div className="max-w-5xl mx-auto p-5">
        <img
          className="w-full h-80 object-cover"
          src={urlFor(postDetails.mainImage).url()!}
          alt=""
        />
      </div>

      <article className="max-w-5xl mx-auto p-5">
        <h1 className="text-3xl mt-10 mb-3">{postDetails.title}</h1>
        <h2 className="text-xl font-light text-gray-500 mb-2">
          {postDetails.description}
        </h2>

        <div className="flex items-center space-x-2">
          <img
            className="h-10 w-10 rounded-full"
            src={urlFor(postDetails.author.image).url()!}
            alt=""
          />
          <div className="font-extralight text-sm">
            Blog post by{" "}
            <span className="text-base text-[#05386b] font-normal">
              {postDetails.author.name}
            </span>{" "}
            - Published at {moment.utc(postDetails._createdAt).format("L LT")}
          </div>
        </div>
        <div className="mt-10">
          <PortableText
            dataset={process.env.NEXT_PUBLIC_SANITY_DATASET}
            projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}
            content={postDetails.body}
            serializers={{
              h1: (props: any) => (
                <h1 className="text-2xl font-bold my-5 " {...props} />
              ),
              h2: (props: any) => (
                <h1 className="text-xl font-bold my-5" {...props} />
              ),
              h3: (props: any) => (
                <h1 className="text-xl font-bold my-5" {...props} />
              ),
              li: ({ children }: any) => (
                <li className="ml-4 list-disc">{children}</li>
              ),
              link: ({ href, children }: any) => (
                <a href={href} className="text-blue-500 hover:underline">
                  {children}
                </a>
              ),
            }}
          />
        </div>
      </article>
    </div>
  );
};

export default Post;

export const getStaticPaths = async () => {
  const query = `*[_type == "post"]{
        _id,
        slug{
            current
        }
    }`;
  const posts = await sanityClient.fetch(query);
  const paths = posts.map((post: Post) => ({
    params: { slug: post.slug.current },
  }));

  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const postDetailQuery = `*[_type == "post" && slug.current == $slug][0]{
        _id,
        _createdAt,
        title,
        author->{
            name,
            image
        },
        'comments': *[
            _type == "comment" && post._ref == ^._id && approved == true
        ],
        description,
        mainImage,
        slug,
        body 
    }`;
  const postDetails = await sanityClient.fetch(postDetailQuery, {
    slug: params?.slug,
  });

  if (!postDetails) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      postDetails,
    },
    revalidate: 60,
  };
};
