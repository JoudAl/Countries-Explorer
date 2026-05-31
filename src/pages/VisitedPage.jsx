import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getAllCountries } from "../services/countriesApi.js";

export default function VisitedPage({ visitedCodes, toggleVisited }) {
  // Local state for list data, filters, sorting, and load status.
  const [countries, setCountries] = useState([]);
  const [regionFilter, setRegionFilter] = useState("All");
  const [sortBy, setSortBy] = useState("name-asc");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCountries() {
      try {
        const data = await getAllCountries();
        setCountries(data);
      } catch (err) {
        setError("Could not load visited countries.");
      } finally {
        setLoading(false);
      }
    }

    loadCountries();
  }, []);

  const visitedCountries = useMemo(() => {
    // Filter the loaded countries to only those that are visited.
    let result = countries.filter((country) => visitedCodes.includes(country.cca3));

    if (regionFilter !== "All") {
      result = result.filter((country) => country.region === regionFilter);
    }

    switch (sortBy) {
      case "name-desc":
        result.sort((a, b) => b.name.common.localeCompare(a.name.common));
        break;
      case "population-desc":
        result.sort((a, b) => b.population - a.population);
        break;
      case "population-asc":
        result.sort((a, b) => a.population - b.population);
        break;
      default:
        result.sort((a, b) => a.name.common.localeCompare(b.name.common));
    }

    return result;
  }, [countries, visitedCodes, regionFilter, sortBy]);

  if (loading) return <p>Loading visited countries...</p>;
  if (error) return <p>{error}</p>;

  return (
    <section>
      <div className="page-head">
        <h1>Visited Countries</h1>
        <p>{visitedCountries.length} countries marked as visited</p>
      </div>

      <div className="form-row">
        <select
          value={regionFilter}
          onChange={(e) => setRegionFilter(e.target.value)}
          className="sort-select"
        >
          <option value="All">All regions</option>
          <option value="Africa">Africa</option>
          <option value="Americas">Americas</option>
          <option value="Asia">Asia</option>
          <option value="Europe">Europe</option>
          <option value="Oceania">Oceania</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="sort-select"
        >
          <option value="name-asc">Sort: Name A-Z</option>
          <option value="name-desc">Sort: Name Z-A</option>
          <option value="population-desc">Sort: Population High-Low</option>
          <option value="population-asc">Sort: Population Low-High</option>
        </select>
      </div>

      {visitedCountries.length === 0 ? (
        <p>No visited countries yet.</p>
      ) : (
        <div className="country-grid">
          {visitedCountries.map((country) => (
            <article key={country.cca3} className="country-card shadow-card">
              <Link to={`/country/${country.cca3}`} className="country-link">
                <img
                  src={country.flags?.png}
                  alt={country.flags?.alt || `Flag of ${country.name.common}`}
                  className="country-flag small-flag"
                />
                <h2>{country.name.common}</h2>
              </Link>

              <div className="country-meta">
                <p><strong>Population:</strong> {country.population.toLocaleString()}</p>
                <p><strong>Region:</strong> {country.region}</p>
                <p><strong>Capital:</strong> {country.capital?.[0] || "No capital"}</p>
              </div>

              <button
                className="secondary-btn visited"
                onClick={() => toggleVisited(country.cca3)}
              >
                Remove visited
              </button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}