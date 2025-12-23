import Header from "./components/layout/Header/Header";
import Footer from "./components/layout/Footer";
import SkillSection from "./components/layout/Main/Skills/SkillSection";
import ProjectSection from "./components/layout/Main/Skills/ProjectSection";
import "./styles/reset.scss";
import "./styles/template.scss";
import "./App.scss";

function App() {
  return (
    <>
      <Header />
      <main className="main mgy40">
        <SkillSection />
        <ProjectSection />
      </main>
      <Footer />
    </>
  );
}

export default App;
