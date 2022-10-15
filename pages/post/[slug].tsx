import { GetStaticProps } from "next";
import React from "react";
import { sanityClient, urlFor } from "../../sanity";
import { Post } from "../../typings.d";

interface Props {
  postDetails: Post;
}

const Post = ({ postDetails }: Props) => {
  return <div>Post</div>;
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
