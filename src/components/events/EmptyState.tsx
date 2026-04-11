export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <h2 className="text-lg font-semibold mb-2">
        No events found
      </h2>
      <p className="text-gray-500 text-sm">
        Try adjusting your filters or search keyword
      </p>
    </div>
  );
}