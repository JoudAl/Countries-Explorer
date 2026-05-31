import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import CountriesPage from "./pages/CountriesPage.jsx";
import CountryPage from "./pages/CountryPage.jsx";
import VisitedPage from "./pages/VisitedPage.jsx";

function App() {
  const [filters, setFilters] = useState({
    regions: [],
    search: "",
    sortBy: "name-asc",
  });

  const [visitedCodes, setVisitedCodes] = useState(() => {
    const saved = localStorage.getItem("visited-countries");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("visited-countries", JSON.stringify(visitedCodes));
  }, [visitedCodes]);

  function toggleVisited(code) {
    setVisitedCodes((prev) =>
      prev.includes(code)
        ? prev.filter((item) => item !== code)
        : [...prev, code]
    );
  }

  return (
    <>
      <Navbar />
      <main className="container">
        <Routes>
          <Route
            path="/"
            element={<LandingPage filters={filters} setFilters={setFilters} />}
          />
          <Route
            path="/countries"
            element={
              <CountriesPage
                filters={filters}
                visitedCodes={visitedCodes}
                toggleVisited={toggleVisited}
              />
            }
          />
          <Route
            path="/country/:code"
            element={
              <CountryPage
                visitedCodes={visitedCodes}
                toggleVisited={toggleVisited}
              />
            }
          />
          <Route
            path="/visited"
            element={
              <VisitedPage
                visitedCodes={visitedCodes}
                toggleVisited={toggleVisited}
              />
            }
          />
          <Route path="*" element={<p>Page not found.</p>} />
        </Routes>
      </main>
    </>
  );
}

export default App;