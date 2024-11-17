import type { LoaderFunction } from "@remix-run/node";
import dataFetcher from "~/libs/dataFetcher.server";

export const loader: LoaderFunction = async ({ request }) => {
  const fetcher = new dataFetcher();

  try {
    const data = await fetcher.MovieList();
    return new Response(JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "s-maxage=3600",
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch movies" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
};
