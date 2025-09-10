'use client'
import { useState, useEffect, useMemo } from 'react'
import { PatientCard } from '@/components/PatientCard'
import { SearchFilterBar } from '@/components/SearchFilterBar'
import { SortDropdown } from '@/components/SortDropdown'
import { Pagination } from '@/components/Pagination'
import { fetchPatients } from '@/lib/fetchers'

export interface Patient {
  patient_id: number
  patient_name: string
  age: number
  medical_issue: string
  photo_url?: string
  contact: {
    address: string
    number: string
    email: string
  }[]
}

export interface ApiResponse {
  data: Patient[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export interface FilterState {
  search: string
  ageMin: string
  ageMax: string
  medicalIssue: string
}

export interface SortState {
  sortBy: 'age' | 'patient_name' | ''
  sortOrder: 'asc' | 'desc'
}

export default function HomePage() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [viewMode, setViewMode] = useState<'card' | 'row'>('card')

  const [filters, setFilters] = useState<FilterState>({
    search: '',
    ageMin: '',
    ageMax: '',
    medicalIssue: ''
  })

  const [sort, setSort] = useState<SortState>({
    sortBy: '',
    sortOrder: 'asc'
  })

  const debouncedSearch = useMemo(() => {
    const timeoutRef = { current: null as NodeJS.Timeout | null }
    return (searchTerm: string) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      timeoutRef.current = setTimeout(() => {
        setFilters(prev => ({ ...prev, search: searchTerm }))
        setCurrentPage(1)
      }, 300)
    }
  }, [])

  const loadPatients = async () => {
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20'
      })

      if (filters.search) params.set('search', filters.search)
      if (filters.ageMin) params.set('ageMin', filters.ageMin)
      if (filters.ageMax) params.set('ageMax', filters.ageMax)
      if (filters.medicalIssue) params.set('medical_issue', filters.medicalIssue)

      if (sort.sortBy) {
        params.set('sortBy', sort.sortBy)
        params.set('sortOrder', sort.sortOrder)
      }

      const response: ApiResponse = await fetchPatients(params.toString())

      const normalizedData = response.data.map((p) => ({
        ...p,
        contact: Array.isArray(p.contact) ? p.contact : []
      }))

      let sortedData = [...normalizedData]
      if (sort.sortBy === 'patient_name') {
        sortedData.sort((a, b) =>
          sort.sortOrder === 'asc'
            ? a.patient_name.localeCompare(b.patient_name, undefined, { sensitivity: 'base' })
            : b.patient_name.localeCompare(a.patient_name, undefined, { sensitivity: 'base' })
        )
      } else if (sort.sortBy === 'age') {
        sortedData.sort((a, b) =>
          sort.sortOrder === 'asc' ? a.age - b.age : b.age - a.age
        )
      }

      setPatients(sortedData)
      setTotalPages(response.meta.totalPages)
      setTotalCount(response.meta.total)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load patients')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPatients()
  }, [currentPage, filters, sort])

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
    setCurrentPage(1)
  }

  const handleSortChange = (newSort: SortState) => {
    setSort(newSort)
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="bg-white rounded-lg shadow p-6 animate-pulse">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Patients</h2>
          <p className="text-gray-600 mt-1">
            {loading ? 'Loading...' : `${totalCount} total patients`}
          </p>
        </div>

        {/* View toggle */}
        <div className="flex items-center space-x-2 bg-white rounded-lg p-1 shadow">
          <button
            onClick={() => setViewMode('card')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'card'
                ? 'bg-primary-500 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Cards
          </button>
          <button
            onClick={() => setViewMode('row')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'row'
                ? 'bg-primary-500 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Rows
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <SearchFilterBar
              filters={filters}
              onFilterChange={handleFilterChange}
              onSearchChange={debouncedSearch}
            />
          </div>
          <div className="lg:w-64">
            <SortDropdown sort={sort} onSortChange={handleSortChange} />
          </div>
        </div>
      </div>

      {/* Main content */}
      {error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-red-600 font-medium mb-2">Error Loading Patients</div>
          <div className="text-red-500 text-sm mb-4">{error}</div>
          <button
            onClick={loadPatients}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : loading ? (
        <LoadingSkeleton />
      ) : patients.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="text-gray-400 text-6xl mb-4">🔍</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No patients found</h3>
          <p className="text-gray-600">
            Try adjusting your search criteria or filters to find patients.
          </p>
        </div>
      ) : (
        <>
          <div
            className={
              viewMode === 'card'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                : 'space-y-4'
            }
          >
            {patients.map((patient) => (
              <PatientCard
                key={patient.patient_id}
                patient={patient}
                viewMode={viewMode}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}
    </div>
  )
}