import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllCountries } from "../services/countriesApi.js";

export default function HomePage() {
  // Load all countries and display them in a simple list.
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCountries() {
      try {
        const data = await getAllCountries();
        setCountries(data);
      } catch (err) {
        setError("Its not louding.");
      } finally {
        setLoading(false);
      }
    }

    loadCountries();
  }, []);

  if (loading) return <p>Loading countries...</p>;
  if (error) return <p>{error}</p>;

  return (
    <section>
      <h1>All Countries</h1>

      <div className="country-grid">
        {countries.map((country) => (
          <Link
            to={`/country/${country.cca3}`}
            key={country.cca3}
            className="country-card"
          >
            <img
              src={country.flags?.png}
              alt={country.flags?.alt || `Flag of ${country.name.common}`}
              className="country-flag"
            />
            <h2>{country.name.common}</h2>
            <p>Population: {country.population.toLocaleString()}</p>
            <p>Region: {country.region}</p>
            <p>Capital: {country.capital?.[0] || "No capital"}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}