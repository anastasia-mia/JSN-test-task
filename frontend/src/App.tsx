import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout/Layout.tsx";
import { HomePage } from "./pages/HomePage/HomePage.tsx";
import { SuperheroFormPage } from "./pages/SuperheroFormPage/SuperheroFormPage.tsx";
import { SuperheroDetailsPage } from "./pages/SuperheroDetailsPage/SuperheroDetailsPage.tsx";
import { GreetingPage } from "./pages/GreetingPage/GreetingPage.tsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GreetingPage />} />
        <Route path="/superheroes" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="new" element={<SuperheroFormPage />} />
          <Route path=":id" element={<SuperheroDetailsPage />} />
          <Route path=":id/edit" element={<SuperheroFormPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
