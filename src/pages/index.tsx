import Image from "next/image";
import heroImg from "../../public/assets/hero.png";
import Head from "next/head";
import { GetStaticProps } from "next";
import { collection, getDocs } from "firebase/firestore";

import { db } from "@/services/firebaseConnection";

interface HomeProps {
  posts: number;
  comments: number;
}

export default function Home({posts, comments}: HomeProps) {
  return (
    <div>
      <Head>
        <title>Tarefas+</title>
      </Head>
      <main className="container bg-background w-full min-h-screen flex justify-center items-center flex-col mx-auto">
        <div className="flex flex-col items-center justify-center">
          <Image
            className="max-w-[80%] sm:max-w-[480px] object-contain w-auto h-auto"
            alt=""
            src={heroImg}
            priority
          />
          <h1 className="text-white text-center m-10 text-2xl sm:text-4xl font-bold leading-[<150px>]">
            Sistema feito para voce organizar <br /> seus estudos e tarefas
          </h1>
          <div className="flex flex-col sm:flex-row items-center justify-around gap-10">
            <section className="bg-white w-50 sm:text-center text-background px-[44px] py-[14px] rounded-md transition-transform duration-400 hover:scale-[1.08]">
              <span>+{posts} posts</span>
            </section>
            <section className="bg-white w-50 whitespace-nowrap text-background px-[44px] py-[14px] rounded-md transition-transform duration-400 hover:scale-[1.08]">
              <span>+{comments} comentarios</span>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const commentRef = collection(db, "comments");
  const postRef = collection(db, "tarefas");
  const commentSnapshot = await getDocs(commentRef);
  const postSnapshot = await getDocs(postRef);
  return {
    props: {
      posts: postSnapshot.size || 0,
      comments: commentSnapshot.size || 0,
    },
    revalidate: 60,
  };
};
