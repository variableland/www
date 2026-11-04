import type { APIRoute } from "astro";
import { logoSvg } from "../logo.ts";

export const GET: APIRoute = () => new Response(logoSvg(), { headers: { "Content-Type": "image/svg+xml" } });
