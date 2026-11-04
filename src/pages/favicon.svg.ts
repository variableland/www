import type { APIRoute } from "astro";
import { favicon } from "../logo.ts";

export const GET: APIRoute = () => new Response(favicon, { headers: { "Content-Type": "image/svg+xml" } });
