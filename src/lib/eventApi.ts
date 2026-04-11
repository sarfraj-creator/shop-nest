export async function getEvents(searchParams: Record<string, string>) {
  try {
    const params = new URLSearchParams();

    Object.entries(searchParams).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });

    if (!params.get("page")) params.set("page", "1");
    if (!params.get("per_page")) params.set("per_page", "6");

    const res = await fetch(
      `https://staging-backend.thebobproject.co/api/public/v2/event/list?${params.toString()}`,
      { cache: "no-store" }
    );

    if (!res.ok) throw new Error("Failed to fetch events");

    const json = await res.json();

    return {
      events: json?.data?.data || [],
      meta: json?.data || {},
    };
  } catch (error) {
    return {
      events: [],
      meta: {},
      error: true,
    };
  }
}