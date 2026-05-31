import { useNavigate } from "react-router-dom";

import africaIcon from "../assets/africa.png";
import europeIcon from "../assets/europe.png";
import asiaIcon from "../assets/asia.png";
import AmericaIcon from "../assets/america.png";
import oceaniaIcon from "../assets/oceania.png";


const REGIONS = ["Africa", "America", "Asia", "Europe", "Oceania"];

function getRegionIcon(region) {
  // Map region names to icon imports.
  const icons = {
    Africa: africaIcon,
    America:AmericaIcon,
    Asia: asiaIcon,
    Oceania: oceaniaIcon,
    Europe: europeIcon,

  };

  return icons[region] || null;
}

export default function LandingPage({
  filters = { regions: [], search: "", sortBy: "name-asc" },
  setFilters,
}) {
  const navigate = useNavigate();
  const selectedRegions = filters?.regions || [];

  function toggleRegion(region) {
    // Add or remove a continent from the selected filters.
    setFilters((prev) => ({
      ...prev,
      regions: selectedRegions.includes(region)
        ? selectedRegions.filter((item) => item !== region)
        : [...selectedRegions, region],
    }));
  }

  function handleSearchChange(e) {
    setFilters((prev) => ({
      ...prev,
      search: e.target.value,
    }));
  }

  function handleSortChange(e) {
    setFilters((prev) => ({
      ...prev,
      sortBy: e.target.value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    navigate("/countries");
  }

  return (
    <section className="landing-page">
      <div className="hero">
        <h1>Explore the world</h1>
        <p className="hero-text">
          Choose one or more continents, type one or many country names, and
          open your results.
        </p>
      </div>

      <form className="controls-card shadow-card" onSubmit={handleSubmit}>
        <div className="form-row">
          <input
            type="text"
            placeholder="Search countries, e.g. india japan france"
            value={filters.search}
            onChange={handleSearchChange}
            className="search-input"
          />

          <select
            value={filters.sortBy}
            onChange={handleSortChange}
            className="sort-select"
          >
            <option value="name-asc">Name: A-Z</option>
            <option value="name-desc">Name: Z-A</option>
            <option value="population-desc">Population: High-Low</option>
            <option value="population-asc">Population: Low-High</option>
          </select>
        </div>

        <div className="continent-grid">
          {REGIONS.map((region) => {
            const isActive = selectedRegions.includes(region);
            const icon = getRegionIcon(region);

            return (
              <button
                key={region}
                type="button"
                onClick={() => toggleRegion(region)}
                className={
                  isActive
                    ? "continent-card continent-card--active"
                    : "continent-card"
                }
                aria-pressed={isActive}
              >
                {icon && (
                  <img
                    src={icon}
                    alt={`${region} icon`}
                    className="continent-icon-img"
                  />
                )}
                <span>{region}</span>
              </button>
            );
          })}
        </div>

        <div className="selected-summary">
          <p>
            <strong>Selected continents:</strong>{" "}
            {selectedRegions.length > 0
              ? selectedRegions.join(", ")
              : "None selected"}
          </p>
        </div>

        <button type="submit" className="primary-btn">
          Show countries
        </button>
      </form>
    </section>
  );
}