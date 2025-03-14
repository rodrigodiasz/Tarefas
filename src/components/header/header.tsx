import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Header() {
  const { data: session, status } = useSession();

  return (
    <header className="container mx-auto w-full sm:h-[76px] h-[auto] flex items-center justify-center p-10">
      <section className="container mx-auto pt-2">
        <nav className="sm:flex-row flex flex-col justify-between">
          <div className="sm:flex-row flex flex-col gap-5 items-center mb-5 sm:mb-0">
            <Link href={"/"}>
              <h1 className="text-white text-4xl font-bold">
                Tarefas<span className="text-[#ea3140]">+</span>
              </h1>
            </Link>
            {session?.user && (
              <Link
                className="bg-white text-background py-[4px] px-[14px] rounded-md my-0 mx-[14px]"
                href={"/dashboard"}
              >
                Meu Painel
              </Link>
            )}
          </div>
          {status === "loading" ? (
            <></>
          ) : session ? (
            <button
              className="border-2 border-white py-[8px] px-[32px] font-bold rounded-full cursor-pointer hover:bg-white hover:text-background transition-transform duration-400 hover:scale-[1.08]"
              onClick={() => signOut()}
            >
              {session?.user?.name}
            </button>
          ) : (
            <button
              className="border-2 border-white py-[8px] px-[32px] font-bold rounded-full cursor-pointer hover:bg-white hover:text-background transition-transform duration-400 hover:scale-[1.08]"
              onClick={() => signIn("google")}
            >
              Acessar
            </button>
          )}
        </nav>
      </section>
    </header>
  );
}
