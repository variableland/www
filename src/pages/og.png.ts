import type { APIRoute } from "astro";
import { ogImage } from "../og/og-image.ts";

export const GET: APIRoute = async () => new Response(await ogImage(), { headers: { "Content-Type": "image/png" } });
