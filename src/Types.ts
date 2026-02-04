export interface TMDBConfigResponse {
  images: {
    base_url: string;
    secure_base_url: string;
    poster_sizes: string[];
    backdrop_sizes: string[];
    profile_sizes: string[];
    logo_sizes: string[];
    still_sizes: string[];
  };
  change_keys: string[];
}

export interface searchResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export interface Movie {
  id: string;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface searchParams {
  query: string;
  page?: number;
  region?: string;
  year?: string;
  language?: string;
  include_adult?: boolean;
}
