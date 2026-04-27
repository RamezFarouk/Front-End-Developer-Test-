import { getData } from "country-list";
import { countries as countryData } from "country-data";

export const countries = getData();

const dialCodeByIso = new Map(
  countryData.all
    .filter((country) => country.alpha2 && country.countryCallingCodes?.length)
    .map((country) => [
      country.alpha2,
      country.countryCallingCodes[0].replace(/[^\d+]/g, ""),
    ])
);

export const countriesWithDialCode = countries
  .map((country) => ({
    ...country,
    dialCode: dialCodeByIso.get(country.code) || "+1",
  }))
  .sort((a, b) => a.name.localeCompare(b.name));
