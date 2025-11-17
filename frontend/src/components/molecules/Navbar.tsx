import { ProgressBar, Container } from "../atoms";

type handleProgressBar = () => number;
type handleTextHeader = () => string;

const Navbar = () => {
  const store = 0;

  const handleProgressBar: handleProgressBar = () => {
    return store * 20;
  };

  const handleTextHeader: handleTextHeader = () => {
    return [
      "Choose one",
      "Your body details",
      "Your BMI result",
      "Your ilness",
      "Hospital docs",
      "Your result",
    ][store];
  };

  return (
    <nav className="h-18 w-full py-6">
      <Container className="flex items-center justify-between text-sm lg:text-base">
        <h1 className="font-bold">{handleTextHeader()}</h1>
        <ProgressBar value={handleProgressBar()} />
      </Container>
    </nav>
  );
};

export default Navbar;
