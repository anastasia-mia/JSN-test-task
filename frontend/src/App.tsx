import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import {Layout} from "./components/Layout/Layout.tsx";
import {HomePage} from "./Pages/HomePage/HomePage.tsx";
import {SuperheroFormPage} from "./Pages/SuperheroFormPage/SuperheroFormPage.tsx";
import {SuperheroDetailsPage} from "./Pages/SuperheroDetailsPage/SuperheroDetailsPage.tsx";
import {GreetingPage} from "./Pages/GreetingPage/GreetingPage.tsx";

function App() {

  return (
    <>
        <Router>
            <Routes>
                <Route path="/" element={<GreetingPage />} />
            </Routes>
            <Route path="/superheroes" element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path="new" element={<SuperheroFormPage mode="create" />} />
                <Route path=":id" element={<SuperheroDetailsPage />} />
                <Route path=":id/edit" element={<SuperheroFormPage mode="edit" />} />
            </Route>
        </Router>
    </>
  )
}

export default App
