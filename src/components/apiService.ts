import axios from "axios";
import type { searchParams, searchResponse, TMDBConfigResponse } from "@/Types";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_TDMB_API_TOKEN}`,
    "Content-Type": "application/json",
  },
});

export const SearchMovies = async (
  params: searchParams,
): Promise<searchResponse> => {
  try {
    const res = await api.get<searchResponse>("/search/movie", {
      params: {
        query: params.query,
        page: params.page ?? 1,
        include_adult: params.include_adult ?? false,
        ...(params.region && { region: params.region }),
        ...(params.year && { year: params.year }),
        ...(params.language && { language: params.language }),
      },
    });

    return res.data;
  } catch (err: any) {
    const message =
      err?.response?.data?.status_message ||
      err?.message ||
      "Failed to fetch movies";
    console.error(message);
    throw new Error(message);
  }
};

export const getTMDBConfig = async (): Promise<TMDBConfigResponse> => {
  const res = await api.get<TMDBConfigResponse>("/configuration");
  return res.data;
};
