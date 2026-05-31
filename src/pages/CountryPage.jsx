import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getCountryByCode } from "../services/countriesApi.js";

export default function CountryPage({ visitedCodes, toggleVisited }) {
  const { code } = useParams();
  const [country, setCountry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCountry() {
      try {
        setLoading(true);
        setError("");

        const data = await getCountryByCode(code);
        const countryData = Array.isArray(data) ? data[0] : data;

        setCountry(countryData);
      } catch (err) {
        setError("Could not load country details.");
      } finally {
        setLoading(false);
      }
    }

    loadCountry();
  }, [code]);

  useEffect(() => {
    // Automatically mark the current country as visited if not already.
    if (country?.cca3 && !visitedCodes.includes(country.cca3)) {
      toggleVisited(country.cca3);
    }
  }, [country, visitedCodes, toggleVisited]);

  if (loading) return <p>Loading country...</p>;
  if (error) return <p>{error}</p>;
  if (!country) return <p>No country found.</p>;

  const languages = country.languages
    ? Object.values(country.languages).join(", ")
    : "No languages listed";

  const currencies = country.currencies
    ? Object.values(country.currencies)
        .map((item) => item.name)
        .join(", ")
    : "No currencies listed";

  return (
    <section className="details-card shadow-card">
      <Link to="/countries" className="back-link">
        ← Back to countries
      </Link>

      <div className="details-layout">
        <img
          src={country.flags?.png}
          alt={country.flags?.alt || `Flag of ${country.name?.common}`}
          className="detail-flag"
        />

        <div>
          <h1>{country.name?.common}</h1>
          <p><strong>Official name:</strong> {country.name?.official}</p>
          <p><strong>Population:</strong> {country.population?.toLocaleString()}</p>
          <p><strong>Region:</strong> {country.region}</p>
          <p><strong>Subregion:</strong> {country.subregion || "No subregion"}</p>
          <p><strong>Capital:</strong> {country.capital?.[0] || "No capital"}</p>
          <p><strong>Languages:</strong> {languages}</p>
          <p><strong>Currencies:</strong> {currencies}</p>

        </div>
      </div>
    </section>
  );
}