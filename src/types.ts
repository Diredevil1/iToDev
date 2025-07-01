export interface Film {
  title: string;
  episode_id: number;
  opening_crawl: string;
  director: string;
  producer: string;
  release_date: string;
  characters: string[]; // URLs
  planets: string[]; // URLs
  starships: string[]; // URLs
  vehicles: string[]; // URLs
  species: string[]; // URLs
  created: string; // ISO timestamp
  edited: string; // ISO timestamp
  url: string; // URL to this film
}

export type FilmSummary = Pick<
  Film,
  | "title"
  | "episode_id"
  | "opening_crawl"
  | "director"
  | "producer"
  | "release_date"
  | "characters"
>;

export interface Character {
  name: string;
  height: string;
  mass: string;
  hair_color: string;
  skin_color: string;
  eye_color: string;
  birth_year: string;
  gender: string;
  url: string;
  films: string[];
}
