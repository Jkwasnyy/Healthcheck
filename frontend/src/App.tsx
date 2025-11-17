import { Navbar, Footer } from "./components/molecules";
import { Main, Container } from "./components/atoms";

const App = () => {
  return (
    <>
      <Navbar />
      <Main>
        <Container className="text-center">Main content</Container>
      </Main>
      <Footer />
    </>
  );
};

export default App;
