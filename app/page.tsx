import Image from "next/image";
import Link from "next/link";
import SearchBar from "./SearchBar";
import { revalidateTag } from "next/cache";
const API = "https://api.chucknorris.io/jokes";

async function getRandomJoke() {
  const res = await fetch(`${API}/random`, { next: { tags: ["random"] } });
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  // Recommendation: handle errors
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

async function getSearchJoke(searchValue: any) {
  const res = await fetch(`${API}/search?query=${searchValue}`);
  if (!res.ok) {
    console.log("Failed to search");
    //the cnorris api returns an error when you search for anything
    // that is less than 3 characters therefore im not throwing an error here
  }

  return res.json();
}
function JokeCard(joke: any) {
  return (
    <Card>
      <div className='flex flex-col items-center p-5 gap-5 justify-center'>
        <Image
          src='/chuck.png'
          width={100}
          height={100}
          alt='cartoon image of chuck norris'
        />
        <p className='mb-3 font-normal text-slate-200 dark:text-gray-400'>
          {joke.joke.value}
        </p>
      </div>
    </Card>
  );
}

type Props = {
  children: JSX.Element | JSX.Element[];
};
function Card({ children }: Props) {
  return (
    <div className='max-w-sm gap-1 flex-col items-center p-1 h-fit bg-gray-700 border border-gray-600 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700 sm:p-5'>
      {children}
    </div>
  );
}
type SearchProps = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function Home({ params, searchParams }: SearchProps) {
  const jokes = await getRandomJoke();
  let search = searchParams.search ?? ""; //get search params
  let searchJokes = await getSearchJoke(search.toString());

  //checks if there is any error object for instances where we are not throwing errors
  let checkError = (object: any) => {
    return object.status === 400;
  };
  // isjokes shows if search has returned any jokes else we'll show a random joke
  let isJokes = false;
  if (!checkError(searchJokes)) {
    isJokes = searchJokes.result.length !== 0;
  }

  //server action to get new joke
  async function refreshJoke() {
    "use server";
    revalidateTag("random");
  }

  return (
    <main className='flex min-h-screen flex-col items-center p-10 gap-2 bg-slate-800'>
      <SearchBar />
      <div className='flex flex-col-reverse gap-2 sm:flex-row sm:gap-5'>
        <div className='flex flex-row-reverse gap-2 justify-start sm:flex-col sm:gap-5'>
          <Card>
            <Link href='categories'>
              <div className='h-fit py-5 flex flex-col justify-center place-items-center sm:h-32'>
                <div className='text-lg text-slate-200'>Categories</div>
                <div className='text-sm text-center text-slate-300 hover:text-slate-500'>
                  Click here to get joke categories
                </div>
              </div>
            </Link>
          </Card>
          <Card>
            <div className='h-fit py-5 flex flex-col justify-center place-items-center sm:h-32'>
              <form className='m-0' action={refreshJoke}>
                <button>
                  <div className='text-lg text-slate-200'>Get new joke</div>
                  <div className='text-sm text-slate-300 hover:text-slate-500'>
                    Click here to get a new joke
                  </div>
                </button>
              </form>
            </div>
          </Card>
        </div>
        <div>
          {!isJokes ? (
            <JokeCard joke={jokes} />
          ) : (
            <JokeCard joke={searchJokes.result[0]} />
          )}
        </div>
      </div>
    </main>
  );
}
