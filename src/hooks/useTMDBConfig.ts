import { useQuery } from "@tanstack/react-query";
import { getTMDBConfig } from "@/components/apiService";

export const useTMDBConfig = () => {
  return useQuery({
    queryFn: getTMDBConfig,
    queryKey: ["tmdb-config"],
    staleTime: Infinity,
  });
};
