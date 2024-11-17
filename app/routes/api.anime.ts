import { LoaderFunction } from "@remix-run/server-runtime";
import dataFetcher, { baseUrl } from "~/libs/dataFetcher.server";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const page = url.searchParams.get("page");
  const fetcher = new dataFetcher();

  try {
    const { animeLinks, pagination } = await fetcher.aniFetch(
      page === "1" ? undefined : `${baseUrl}/page/${page}`
    );

    return new Response(JSON.stringify({ animeLinks, pagination }), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch data" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
};
