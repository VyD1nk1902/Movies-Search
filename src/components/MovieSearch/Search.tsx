import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SearchMovies } from "../apiService";
import { useTMDBConfig } from "@/hooks/useTMDBConfig";
import { buildTMDBImageUrl } from "@/utils/tmdbImage";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type pageItem = number | "...";

const SearchSection = () => {
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isAdult, setIsAdult] = useState(false);
  const [language, setLanguage] = useState("en-US");
  const { data: config } = useTMDBConfig();
  const { data, isLoading, isError, error } = useQuery({
    queryFn: () =>
      SearchMovies({
        query: search,
        page,
        language,
        include_adult: isAdult,
      }),
    queryKey: ["search-movies", search, page, isAdult, language],
    enabled: !!search,
    staleTime: 1000 * 60 * 5,
  });

  const pageList: pageItem[] = [];
  const currentPage = page;
  const totalPage = data?.total_pages ?? 1;

  if (totalPage <= 10) {
    for (let i = 1; i <= totalPage; i++) {
      pageList.push(i);
    }
  } else {
    // Khối đầu pagination
    pageList.push(1, 2);
    if (currentPage > 4) {
      pageList.push("...");
    }

    //Middle (start-current-end)
    const start = Math.max(3, currentPage - 1);
    const end = Math.min(currentPage + 1, totalPage, totalPage - 2);

    for (let i = start; i <= end; i++) {
      pageList.push(i);
    }

    if (currentPage <= totalPage - 3) {
      pageList.push("...");
    }

    // Khối cuối pagination
    pageList.push(totalPage - 1, totalPage);
  }

  useEffect(() => {
    setPage(1);
  }, [search]);
  return (
    <div className="p-4 bg-background flex flex-col gap-4">
      <span>Search for a movie</span>
      <Input
        type="text"
        id="search-movie"
        onChange={(e) => setSearchInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            setSearch(searchInput.trim());
          }
        }}
        placeholder="Search your favorite movies here..."
      />

      <div className="flex gap-2">
        <Label>Language</Label>
        <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger className="w-full max-w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent side="right" position="popper">
            <SelectGroup>
              <SelectItem value="vi-VN">Vietnamese</SelectItem>
              <SelectItem value="en-US">English</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-2 items-center">
        <Checkbox
          checked={isAdult}
          id="isAdult"
          onCheckedChange={(value) => setIsAdult(value === true)}
        />
        <Label htmlFor="isAdult">Include Adult</Label>
      </div>

      <button
        onClick={() => setSearch(searchInput.trim())}
        className="bg-blue-500 w-24 text-white text-xl py-1.5 rounded-md hover:bg-blue-700"
      >
        Search
      </button>

      <div>
        {isLoading && <span>Loading...</span>}
        {isError && <span>{(error as Error).message}</span>}

        {data?.results?.length ? (
          <>
            <div className="w-full grid grid-cols-4 gap-2">
              {data.results.map((movie) => {
                const postedUrl = buildTMDBImageUrl(
                  config,
                  movie.poster_path,
                  "original",
                );

                return (
                  <div key={movie.id} className="flex flex-col gap-6">
                    <div className={`movie-card`}>
                      {postedUrl ? (
                        <img
                          src={buildTMDBImageUrl(
                            config,
                            movie.poster_path,
                            "original",
                          )}
                          alt={movie.original_title}
                          className="rounded-2xl w-full h-auto aspect-[300/450] object-cover"
                        />
                      ) : (
                        <div className="w-[300px] h-[450px] flex items-center justify-center text-sm">
                          No poster
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-2 text-center">
                      <span className="text-xl font-semibold">
                        {movie.title}
                      </span>
                      <span className="text-sm text-[#7d7d80]">
                        {movie.original_title}
                      </span>
                      <span className="line-clamp-4 w-fit">
                        {movie.overview}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex text-[18px] gap-15 justify-center items-center mt-10">
              {pageList.map((i, index) => {
                return (
                  <button
                    key={`${i}-${index}`}
                    disabled={i === "..."}
                    onClick={() => typeof i === "number" && setPage(i)}
                    className={
                      i === currentPage ? "text-blue-500" : "text-white"
                    }
                  >
                    {i}
                  </button>
                );
              })}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default SearchSection;
