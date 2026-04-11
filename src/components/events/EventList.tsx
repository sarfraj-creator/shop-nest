import EventCard from "./EventCard";
import EventSkeleton from "./EventSkeleton";
import EmptyState from "./EmptyState";

export default function EventList({ events, error }: any) {
  if (error) {
    return (
      <div className="text-center py-10 text-red-500">
        Failed to load events. Please try again.
      </div>
    );
  }

  if (!events) {
    return <EventSkeleton />;
  }

  if (events.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
      {events.map((event: any) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}