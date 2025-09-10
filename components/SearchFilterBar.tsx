import { useState, useEffect } from 'react'

interface FilterState {
  search: string
  ageMin: string
  ageMax: string
  medicalIssue: string
}

interface SearchFilterBarProps {
  filters: FilterState
  onFilterChange: (newFilters: Partial<FilterState>) => void
  onSearchChange: (searchTerm: string) => void
}

export function SearchFilterBar({ filters, onFilterChange, onSearchChange }: SearchFilterBarProps) {
  const [localSearch, setLocalSearch] = useState(filters.search)

  useEffect(() => {
    setLocalSearch(filters.search)
  }, [filters.search])

  useEffect(() => {
    const timeout = setTimeout(() => {
      onSearchChange(localSearch)
    }, 300)

    return () => clearTimeout(timeout)
  }, [localSearch, onSearchChange])

  const medicalIssues = [
    { value: '', label: 'All Medical Issues' },
    { value: 'rash', label: 'Rash' },
    { value: 'headache', label: 'Headache' },
    { value: 'fever', label: 'Fever' },
    { value: 'allergic reaction', label: 'Allergies' },
    { value: 'sinusitis', label: 'Sinusitis' },
    { value: 'sore throat', label: 'Sore Throat' },
    { value: 'sprained ankle', label: 'Sprained Ankle' },
    { value: 'stomach ache', label: 'Stomach Ache' },
    { value: 'broken arm', label: 'Broken Arm' },
    { value: 'ear infection', label: 'Ear Infection' },
  ]

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearch(e.target.value)
  }

  const handleAgeMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === '' || (/^\d+$/.test(value) && parseInt(value) >= 0)) {
      onFilterChange({ ageMin: value })
    }
  }

  const handleAgeMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === '' || (/^\d+$/.test(value) && parseInt(value) >= 0)) {
      onFilterChange({ ageMax: value })
    }
  }

  const handleMedicalIssueChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ medicalIssue: e.target.value })
  }

  const clearAllFilters = () => {
    setLocalSearch('')
    onFilterChange({
      search: '',
      ageMin: '',
      ageMax: '',
      medicalIssue: ''
    })
  }

  const hasActiveFilters = !!(localSearch || filters.ageMin || filters.ageMax || filters.medicalIssue)

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          type="text"
          aria-label="Search patients"
          placeholder="Search patients by name or medical issue..."
          value={localSearch}
          onChange={handleSearchInputChange}
          className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
        />
        {localSearch && (
          <button
            aria-label="Clear search"
            onClick={() => setLocalSearch('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <svg
              className="h-5 w-5 text-gray-400 hover:text-gray-600"
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
        )}
      </div>

      {/* Filter Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Min Age */}
        <div>
          <label htmlFor="ageMin" className="block text-sm font-medium text-gray-700 mb-1">
            Min Age
          </label>
          <input
            type="number"
            id="ageMin"
            aria-label="Minimum Age"
            placeholder="e.g. 18"
            min="0"
            max="150"
            value={filters.ageMin}
            onChange={handleAgeMinChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
          />
        </div>

        {/* Max Age */}
        <div>
          <label htmlFor="ageMax" className="block text-sm font-medium text-gray-700 mb-1">
            Max Age
          </label>
          <input
            type="number"
            id="ageMax"
            aria-label="Maximum Age"
            placeholder="e.g. 65"
            min="0"
            max="150"
            value={filters.ageMax}
            onChange={handleAgeMaxChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
          />
        </div>

        {/* Medical Issue */}
        <div>
          <label htmlFor="medicalIssue" className="block text-sm font-medium text-gray-700 mb-1">
            Medical Issue
          </label>
          <select
            id="medicalIssue"
            value={filters.medicalIssue}
            onChange={handleMedicalIssueChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
          >
            {medicalIssues.map((issue) => (
              <option key={issue.value} value={issue.value}>
                {issue.label}
              </option>
            ))}
          </select>
        </div>

        {/* Clear Filters */}
        <div className="flex items-end">
          <button
            aria-label="Clear all filters"
            onClick={clearAllFilters}
            disabled={!hasActiveFilters}
            className={`w-full px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              hasActiveFilters
                ? 'bg-gray-600 text-white hover:bg-gray-700'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mt-2">
          <span className="text-sm text-gray-600">Active filters:</span>

          {localSearch && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800">
              Search: "{localSearch}"
              <button
                aria-label="Remove search filter"
                onClick={() => setLocalSearch('')}
                className="ml-2 hover:text-primary-900"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          )}

          {filters.ageMin && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
              Min Age: {filters.ageMin}
              <button
                aria-label="Remove min age filter"
                onClick={() => onFilterChange({ ageMin: '' })}
                className="ml-2 hover:text-blue-900"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          )}

          {filters.ageMax && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
              Max Age: {filters.ageMax}
              <button
                aria-label="Remove max age filter"
                onClick={() => onFilterChange({ ageMax: '' })}
                className="ml-2 hover:text-blue-900"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          )}

          {filters.medicalIssue && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
              Issue: {medicalIssues.find(issue => issue.value === filters.medicalIssue)?.label}
              <button
                aria-label="Remove medical issue filter"
                onClick={() => onFilterChange({ medicalIssue: '' })}
                className="ml-2 hover:text-green-900"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  )
}