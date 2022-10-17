import { GetStaticProps } from "next";
import React, { useState } from "react";
import { Header } from "../../components";
import { sanityClient, urlFor } from "../../sanity";
import { Post } from "../../typings.d";
import PortableText from "react-portable-text";
import moment from "moment";
import { useForm, SubmitHandler } from "react-hook-form";

interface Props {
  postDetails: Post;
}
interface IFormInput {
  _id: string;
  name: string;
  email: string;
  comment: string;
}
const Post = ({ postDetails }: Props) => {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    fetch("/api/createComment", {
      method: "POST",
      body: JSON.stringify(data),
    })
      .then(() => {
        console.log(data);
        setSubmitted(true);
      })
      .catch((err) => {
        console.log(err);
        setSubmitted(false);
      });
  };
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
      <hr className="max-w-lg my-5 mx-auto border border-[#3a8d5f]" />
      {submitted ? (
        <div className="flex flex-col py-10 my-10 bg-[#3a8d5f] text-white max-w-2xl mx-auto">
          <h3 className="text-3xl font-bold">
            Thank you for submitting your comment!
          </h3>
          <p>Once it has been approved, it will appear below</p>
        </div>
      ) : (
        <form
          className="flex flex-col p-5 max-w-2xl mx-auto mb-10"
          onSubmit={handleSubmit(onSubmit)}
        >
          <h3 className="text-sm text-[#2c8052]">Enjoyed this article?</h3>
          <h4 className="text-3xl font-bold">Leave a comment below!</h4>
          <hr className="py-3 mt-2" />
          <input
            {...register("_id")}
            type="hidden"
            name="_id"
            value={postDetails._id}
          />
          <label className="block mb-5">
            <span className=" text-gray-700">Name</span>
            <input
              {...register("name", { required: true })}
              className="shadow border rounded py-2 px-3 form-input mt-1 block w-full ring-[#5cdb95] outline-none focus:ring "
              placeholder="John Appleseed"
              type="text"
            />
          </label>
          <label className="block mb-5">
            <span className=" text-gray-700">Email</span>
            <input
              {...register("email", { required: true })}
              className="shadow border rounded py-2 px-3 form-input mt-1 block w-full ring-[#5cdb95] outline-none focus:ring "
              placeholder="John Appleseed"
              type="text"
            />
          </label>
          <label className="block mb-5">
            <span className=" text-gray-700">Comment</span>
            <textarea
              {...register("comment", { required: true })}
              className="shadow border rounded py-2 px-3 form-textarea mt-1 block w-full ring-[#5cdb95] outline-none focus:ring"
              placeholder="John Appleseed"
              rows={8}
            />
          </label>

          {/* errors will return when field validation fails  */}
          <div className="flex flex-col p-5">
            {errors.name && (
              <span className="text-red-500">This Name field is required</span>
            )}
            {errors.email && (
              <span className="text-red-500">This Email field is required</span>
            )}
            {errors.comment && (
              <span className="text-red-500">
                This Comment field is required
              </span>
            )}
          </div>
          <input
            type="submit"
            className="shadow bg-green-400 hover:bg-green-300 focus:shadow-outline focus:outline-none
          text-white font-bold py-2 px-4 rounded cursor-pointer tracking-widest"
          />
        </form>
      )}
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
