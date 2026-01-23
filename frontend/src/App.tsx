import { Navbar, Footer } from "./components/molecules";
import { useAppSelector } from "./store/hooks";
import {
  GenderTemplate,
  BodyDetailsTemplate,
  BmiTemplate,
  MedicalParametresTemplate,
  ResultTemplate,
} from "./components/templates";
import { useState } from "react";

type Medical = Record<string, string | number | boolean>;

const App = () => {
  const count = useAppSelector((state) => state.counter.value);
  const [medical, setMedical] = useState<Medical>({});

  return (
    <>
      <Navbar />
      {count === 0 && <GenderTemplate />}
      {count === 1 && <BodyDetailsTemplate />}
      {count === 2 && <BmiTemplate />}
      {count === 3 && <MedicalParametresTemplate setValues={setMedical} />}
      {count === 4 && <ResultTemplate values={medical} />}
      <Footer />
    </>
  );
};

export default App;
