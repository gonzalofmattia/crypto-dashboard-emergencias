export function SkeletonRow() {
  return (
    <tr className="animate-pulse border-b border-gray-800">
      <td className="px-4 py-4">
        <div className="h-4 w-6 rounded bg-gray-700" />
      </td>
      <td className="px-4 py-4">
        <div className="h-4 w-36 rounded bg-gray-700" />
      </td>
      <td className="px-4 py-4">
        <div className="h-4 w-24 rounded bg-gray-700" />
      </td>
      <td className="px-4 py-4">
        <div className="h-4 w-16 rounded bg-gray-700" />
      </td>
      <td className="px-4 py-4">
        <div className="h-4 w-32 rounded bg-gray-700" />
      </td>
      <td className="px-4 py-4">
        <div className="h-4 w-28 rounded bg-gray-700" />
      </td>
    </tr>
  )
}
