import { Navbar, Footer } from "./components/molecules";
import { useAppSelector } from "./store/hooks";
import { GenderTemplate } from "./components/templates";

const App = () => {
  const count = useAppSelector((state) => state.counter.value);

  return (
    <>
      <Navbar />
      {count == 0 && <GenderTemplate />}
      <Footer />
    </>
  );
};

export default App;
