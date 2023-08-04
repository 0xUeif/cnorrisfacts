"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Category_list(categories) {
  const pathname = usePathname();
  console.log(pathname);

  const listItems = categories.categories.map((category) => (
    <Link key='id' href={`/categories/${category}`}>
      <li
        className={
          pathname.startsWith(`/categories/${category}`)
            ? "text-slate-300"
            : "text-slate-500"
        }
        key='id'
      >
        {category}
      </li>
    </Link>
  ));
  return (
    <ul className='text-slate-500 flex flex-col items-center h-32 w-full flex-wrap gap-2 md:flex-row md:flex-nowrap md:h-fit md:justify-center'>
      {listItems}
    </ul>
  );
}
