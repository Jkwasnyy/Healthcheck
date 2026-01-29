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
import { Register, Login, Account } from "./components/pages/index";
import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";

type Medical = Record<string, string | number | boolean>;

const Home = () => {
  const count = useAppSelector((state) => state.counter.value);
  const [medical, setMedical] = useState<Medical>({});

  return (
    <>
      {count === 0 && <GenderTemplate />}
      {count === 1 && <BodyDetailsTemplate />}
      {count === 2 && <BmiTemplate />}
      {count === 3 && <MedicalParametresTemplate setValues={setMedical} />}
      {count === 4 && <ResultTemplate values={medical} />}
    </>
  );
};

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/account" element={<Account />} />
      </Routes>
      <Toaster position="top-center" />
      <Footer />
    </>
  );
};

export default App;
