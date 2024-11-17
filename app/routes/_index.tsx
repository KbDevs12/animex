import { useLoaderData, useSearchParams } from "@remix-run/react";
import { MetaFunction } from "@remix-run/react";
import { useState, useEffect } from "react";
import { AnimeLink, PaginationLink } from "~/interfaces/interfaces";
import CardList from "~/components/CardList";
import Pagination from "~/components/Pagination";
import HeaderComps from "~/components/HeadTitle";

export const meta: MetaFunction = () => {
  return [
    { title: "Home | AnimeX" },
    { name: "description", content: "unofficial anime streaming website!" },
  ];
};

async function fetchAnimeData(page: string) {
  const response = await fetch(`/api/anime?page=${page}`);
  if (!response.ok) throw new Error("Failed to fetch anime data");
  return response.json();
}

async function fetchMovieData() {
  const response = await fetch(`/api/movies`);
  if (!response.ok) throw new Error("Failed to fetch movie data");
  return response.json();
}

export default function Index() {
  const [animeLinks, setAnimeLinks] = useState<AnimeLink[]>([]);
  const [movie, setMovie] = useState<AnimeLink[]>([]);
  const [pagination, setPagination] = useState<{
    links: PaginationLink[];
    currentPage: number;
    totalPages: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("page") || "1";

  useEffect(() => {
    setLoading(true);

    async function fetchData() {
      try {
        const [animeData, movieData] = await Promise.all([
          fetchAnimeData(page),
          fetchMovieData(),
        ]);

        setAnimeLinks(animeData.animeLinks);
        setPagination(animeData.pagination);
        setMovie(movieData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [page]);

  const handlePageChange = (page: number) => {
    setSearchParams({ page: page.toString() });
  };

  return (
    <main className="flex flex-col items-center justify-center p-4">
      <HeaderComps title="Anime Terbaru" />
      <div className="w-full my-4">
        <CardList data={animeLinks} loading={loading} />
        {!loading && pagination && (
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
            links={pagination.links}
          />
        )}
      </div>
      <HeaderComps title="Movie" link="/movie" />
      <div className="w-full my-4">
        <CardList data={movie} loading={loading} />
      </div>
    </main>
  );
}
