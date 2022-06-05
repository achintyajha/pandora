import React from "react";
import { GetServerSideProps } from "next";
import ReactMarkdown from "react-markdown";
import Layout from "../../components/Layout";
import Router from "next/router";
import { PostProps } from "../../components/Post";
import prisma from "../../lib/prisma";
import { inDevEnvironment } from "../../lib/DevEnv";

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  let post = await prisma.post.findUnique({
    where: {
      id: Number(params?.id) || -1,
    },
  });
  post = JSON.parse(JSON.stringify(post));
  return {
    props: post,
  };
};

async function deletePost(id: number): Promise<void> {
  await fetch(`http://localhost:3000/api/post/${id}`, {
    method: "DELETE",
  });
  await Router.push("/");
}

const Post: React.FC<PostProps> = (props) => {
  let title = props.title;

  return (
    <Layout>
      <div>
        <>
          <h1>{title}</h1>
          <div className="space-x-2 mt-5">
            {inDevEnvironment && (
              <button onClick={() => deletePost(props.id)}>
                <a>Delete</a>
              </button>
            )}
          </div>
          <div className="entry">
            <ReactMarkdown children={props.content} />
          </div>
        </>
      </div>
    </Layout>
  );
};

export default Post;
