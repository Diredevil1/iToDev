import { useQueries, useQuery } from "@tanstack/react-query";
import { MovieCard } from "./MovieCard";
import type { Character, Film } from "../types";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getIdFromUrl } from "../utils";

export const Films = () => {
  const navigate = useNavigate();

  const { data, isLoading, isSuccess } = useQuery<Film[]>({
    queryKey: ["films"],
    queryFn: async () => {
      const response = await fetch("https://swapi.info/api/films");
      return await response.json();
    },
    staleTime: 5 * 60 * 1000,
  });

  const { id } = useParams();

  const selectedFilm = data?.find((f) => getIdFromUrl(f.url) === id);

  const characterQueries = useQueries({
    queries: selectedFilm?.characters
      ? selectedFilm.characters.map((url) => ({
          queryKey: ["characters", url],
          queryFn: async (): Promise<Character> => {
            const res = await fetch(url);
            if (!res.ok) throw new Error("Failed to fetch character");
            return res.json();
          },
          staleTime: 5 * 60 * 1000,
        }))
      : [],
  });

  const isQueriesLoading = characterQueries.some((query) => query.isLoading);

  return (
    <div className="relative flex  gap-8 h-[calc(100vh-12rem)] max-h-[calc(100vh)]">
      <div className="w-1/2 flex flex-col justify-start">
        <motion.div
          className="grid grid-cols-2 grid-rows-3 gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {isSuccess &&
            data.map((film) => (
              <div
                key={film.episode_id}
                onClick={() => navigate(`/films/${getIdFromUrl(film.url)}`)}
                tabIndex={0}
                onKeyDown={(e) =>
                  e.key === "Enter" &&
                  navigate(`/films/${getIdFromUrl(film.url)}`)
                }
                className={`cursor-pointer rounded-lg border-2 transition h-fit ${
                  id === getIdFromUrl(film.url)
                    ? "border-amber-300"
                    : "border-transparent hover:border-gray-300"
                }`}
              >
                <MovieCard title={film.title} crawl={film.opening_crawl} />
              </div>
            ))}
        </motion.div>
      </div>

      <div className="w-1/2 p-3 rounded-lg  overflow-auto">
        {selectedFilm && (
          <>
            <h2 className="text-4xl text-amber-300 font-bold">
              {selectedFilm.title}
            </h2>
            <div className="py-5 text-xl flex flex-col gap-1 divide-y-[1px] divide-solid divide-zinc-600">
              <div className="flex justify-between">
                <strong>Episode:</strong>
                <span>{selectedFilm.episode_id} </span>
              </div>
              <div className="flex justify-between">
                <strong>Director:</strong>
                <span>{selectedFilm.director} </span>
              </div>
              <div className="flex justify-between">
                <strong>Producer:</strong>
                <span>{selectedFilm.producer} </span>
              </div>
              <div className="flex justify-between">
                <strong>Release Date:</strong>
                <span>{selectedFilm.release_date} </span>
              </div>
            </div>
            <p className="my-4 text-md rounded-2xl bg-[#2e2e2e] p-3 text-lg">
              {selectedFilm.opening_crawl}
            </p>
            <h3 className="text-xl">Characters</h3>
            <div className="flex flex-wrap gap-3 mt-2">
              {isQueriesLoading ? (
                <div className="w-10 h-10 border-4 border-amber-300 border-t-transparent rounded-full animate-spin" />
              ) : (
                characterQueries.map((query) => {
                  const characterId = getIdFromUrl(query.data?.url ?? "");

                  return (
                    <Link
                      key={characterId}
                      to={`/characters/${characterId}`}
                      className="text-lg text-amber-300 hover:text-white"
                    >
                      {query.data?.name}
                    </Link>
                  );
                })
              )}
            </div>
          </>
        )}
      </div>

      {/* Loader overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black"
            initial={{ x: 0 }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 1, ease: "easeInOut" }}
          >
            <div className="w-10 h-10 border-4 border-amber-300 border-t-transparent rounded-full animate-spin" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
