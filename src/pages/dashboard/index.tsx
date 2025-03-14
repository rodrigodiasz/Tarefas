import { GetServerSideProps } from "next";
import Head from "next/head";
import { FiShare2 } from "react-icons/fi";
import { FaTrash } from "react-icons/fa";
import { ChangeEvent, FormEvent, useState, useEffect } from "react";
import toast from "react-hot-toast";
import Link from "next/link";

import { getSession } from "next-auth/react";
import Textarea from "@/components/textarea/textarea";

import { db } from "@/services/firebaseConnection";

import {
  addDoc,
  collection,
  query,
  orderBy,
  where,
  onSnapshot,
  doc,
  deleteDoc,
} from "firebase/firestore";

interface HomeProps {
  user: {
    email: string;
  };
}

interface TaskProps {
  id: string;
  created: string;
  public: boolean;
  tarefa: string;
  user: string;
}

export default function Dashboard({ user }: HomeProps) {
  const [input, setInput] = useState("");
  const [publicTasks, setPublicTask] = useState(false);
  const [tasks, setTasks] = useState<TaskProps[]>([]);

  async function handleShare(id: string) {
    await navigator.clipboard.writeText(`
      ${process.env.NEXT_PUBLIC_URL}${id}
      `);
    toast.success("URL Copiada com sucesso!");
  }

  async function handleDeleteTask(id: string) {
    const docRef = doc(db, "tarefas", id);
    await deleteDoc(docRef);
    toast.success("Task Removida com sucesso!");
  }

  useEffect(() => {
    async function loadTarefas() {
      const tarefasRef = collection(db, "tarefas");
      const q = query(
        tarefasRef,
        orderBy("created", "desc"),
        where("user", "==", user?.email)
      );

      onSnapshot(q, (snapshot) => {
        let lista = [] as TaskProps[];

        snapshot.forEach((doc) => {
          lista.push({
            id: doc.id,
            tarefa: doc.data().tarefa,
            created: doc.data().created,
            user: doc.data().user,
            public: doc.data().public,
          });
        });
        setTasks(lista);
      });
    }
    loadTarefas();
  }, [user?.email]);

  function handleChancePublic(event: ChangeEvent<HTMLInputElement>) {
    setPublicTask(event.target.checked);
  }

  async function handleRegisterTask(event: FormEvent) {
    event.preventDefault();

    if (input === "") return;

    try {
      await addDoc(collection(db, "tarefas"), {
        tarefa: input,
        created: new Date(),
        user: user?.email,
        public: publicTasks,
      });
      toast.success("Tarefa Cadastrada com sucesso!");
      setInput("");
      setPublicTask(false);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div>
      <Head>
        <title>Meu painel de tarefas</title>
      </Head>
      <main className="w-full flex items-center flex-col">
        <section className="flex items-center w-full container p-10 pt-30 sm:pt-10 mx-auto">
          <div className="w-full">
            <h1 className="text-2xl mb-2 font-bold">Qual sua tarefa?</h1>

            <form onSubmit={handleRegisterTask}>
              <Textarea
                placeholder="Digite qual sua tarefa..."
                value={input}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                  setInput(e.target.value)
                }
              />
              <div className="flex mt-2 mb-2 items-center">
                <input
                  className="mr-2 w-5 h-5"
                  type="checkbox"
                  checked={publicTasks}
                  onChange={handleChancePublic}
                />
                <label>Deixar Tarefa Publica</label>
              </div>

              <button
                className="cursor-pointer w-full bg-blue-500 mt-5 rounded-md py-2"
                type="submit"
              >
                Registrar
              </button>
            </form>
          </div>
        </section>
        <section className="mt-2 w-full h-screen bg-white">
          <div className="container mx-auto p-10">
            <h1 className="text-center text-3xl mt-2 mb-4 text-background font-bold">
              Minhas tarefas
            </h1>
            <div className="space-y-4">
              {tasks.map((item) => (
                <article
                  key={item.id}
                  className="border border-[#909090] p-3 text-background rounded-md"
                >
                  <div className="flex flex-col gap-2">
                    {item.public && (
                      <div className="flex gap-2">
                        <label className="px-2 rounded-md text-white p-1 bg-sky-600">
                          Publico
                        </label>
                        <button
                          onClick={() => handleShare(item.id)}
                          className="cursor-pointer"
                        >
                          <FiShare2 size={22} color="#3183ff" />
                        </button>
                      </div>
                    )}
                    <div className="flex justify-between">
                      {item.public ? (
                        <Link href={`/task/${item.id}`}>
                          <p className="whitespace-break-spaces">
                            {item.tarefa}
                          </p>
                        </Link>
                      ) : (
                        <p className="whitespace-break-spaces">{item.tarefa}</p>
                      )}
                      <button onClick={() => handleDeleteTask(item.id)} className="cursor-pointer">
                        <FaTrash size={24} color="red" />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req });

  if (!session?.user) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      user: {
        email: session?.user?.email,
      },
    },
  };
};
