import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const backendApiUrl = process.env.BACKEND_API_URL || "http://localhost:8001/api/v1";

/**
 * Proxy API that forwards customer requests to the FastAPI backend.
 * The backend JWT is read from the httpOnly cookie.
 *
 * GET  /api/customer-auth/proxy?path=/customer-transactions/portfolio
 * POST /api/customer-auth/proxy?path=/customer-transactions/  body={...}
 * PUT  /api/customer-auth/proxy?path=/customer-transactions/{id}  body={...}
 * DELETE /api/customer-auth/proxy?path=/customer-transactions/{id}
 */
export async function GET(request: Request) {
  return proxyRequest(request, "GET");
}

export async function POST(request: Request) {
  return proxyRequest(request, "POST");
}

export async function PUT(request: Request) {
  return proxyRequest(request, "PUT");
}

export async function DELETE(request: Request) {
  return proxyRequest(request, "DELETE");
}

async function proxyRequest(request: Request, method: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("customer_token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const path = searchParams.get("path");

  if (!path) {
    return NextResponse.json({ error: "Missing path parameter" }, { status: 400 });
  }

  // Build backend URL, preserving additional query params
  const otherParams = new URLSearchParams();
  searchParams.forEach((value, key) => {
    if (key !== "path") otherParams.set(key, value);
  });
  const queryString = otherParams.toString();
  const backendUrl = `${backendApiUrl}${path}${queryString ? `?${queryString}` : ""}`;

  const headers: HeadersInit = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const fetchOptions: RequestInit = { method, headers };

  // Forward body for POST/PUT
  if (method === "POST" || method === "PUT") {
    try {
      const body = await request.json();
      fetchOptions.body = JSON.stringify(body);
    } catch {
      // No body — that's ok for some requests
    }
  }

  try {
    const backendRes = await fetch(backendUrl, fetchOptions);

    if (backendRes.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    const data = await backendRes.json();
    return NextResponse.json(data, { status: backendRes.status });
  } catch (err) {
    console.error("Proxy error:", err);
    return NextResponse.json({ error: "Backend unavailable" }, { status: 502 });
  }
}
