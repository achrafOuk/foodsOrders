import Link from "next/link";
export default function Item({ page, currentPage, url, setPage, lastPage }) {
  console.log("-------------------");
  console.log("page::", page);
  console.log("current page from item:", currentPage);
  console.log("current url", url);
  console.log("-------------------");
  if (page === "preview" && currentPage == 1) {
    return (
      <li>
        <a
          className="py-2 px-3 ml-0 leading-tight text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 :bg-gray-800"
          style={{ cursor: "default" }}
        >
          {page}
        </a>
      </li>
    );
  }
  if (page === "next" && lastPage == currentPage) {
    return (
      <li>
        <a
          className="py-2 px-3 ml-0 leading-tight text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 :bg-gray-800"
          style={{ cursor: "default" }}
        >
          {page}
        </a>
      </li>
    );
  }
  return (
    <li>
      <Link href={`${url}`}>
        <a
          className="py-2 px-3 ml-0 leading-tight text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 :bg-gray-800 "
          onClick={() => {
            setPage();
          }}
        >
          {page}
        </a>
      </Link>
    </li>
  );
}
