import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getAllCountries } from "../services/countriesApi.js";

import africaIcon from "../assets/africa.png";
import americaIcon from "../assets/america.png";
import asiaIcon from "../assets/asia.png";
import europeIcon from "../assets/europe.png";
import oceaniaIcon from "../assets/oceania.png";

function getRegionIcon(region) {
  // Pick the right icon for each region shown in the country cards.
  const icons = {
    Africa: africaIcon,
    america: americaIcon,
    Asia: asiaIcon,
    Europe: europeIcon,
    Oceania: oceaniaIcon,
  };

  return icons[region] || null;
}

export default function CountriesPage({
  filters,
  visitedCodes = [],
}) {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCountries() {
      try {
        const data = await getAllCountries();
        setCountries(data);
      } catch (err) {
        setError("Could not load countries.");
      } finally {
        setLoading(false);
      }
    }

    loadCountries();
  }, []);

  const filteredCountries = useMemo(() => {
    // Applying filters, search text, and sorting to the loaded country list.
    let result = [...countries];

    if (filters?.regions?.length > 0) {
      result = result.filter((country) =>
        filters.regions.includes(country.region)
      );
    }

    const words = (filters?.search || "")
      .toLowerCase()
      .trim()
      .split(/[,\s]+/)
      .filter(Boolean);

    if (words.length > 0) {
      result = result.filter((country) => {
        const searchableText = [
          country.name?.common || "",
          country.region || "",
          country.subregion || "",
          country.capital?.[0] || "",
        ]
          .join(" ")
          .toLowerCase();

        return words.some((word) => searchableText.includes(word));
      });
    }

    switch (filters?.sortBy) {
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
  }, [countries, filters]);

  if (loading) return <p>Loading countries...</p>;
  if (error) return <p>{error}</p>;

  return (
    <section>
      <div className="page-head">
        <h1>Countries</h1>
        <p>
          Showing {filteredCountries.length} countries
          {filters?.regions?.length > 0 ? ` in ${filters.regions.join(", ")}` : ""}
        </p>
      </div>

      {filteredCountries.length === 0 ? (
        <div className="empty-state">
          <h2>No countries found</h2>
          <p>Try a different search word, multiple keywords, or another region.</p>
        </div>
      ) : (
        <div className="country-grid">
          {filteredCountries.map((country) => {
            const isVisited = visitedCodes.includes(country.cca3);
            const regionIcon = getRegionIcon(country.region);

            return (
              <article
                key={country.cca3}
                className={`country-card shadow-card ${
                  isVisited ? "country-card--visited" : ""
                }`}
              >
                <Link to={`/country/${country.cca3}`} className="country-link">
                  <img
                    src={country.flags?.png}
                    alt={country.flags?.alt || `Flag of ${country.name.common}`}
                    className="country-flag small-flag"
                  />

                  <div className="country-title-row">
                    <h2>{country.name.common}</h2>

                    {regionIcon && (
                      <img
                        src={regionIcon}
                        alt=""
                        className="country-region-icon"
                      />
                    )}
                  </div>
                </Link>

                <div className="country-meta">
                  <p>
                    <strong>Population:</strong>{" "}
                    {country.population.toLocaleString()}
                  </p>
                  <p>
                    <strong>Region:</strong> {country.region}
                  </p>
                  <p>
                    <strong>Capital:</strong> {country.capital?.[0] || "No capital"}
                  </p>
                </div>

                {isVisited && <p className="visited-mark">Visited</p>}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}