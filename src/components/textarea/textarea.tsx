import { HTMLProps } from "react";

export default function Textarea({...rest}: HTMLProps<HTMLTextAreaElement>){
  return <textarea className="w-full h-[160px] rounded-md outline-none p-3 bg-white text-background" {...rest}></textarea>
}