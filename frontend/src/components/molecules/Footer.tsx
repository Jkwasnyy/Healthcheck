import { Container } from "../atoms";
import { FaReact } from "react-icons/fa";
import { SiFastapi } from "react-icons/si";

const Footer = () => {
  return (
    <footer className="h-50 sm:h-30 lg:h-25">
      <Container className="flex h-full items-center justify-center border-t border-t-neutral-200 text-sm leading-6 text-neutral-300 select-none md:text-base">
        <p>
          Healthcheck - an application for measuring the risk of a selected
          disease, created by using React <FaReact className="inline" /> +
          FastAPI <SiFastapi className="inline" /> + LLM.
          <br /> Application created by{" "}
          <a
            href="https://github.com/devkow77"
            target="_blank"
            className="font-semibold"
          >
            Kacper Kowalski
          </a>{" "}
          and{" "}
          <a
            href="https://github.com/Jkwasnyy"
            target="_blank"
            className="font-semibold"
          >
            Jakub Kwaśniak
          </a>{" "}
          for University of Rzeszów project purposes.
        </p>
      </Container>
    </footer>
  );
};

export default Footer;
