import { getCities } from "@lib/api/web/addressCatalog";
import { NextResponse } from "next/server";

const PRIORITY_CITIES = [
  "Quito",
  "Guayaquil",
  "Cuenca",
  "Azogues",
  "Santo Domingo",
] as const;

const normalizeCityName = (city: string): string =>
  city
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();

const PRIORITY_CITY_INDEX = new Map(
  PRIORITY_CITIES.map((city, index) => [normalizeCityName(city), index])
);

export const sortCitiesForCombobox = (cities: string[]): string[] => {
  const prioritizedGroups = PRIORITY_CITIES.map(() => [] as string[]);
  const remaining: string[] = [];

  for (const city of cities) {
    const priorityIndex = PRIORITY_CITY_INDEX.get(normalizeCityName(city));

    if (priorityIndex === undefined) {
      remaining.push(city);
      continue;
    }

    prioritizedGroups[priorityIndex].push(city);
  }

  return [...prioritizedGroups.flat(), ...remaining];
};

export async function GET() {
  try {
    const data = sortCitiesForCombobox(await getCities());

    return NextResponse.json({
      data
    });
  } catch {
    return NextResponse.json(
      { data: [] },
      { status: 500 }
    );
  }
}
