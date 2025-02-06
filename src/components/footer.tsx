import { FaGithub } from "react-icons/fa";
import { FC } from "react";

export const Footer: FC = () => {
  return (
    <footer className="row-start-3 flex gap-4 flex-wrap items-center justify-center flex-col">
      <div className="flex flex-row items-center">
        <a
          href="https://github.com/nitodeco/calibrew"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
        >
          GitHub
          <FaGithub className="w-5 h-5" />
        </a>
      </div>
      <div className="text-sm text-gray-500">
        © {new Date().getFullYear()} Nico Möhn.{" "}
        <a
          href="https://github.com/nitodeco/calibrew/blob/main/LICENSE"
          target="_blank"
          rel="noopener noreferrer"
        >
          MIT License.
        </a>
      </div>
    </footer>
  );
};
