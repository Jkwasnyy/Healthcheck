import { Container } from "../atoms";

interface Props {
  children: React.ReactNode;
  className?: string;
}

const Main = ({ children, className }: Props) => {
  return (
    <main className="flex min-h-[calc(100vh-272px)] items-center justify-center py-8 sm:min-h-[calc(100vh-192px)] lg:min-h-[calc(100vh-172px)]">
      <Container className={className}>{children}</Container>
    </main>
  );
};

export default Main;
