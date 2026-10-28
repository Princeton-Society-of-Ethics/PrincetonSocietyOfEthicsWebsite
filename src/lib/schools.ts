/**
 * Directory of New Jersey high schools (public, charter, and private), loaded
 * on demand from public/data/nj-high-schools.json. Regenerate that file with
 * scripts/update-nj-high-schools.mjs.
 */

export interface School {
  name: string;
  city: string;
  type: "Public" | "Charter" | "Private";
}

interface IndexedSchool extends School {
  /** Normalized words of the name and city, for prefix matching. */
  words: string[];
  normalizedName: string;
}

let cache: Promise<IndexedSchool[]> | null = null;

export function loadSchools(): Promise<IndexedSchool[]> {
  cache ??= fetch("/data/nj-high-schools.json")
    .then((response) => {
      if (!response.ok) throw new Error(`School list request failed: ${response.status}`);
      return response.json() as Promise<{ schools: School[] }>;
    })
    .then(({ schools }) =>
      schools.map((school) => ({
        ...school,
        normalizedName: normalize(school.name),
        words: normalize(`${school.name} ${school.city}`).split(" "),
      }))
    )
    .catch((error: unknown) => {
      cache = null; // allow a retry on the next call
      throw error;
    });
  return cache;
}

/** Lowercase, strip accents and punctuation, and treat "Saint" and "St." alike. */
function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[.'’,()&-]/g, " ")
    .replace(/\bsaint\b/g, "st")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Schools whose name or city contains every word of the query (as the start of
 * a word), best matches first: names that start with the query, then names
 * that contain every word, then matches that rely on the city.
 */
export function searchSchools(schools: IndexedSchool[], query: string, limit = 8): School[] {
  const q = normalize(query).replace(/\bhs\b/g, "high school");
  if (!q) return [];
  const tokens = q.split(" ");

  const matches: { school: IndexedSchool; score: number }[] = [];
  for (const school of schools) {
    if (!tokens.every((token) => school.words.some((word) => word.startsWith(token)))) continue;
    const nameWords = school.normalizedName.split(" ");
    const score = school.normalizedName.startsWith(q)
      ? 0
      : tokens.every((token) => nameWords.some((word) => word.startsWith(token)))
        ? 1
        : 2;
    matches.push({ school, score });
  }

  return matches
    .sort((a, b) => a.score - b.score || a.school.name.localeCompare(b.school.name))
    .slice(0, limit)
    .map(({ school }) => ({ name: school.name, city: school.city, type: school.type }));
}
