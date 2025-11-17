import { Navbar, Footer } from "./components/molecules";
import { useAppSelector } from "./store/hooks";
import {
  GenderTemplate,
  BodyDetailsTemplate,
  BmiTemplate,
  IlnessTemplate,
} from "./components/templates";

const App = () => {
  const count = useAppSelector((state) => state.counter.value);

  return (
    <>
      <Navbar />
      {count == 0 && <GenderTemplate />}
      {count == 1 && <BodyDetailsTemplate />}
      {count == 2 && <BmiTemplate />}
      {count == 3 && <IlnessTemplate />}
      <Footer />
    </>
  );
};

export default App;
