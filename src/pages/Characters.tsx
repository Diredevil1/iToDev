import { Input } from "@base-ui-components/react";
import { useQueries, useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import type { Character, Film } from "../types";
import { useEffect, useState } from "react";
import { getIdFromUrl } from "../utils";
import { Link, useNavigate, useParams } from "react-router-dom";

export const Characters = () => {
  const navigate = useNavigate();

  const { data, isLoading, isSuccess } = useQuery<Character[]>({
    queryKey: ["characters"],
    queryFn: async () => {
      const res = await fetch("https://swapi.info/api/people");
      if (!res.ok) throw new Error("Failed to fetch films");
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
  });

  const { id } = useParams();
  const selectedCharacter = data?.find((f) => getIdFromUrl(f.url) === id);

  const [searchTerm, setSearchTerm] = useState(selectedCharacter?.name ?? "");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 1000);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  const [currentPage, setCurrentPage] = useState(1);
  const charactersPerPage = 20;

  const filteredCharacters =
    data?.filter((character) =>
      character.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    ) ?? [];

  const totalPages = Math.ceil(filteredCharacters.length / charactersPerPage);

  const paginatedCharacters = filteredCharacters.slice(
    (currentPage - 1) * charactersPerPage,
    currentPage * charactersPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm]);

  const FilmQueries = useQueries({
    queries: selectedCharacter?.films
      ? selectedCharacter.films.map((url) => ({
          queryKey: ["films", url],
          queryFn: async (): Promise<Film> => {
            const res = await fetch(url);
            if (!res.ok) throw new Error("Failed to fetch character");
            return res.json();
          },
          staleTime: 5 * 60 * 1000,
        }))
      : [],
  });

  const isQueriesLoading = FilmQueries.some((query) => query.isLoading);

  return (
    <div className="relative flex  gap-8 h-[calc(100vh-12rem)] max-h-[calc(100vh)]">
      <div className="w-1/2 flex flex-col justify-start">
        <div className="relative my-3">
          <Input
            placeholder="Name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-md border border-amber-300 pl-3.5 pr-10 text-lg text-white focus:outline-2 focus:-outline-offset-1 focus:outline-white p-3"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white hover:text-red-400 cursor-pointer text-2xl"
              aria-label="Clear search"
            >
              &times;
            </button>
          )}
        </div>

        <motion.div
          className="grid grid-cols-2 grid-rows-3 gap-3 "
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {isSuccess &&
            paginatedCharacters?.map((character, index) => (
              <div
                key={index}
                onClick={() =>
                  navigate(`/characters/${getIdFromUrl(character.url)}`)
                }
                tabIndex={0}
                onKeyDown={(e) =>
                  e.key === "Enter" &&
                  navigate(`/characters/${getIdFromUrl(character.url)}`)
                }
                className={`cursor-pointer rounded-lg bg-zinc-900 border-2 transition p-3 ${
                  getIdFromUrl(selectedCharacter?.url ?? "") ===
                  getIdFromUrl(character?.url ?? "")
                    ? "border-amber-300"
                    : "border-transparent hover:border-gray-300"
                }`}
              >
                {character.name}
              </div>
            ))}
        </motion.div>
        <div className="flex justify-center items-center gap-3 mt-6">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded bg-zinc-800 text-white hover:bg-zinc-700 disabled:opacity-40 cursor-pointer"
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentPage(idx + 1)}
              className={`px-3 py-1 rounded text-sm cursor-pointer ${
                currentPage === idx + 1
                  ? "bg-amber-300 text-black"
                  : "bg-zinc-800 text-white hover:bg-zinc-700"
              }`}
            >
              {idx + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded bg-zinc-800 text-white hover:bg-zinc-700 disabled:opacity-40 cursor-pointer"
          >
            Next
          </button>
        </div>
      </div>

      <div className="w-1/2 p-3 rounded-lg  overflow-auto">
        {selectedCharacter && (
          <>
            <h2 className="text-4xl text-amber-300 font-bold">
              {selectedCharacter.name}
            </h2>
            <div className="py-5 text-xl flex flex-col gap-1 divide-y-[1px] divide-solid divide-zinc-600">
              <div className="flex justify-between">
                <strong>Height:</strong>
                <span>{selectedCharacter.height} </span>
              </div>
              <div className="flex justify-between">
                <strong>Mass:</strong>
                <span>{selectedCharacter.mass} </span>
              </div>
              <div className="flex justify-between">
                <strong>Hair:</strong>
                <span>{selectedCharacter.hair_color} </span>
              </div>
              <div className="flex justify-between">
                <strong>Skin:</strong>
                <span>{selectedCharacter.skin_color} </span>
              </div>
              <div className="flex justify-between">
                <strong>Eye color:</strong>
                <span>{selectedCharacter.eye_color} </span>
              </div>
              <div className="flex justify-between">
                <strong>Birth year:</strong>
                <span>{selectedCharacter.birth_year} </span>
              </div>
              <div className="flex justify-between">
                <strong>Gender:</strong>
                <span>{selectedCharacter.gender} </span>
              </div>
            </div>

            <h3 className="text-xl">Movies</h3>
            <div className="flex flex-wrap gap-3 mt-2">
              {isQueriesLoading ? (
                <div className="w-10 h-10 border-4 border-amber-300 border-t-transparent rounded-full animate-spin" />
              ) : (
                FilmQueries.map((query) => {
                  const filmId = getIdFromUrl(query.data?.url ?? "");

                  return (
                    <Link
                      key={filmId}
                      to={`/films/${filmId}`}
                      className="text-lg text-amber-300 hover:text-white"
                    >
                      {query.data?.title}
                    </Link>
                  );
                })
              )}
            </div>
          </>
        )}
      </div>

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
    </div>
  );
};
