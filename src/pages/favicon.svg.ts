import logo from "@variableland/brand/assets/logo.svg?raw";
import type { APIRoute } from "astro";

export const GET: APIRoute = () => new Response(logo, { headers: { "Content-Type": "image/svg+xml" } });
