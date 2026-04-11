import { getEvents } from "@/lib/eventApi";
import EventList from "@/components/events/EventList";
import EventFilters from "@/components/filters/EventFilters";
import MobileFilters from "@/components/filters/MobileFilters";

export default async function EventsPage({ searchParams }: any) {
  const { events, meta, error } = await getEvents(searchParams);

  return (
    <div className="max-w-7xl mx-auto p-4 flex gap-6">

      {/* Sidebar */}
      <aside className="hidden md:block w-64 sticky top-20 h-fit">
        <EventFilters />
      </aside>

      <div className="flex-1">

        {/* Mobile Filters */}
        <div className="md:hidden mb-4">
          <MobileFilters />
        </div>

        <h1 className="text-2xl font-bold mb-4">Events</h1>

        <EventList events={events} error={error} />

        {/* Pagination */}
        {meta?.current_page && (
          <div className="flex justify-center gap-3 mt-6">

            {meta.current_page > 1 && (
              <a href={`?page=${meta.current_page - 1}`} className="border px-4 py-2 rounded">
                Prev
              </a>
            )}

            <span className="font-medium">
              {meta.current_page} / {meta.last_page}
            </span>

            {meta.current_page < meta.last_page && (
              <a href={`?page=${meta.current_page + 1}`} className="border px-4 py-2 rounded">
                Next
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}