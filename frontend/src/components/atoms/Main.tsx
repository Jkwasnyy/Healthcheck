import { Container } from "../atoms";

interface Props {
  children: React.ReactNode;
  className?: string;
}

const Main = ({ children, className }: Props) => {
  return (
    <main className="flex h-[calc(100vh-272px)] items-center justify-center sm:h-[calc(100vh-192px)] lg:h-[calc(100vh-172px)]">
      <Container className={className}>{children}</Container>
    </main>
  );
};

export default Main;
