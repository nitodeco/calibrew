import { ModeToggle } from "@/components/mode-toggle";
import { FaGithub } from "react-icons/fa";
import { FC } from "react";

export const Header: FC = () => {
  return (
    <header className="w-full max-w-6xl flex items-center justify-between p-4">
      <h1 className="text-2xl font-bold">calibrew</h1>
      <div className="flex items-center gap-4">
        <ModeToggle />
        <a
          href="https://github.com/nitodeco/calibrew"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:opacity-60"
        >
          <FaGithub className="w-5 h-5" />
        </a>
      </div>
    </header>
  );
};
