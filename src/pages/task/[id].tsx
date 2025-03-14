import Head from "next/head";
import { ChangeEvent, FormEvent, useState } from "react";
import { useSession } from "next-auth/react";
import { GetServerSideProps } from "next";
import { FaTrash } from "react-icons/fa";

import { db } from "@/services/firebaseConnection";
import {
  doc,
  collection,
  query,
  where,
  getDoc,
  addDoc,
  getDocs,
  deleteDoc,
} from "firebase/firestore";

import Textarea from "@/components/textarea/textarea";

interface TaskProps {
  item: {
    tarefa: string;
    public: boolean;
    created: string;
    user: string;
    taskId: string;
  };
  allComents: CommentProps[];
}

interface CommentProps {
  id: string;
  comment: string;
  taskId: string;
  user: string;
  name: string;
}

export default function Task({ item, allComents }: TaskProps) {
  const { data: session } = useSession();
  const [input, setInput] = useState("");
  const [comments, setComments] = useState<CommentProps[]>(allComents || []);

  async function handleComment(event: FormEvent) {
    event.preventDefault();
    if (input === "") return;

    if (!session?.user?.email || !session?.user.name) return;

    try {
      const docRef = await addDoc(collection(db, "comments"), {
        comment: input,
        created: new Date(),
        user: session?.user?.email,
        name: session?.user?.name,
        taskId: item?.taskId,
      });

      const data = {
        id: docRef.id,
        comment: input,
        user: session?.user.email,
        name: session?.user.name,
        taskId: item?.taskId,
      };
      setComments((oldItems) => [...oldItems, data]);
      setInput("");
    } catch (err) {
      console.log(err);
    }
  }

  async function handleDeleteComment(id: string) {
    try {
      const docRef = doc(db, "comments", id)
      await deleteDoc(docRef)
      const deleteComment = comments.filter((item) => item.id !== id)
      setComments(deleteComment)
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <div className="bg-white min-h-screen">
      <Head>
        <title>Tarefa - Detahles da tarefa</title>
      </Head>
      <main className="container mx-auto p-10">
        <h1 className="text-background text-3xl font-bold">Tarefa</h1>
        <article className="border bg-white border-[#909090] p-3 mt-5 text-background rounded-md">
          <p className="whitespace-break-spaces">{item.tarefa}</p>
        </article>
      </main>

      <section className="container mx-auto p-10">
        <h2 className="text-background text-2xl font-bold">
          Deixar comentario
        </h2>

        <form className="flex flex-col" onSubmit={handleComment}>
          <Textarea
            placeholder="Digite seu comentario..."
            value={input}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              setInput(e.target.value)
            }
            className="border-1 border-[#909090] rounded-md p-2 text-background h-[160px]"
          />
          <button
            disabled={!session?.user}
            className="px-3 py-3 rounded-md bg-sky-600 mt-2 cursor-pointer disabled:bg-sky-300 disabled:cursor-not-allowed"
          >
            Comentar
          </button>
        </form>
      </section>

      <section className="container mx-auto p-10 bg-white">
        <h2 className="text-2xl text-background font-bold">
          Todos Comentarios
        </h2>
        {comments.length === 0 && (
          <span>Nenhum comentario foi encontrado...</span>
        )}

        {comments.map((item) => (
          <article
            className="flex flex-col mt-5 border border-[#909090] p-3 text-background rounded-md"
            key={item.id}
          >
            <div className="flex gap-4 mb-2">
              <label className="bg-[#c4c4c4] px-2 py-1 rounded-md">
                {item.name}
              </label>
              {item.user === session?.user?.email && (
                <button className="cursor-pointer" onClick={() => handleDeleteComment(item.id)}>
                  <FaTrash size={18} color="red" />
                </button>
              )}
            </div>
            <p>{item.comment}</p>
          </article>
        ))}
      </section>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const id = params?.id as string;

  const docRef = doc(db, "tarefas", id);

  const q = query(collection(db, "comments"), where("taskId", "==", id));
  const snapshotComments = await getDocs(q);

  let allComments: CommentProps[] = [];
  snapshotComments.forEach((doc) => {
    allComments.push({
      id: doc.id,
      comment: doc.data().comment,
      user: doc.data().user,
      name: doc.data().name,
      taskId: doc.data().taskId,
    });
  });

  const snapshot = await getDoc(docRef);

  if (snapshot.data() === undefined) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  if (!snapshot.data()?.public) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const miliseconds = snapshot.data()?.created?.secons * 1000;

  const task = {
    tarefa: snapshot.data()?.tarefa,
    public: snapshot.data()?.public,
    created: new Date(miliseconds).toLocaleDateString(),
    user: snapshot.data()?.user,
    taskId: id,
  };

  return {
    props: {
      item: task,
      allComents: allComments,
    },
  };
};
