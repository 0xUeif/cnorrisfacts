"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { startTransition } from "react";

export default function SearchBar() {
  let { replace } = useRouter();
  let router = useRouter();
  let pathname = usePathname();
  let searchParams = useSearchParams();

  let handleSearch = (term: string) => {
    let params = new URLSearchParams(searchParams);
    if (term) {
      params.set("search", term);
    } else {
      params.delete("search");
    }
    params.delete("page");

    startTransition(() => {
      replace(`${pathname}?${params.toString()}`);
    });
  };

  let handleSearchClick = (e: any) => {
    e.preventDefault();
    router.push(`/?search=${searchParams.get("search")}`);
  };

  return (
    <form>
      <label className='mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white'>
        Search
      </label>
      <div className='relative'>
        <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
          <svg
            className='w-4 h-4 text-gray-500 dark:text-gray-400'
            aria-hidden='true'
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 20 20'
          >
            <path
              stroke='currentColor'
              stroke-linecap='round'
              stroke-linejoin='round'
              stroke-width='2'
              d='m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z'
            />
          </svg>
        </div>
        <input
          type='search'
          id='default-search'
          onChange={(e) => {
            handleSearch(e.target.value);
          }}
          className='block w-full p-4 pl-10 text-sm text-slate-300 border border-gray-600 rounded-lg bg-gray-700 focus:ring-blue-500 focus:border-blue-500'
          placeholder='Search'
          required
        />
        <button
          type='submit'
          onClick={(tag) => {
            handleSearchClick(tag);
          }}
          className='text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
        >
          Search
        </button>
      </div>
    </form>
  );
}
