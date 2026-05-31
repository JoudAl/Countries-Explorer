// API helpers for fetching country data from REST Countries.
export async function getAllCountries() {
  const response = await fetch(
    "https://restcountries.com/v3.1/all?fields=name,flags,population,region,subregion,capital,cca3"
  );

  if (!response.ok) {
    throw new Error("Failed to fetch countries");
  }

  return response.json();
}

export async function getCountryByCode(code) {
  // Fetch details for a single country.
  const response = await fetch(
    `https://restcountries.com/v3.1/alpha/${code}?fields=name,flags,population,region,subregion,capital,cca3,languages,currencies`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch country");
  }

  return response.json();
}