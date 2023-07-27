import Link from "next/link";
import SearchBar from "../SearchBar";
const API = "https://api.chucknorris.io/jokes";
import Image from "next/image";
import { revalidateTag } from "next/cache";

export default async function CategoriesPage() {
  const category = await getJokeCategories();
  const jokes = await getRandomJoke();

  async function refreshJoke() {
    "use server";
    revalidateTag("random");
  }

  return (
    <main className='flex min-h-screen flex-col items-center p-10 gap-2 bg-slate-800'>
      <SearchBar></SearchBar>
      <Category_list categories={category} />
      <div className='flex  flex-row gap-10'>
        <div className='flex flex-col justify-center  gap-10'>
          <Card>
            <Link href='/categories'>
              <div className='min-h-32 h-32 flex flex-col justify-center place-items-center'>
                <div className='text-lg text-slate-200'>Categories</div>
                <div className='text-sm text-slate-300 hover:text-slate-500'>
                  Click here to get joke categories
                </div>
              </div>
            </Link>
          </Card>
          <Card>
            <div className='min-h-32 h-32 flex flex-col justify-center place-items-center'>
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
        <JokeCard joke={jokes} />
      </div>
    </main>
  );
}
function Category_list(categories) {
  const listItems = categories.categories.map((category) => (
    <Link key='id' href={`/categories/${category}`}>
      <li key='id'>{category}</li>
    </Link>
  ));
  return (
    <ul className='text-slate-500 p-5 flex flex-row gap-2'>{listItems}</ul>
  );
}

async function getJokeCategories() {
  const res = await fetch(`${API}/categories`);
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

function Card({ children }: Props) {
  return (
    <div className='max-w-sm flex-row items-center p-5 justify-center h-fit bg-gray-700 border border-gray-600 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700'>
      {children}
    </div>
  );
}

function JokeCard(joke) {
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
async function getRandomJoke() {
  const res = await fetch(`${API}/random`, { next: { tags: ["random"] } });
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
}
