import { FaEarlybirds } from "react-icons/fa6";

interface FormHeaderProps {
  title: string;
  description: string;
}
export default function FormHeader({ title, description }: FormHeaderProps) {
  return (
    <div className="flex flex-col items-center text-center mb-8">
      <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-linear-to-br from-[#4e85fa] to-[#2e1dea] text-primary-foreground font-black text-xl mb-4 shadow-md tracking-wider">
        <FaEarlybirds className="w-9 h-9" />
      </div>
      <h1 className="text-2xl font-bold tracking-tight ">{title}</h1>
      <p className="text-sm text-muted-foreground mt-1.5">{description}</p>
    </div>
  );
}
