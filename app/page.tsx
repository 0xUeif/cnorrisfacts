import Image from 'next/image'
import SearchBar from './SearchBar'
const API = 'https://api.chucknorris.io/jokes'

async function getRandomJoke() {
  const res = await fetch(`${API}/random`, { cache: 'no-store' })
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.
 
  // Recommendation: handle errors
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data')
  }
 
  return res.json()
}
async function getJokeCategories() {
  const res = await fetch(`${API}/categories`)
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data')
  }
 
  return res.json()
}
function JokeCard(joke) {
 
  return(
    <Card> 
      <div className="flex flex-col items-center p-5 gap-5 justify-center">
        <Image
        src="/chuck.png"
        width={100}
        height={100}
        alt="cartoon image of chuck norris"
      />
        <p className="mb-3 font-normal text-slate-200 dark:text-gray-400">{joke.joke.value}</p>
        
    </div>

    </Card>
  )
}
type Props = {
  children: JSX.Element | JSX.Element[]
}
function Card({children}:Props) {
  return(
    <div className="max-w-sm flex-row items-center justify-center h-fit bg-gray-700 border border-gray-600 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700">
      {children}
    </div>
  )
  
}

function Category_list(categories:Array){
  const listItems = categories.categories.map(category =>
    <li key='id'>{category}</li>
  );
  return <ul>{listItems}</ul>;
}

export default async function Home() {
  const jokes = await getRandomJoke();
  const category = await getJokeCategories();
  
  return (
    <main className="flex min-h-screen flex-col items-center p-10 gap-2 bg-slate-800">
      <SearchBar/>
      <div className='flex  flex-row gap-10'>
        <div className='flex flex-col justify-between gap-10'>
          <Card>
            <div className='min-h-32 h-32'>
              Click here to get all categories
            </div>
          </Card>
          <Card>
            <div className='min-h-32 h-32'>
              Click here get new joke or click r
            </div>
          </Card>
        </div>
        <JokeCard joke={jokes}/>
      </div>     
    </main>
  )
}
