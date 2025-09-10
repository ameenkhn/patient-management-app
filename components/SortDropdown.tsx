import React from "react"

interface SortState {
  sortBy: "age" | "patient_name" | ""
  sortOrder: "asc" | "desc"
}

interface SortDropdownProps {
  sort: SortState
  onSortChange: (newSort: SortState) => void
}

export function SortDropdown({ sort, onSortChange }: SortDropdownProps) {
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value

    switch (value) {
      case "":
        onSortChange({ sortBy: "", sortOrder: "asc" })
        break
      case "patient_name_asc":
        onSortChange({ sortBy: "patient_name", sortOrder: "asc" })
        break
      case "patient_name_desc":
        onSortChange({ sortBy: "patient_name", sortOrder: "desc" })
        break
      case "age_asc":
        onSortChange({ sortBy: "age", sortOrder: "asc" })
        break
      case "age_desc":
        onSortChange({ sortBy: "age", sortOrder: "desc" })
        break
      default:
        onSortChange({ sortBy: "", sortOrder: "asc" })
    }
  }

  return (
    <div className="space-y-2">
      <label
        htmlFor="combinedSort"
        className="block text-sm font-medium text-gray-700"
      >
        Sort Patients
      </label>

      <select
        id="combinedSort"
        aria-label="Sort patients by field and order"
        value={sort.sortBy ? `${sort.sortBy}_${sort.sortOrder}` : ""}
        onChange={handleSortChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
      >
        <option value="">No Sorting</option>
        <option value="patient_name_asc">Name (A → Z)</option>
        <option value="patient_name_desc">Name (Z → A)</option>
        <option value="age_asc">Age (Youngest First)</option>
        <option value="age_desc">Age (Oldest First)</option>
      </select>

      {sort.sortBy && (
        <div className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-md mt-2 flex items-center justify-between">
          <span>
            Sorting by{" "}
            <strong>{sort.sortBy === "patient_name" ? "Name" : "Age"}</strong>{" "}
            ({sort.sortOrder === "asc" ? "ascending" : "descending"})
          </span>
          <button
            aria-label="Clear sorting"
            onClick={() => onSortChange({ sortBy: "", sortOrder: "asc" })}
            className="text-gray-400 hover:text-gray-600 ml-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}