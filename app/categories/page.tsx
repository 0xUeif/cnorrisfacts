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
      <div className='flex flex-col-reverse gap-2 sm:flex-row sm:gap-5'>
        <div className='flex flex-row-reverse gap-2 justify-start sm:flex-col sm:gap-5'>
          <Card>
            <Link href='/categories'>
              <div className='h-fit py-5 flex flex-col justify-center place-items-center sm:h-32'>
                <div className='text-lg text-slate-200'>Categories</div>
                <div className='text-sm text-slate-300 hover:text-slate-500'>
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
        <JokeCard joke={jokes} />
      </div>
    </main>
  );
}
function Category_list(categories: any) {
  const listItems = categories.categories.map((category: any) => (
    <Link key='id' href={`/categories/${category}`}>
      <li key='id'>{category}</li>
    </Link>
  ));
  return (
    <ul className='text-slate-500 flex flex-col items-center h-32 w-full flex-wrap gap-2 sm:flex-row sm:flex-nowrap sm:h-fit sm:justify-center'>
      {listItems}
    </ul>
  );
}

async function getJokeCategories() {
  const res = await fetch(`${API}/categories`);
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
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
async function getRandomJoke() {
  const res = await fetch(`${API}/random`, { next: { tags: ["random"] } });
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
}
