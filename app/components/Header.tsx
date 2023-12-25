"use client";

import Image from "next/image";
import { MagnifyingGlassIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import Avatar from "react-avatar";
import { useBoardStore } from "@/store/BoardStore";
import { useEffect, useState } from "react";
import fetchSuggestion from "../lib/fetchSuggestion";

const Header = () => {
  const [board, searchString, setSearchString] = useBoardStore((state) => [
    state.board,
    state.searchString,
    state.setSearchString,
  ]);

  const [loading, setLoading] = useState<boolean>(false);
  const [suggestion, setSuggestion] = useState<String>("");
  useEffect(() => {
    if (board.columns.size === 0) return;
    setLoading(true);
    const fetchSuggestionFunc = async () => {
      const suggestion = await fetchSuggestion(board);
      setSuggestion(suggestion);
      setLoading(false);
    };
    // API ERROR
    // fetchSuggestionFunc();
  }, [board]);

  return (
    <header className="w-screen min-w-[320px] max-w-[1650px] p-5 flex flex-col   ">
      <div className="absolute top-0 left-0 w-full h-screen bg-gradient-to-br from-pink-400 to-[#0055D1] filter blur-3xl opacity-50 -z-50" />
      <div className="flex flex-col gap-3 items-center justify-between lg:flex-row">
        <Image
          src={"/logo.png"}
          alt="logo"
          width={300}
          height={100}
          className="w-44 md:w-56  object-contain"
        />
        <div className="flex items-center justify-center gap-2 min-w-[320px]">
          <form
            action=""
            className="shadow-md rounded-md p-1.5 flex items-center justify-center bg-white"
          >
            <MagnifyingGlassIcon className="h-5 w-6 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              className="p-2 outline-none flex-1 max-sm:w-[200px]"
              onChange={(e) => setSearchString(e.target.value)}
            />
            <button type="submit" hidden>
              Search
            </button>
          </form>
          <Avatar name="C N" size="40" round color="#0044D1" />
        </div>
      </div>
      <div className="flex items-start justify-center mt-4 ">
        <div className="h-full flex items-center justify-center gap-2 p-5 rounded-xl bg-white max-w-[720px]">
          <UserCircleIcon
            className={`inline-block min-h-10 min-w-10 h-10 w-10 text-[#0044D1] ${
              loading && "animate-spin"
            } `}
          />
          <p className={`text-[#0055D1] text-sm bg-pink-400s `}>
            {suggestion && !loading
              ? suggestion
              : "We Cannot Affort OpenAi API Key to summarize your todo-list just read below shit and start working. if we get any free api we will integrate it."}
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;
