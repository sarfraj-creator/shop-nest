import { FiMapPin, FiClock } from "react-icons/fi";

export default function EventCard({ event }: any) {
  return (
    <div className="border rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition bg-white">

      {/* Image */}
      <img
        src={event.thumbnail}
        alt={event.title}
        className="h-44 w-full object-cover"
      />

      {/* Content */}
      <div className="p-4 space-y-2">

        {/* Title */}
        <h2 className="font-semibold text-sm line-clamp-2">
          {event.title}
        </h2>

        {/* Location */}
        <p className="text-xs text-gray-500 flex items-center gap-1">
          <FiMapPin />
          {event.city || event.mode_of_event === "online" ? "Online" : "N/A"}
        </p>

        {/* Date */}
        <p className="text-xs text-gray-500 flex items-center gap-1">
          <FiClock />
          {event.event_date} • {event.start_time}
        </p>

        {/* Badge */}
        <div className="flex justify-between items-center pt-2">

          <span className="text-xs bg-gray-100 px-2 py-1 rounded capitalize">
            {event.mode_of_event}
          </span>

          <span className="text-xs font-medium text-green-600">
            {event.registration_type === "free" ? "Free" : "Paid"}
          </span>
        </div>
      </div>
    </div>
  );
}