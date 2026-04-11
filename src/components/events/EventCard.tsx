import Image from "next/image";
import { FiMapPin, FiClock, FiUsers } from "react-icons/fi";

/**
 * EventCard.tsx
 *
 * Displays a single event in the grid.
 * Key fixes vs original:
 *  - Location: was `event.city || event.mode_of_event === "online"` which is
 *    ALWAYS truthy (||  has lower precedence than ===), so every card showed
 *    "Online". Fixed with explicit conditional.
 *  - City/state: many events have null city — handle gracefully.
 *  - event_type badge added (connect / elevate).
 */
export default function EventCard({ event }: { event: any }) {
  // ── Derived values ────────────────────────────────────────────────────────
  const isOnline = event.mode_of_event === "online";

  // City can be null even for offline events in the API data
  const locationText = isOnline
    ? "Online"
    : [event.city, event.state].filter(Boolean).join(", ") || "Location TBD";

  const isFree = event.registration_type === "free";

  const eventTypeBg: Record<string, string> = {
    connect: "bg-blue-50 text-blue-700",
    elevate: "bg-purple-50 text-purple-700",
  };
  const typeBadge = eventTypeBg[event.event_type] ?? "bg-gray-100 text-gray-600";

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 bg-white flex flex-col">
      {/* Thumbnail */}
      <div className="relative h-44 flex-shrink-0 bg-gray-100">
        {event.thumbnail ? (
          <Image
            src={event.thumbnail}
            alt={event.title}
            className="h-full w-full object-cover"
            loading="lazy"
            width={100}
    height={100}
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-gray-300">
            <svg
              className="w-12 h-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}

        {/* Event type badge — top left */}
        <span
          className={`absolute top-2 left-2 text-xs font-medium px-2 py-0.5 rounded-full capitalize ${typeBadge}`}
        >
          {event.event_type}
        </span>

        {/* Free / Paid badge — top right */}
        <span
          className={`absolute top-2 right-2 text-xs font-semibold px-2 py-0.5 rounded-full ${
            isFree
              ? "bg-green-50 text-green-700"
              : "bg-orange-50 text-orange-700"
          }`}
        >
          {isFree ? "Free" : `₹${event.registration_fee}`}
        </span>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        {/* Title */}
        <h2 className="font-semibold text-sm text-gray-900 line-clamp-2 leading-snug">
          {event.title}
        </h2>

        {/* Location */}
        <p className="text-xs text-gray-500 flex items-start gap-1.5">
          <FiMapPin className="mt-0.5 flex-shrink-0" />
          <span>{locationText}</span>
        </p>

        {/* Date & Time */}
        <p className="text-xs text-gray-500 flex items-center gap-1.5">
          <FiClock className="flex-shrink-0" />
          <span>
            {event.event_date}
            {event.start_time ? ` · ${event.start_time}` : ""}
          </span>
        </p>

        {/* Slots */}
        {event.capacity > 0 && (
          <p className="text-xs text-gray-400 flex items-center gap-1.5">
            <FiUsers className="flex-shrink-0" />
            <span>
              {event.slots_left > 0
                ? `${event.slots_left} slots left`
                : "Fully booked"}
            </span>
          </p>
        )}

        {/* Footer row */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-50">
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded capitalize">
            {isOnline ? "Online" : "In-Person"}
          </span>

          {event.registration_deadline && (
            <span className="text-xs text-gray-400">
              Reg. by {event.registration_deadline}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}