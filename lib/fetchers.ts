import { ApiResponse } from '@/app/page'

/**
 * Fetches patient data from the API with given query parameters
 * @param queryString - URL query string with parameters
 * @returns Promise<ApiResponse> - API response with patient data and metadata
 */
export async function fetchPatients(queryString: string = ''): Promise<ApiResponse> {
  const url = `/api/patients${queryString ? `?${queryString}` : ''}`
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    })

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`
      
      try {
        const errorData = await response.json()
        if (errorData.error) {
          errorMessage = errorData.error
        }
        if (errorData.message) {
          errorMessage += ` - ${errorData.message}`
        }
      } catch {
      }
      
      throw new Error(errorMessage)
    }

    const data: ApiResponse = await response.json()
    
    if (!data.data || !Array.isArray(data.data)) {
      throw new Error('Invalid response format: missing or invalid data array')
    }
    
    if (!data.meta || typeof data.meta !== 'object') {
      throw new Error('Invalid response format: missing or invalid meta object')
    }

    const requiredMetaFields = ['total', 'page', 'limit', 'totalPages']
    for (const field of requiredMetaFields) {
      if (!(field in data.meta) || typeof data.meta[field as keyof typeof data.meta] !== 'number') {
        throw new Error(`Invalid response format: missing or invalid meta.${field}`)
      }
    }

    return data

  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to the server. Please check your connection.')
    }
    
    throw error
  }
}

/**
 * Utility function to build query parameters for API calls
 * @param params - Object with query parameters
 * @returns URLSearchParams instance
 */
export function buildQueryParams(params: Record<string, string | number | boolean | undefined>): URLSearchParams {
  const searchParams = new URLSearchParams()
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '' && value !== null) {
      searchParams.set(key, String(value))
    }
  })
  
  return searchParams
}

/**
 * Utility function to handle API errors consistently
 * @param error - The error object
 * @returns User-friendly error message
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  
  if (typeof error === 'string') {
    return error
  }
  
  return 'An unexpected error occurred. Please try again.'
}

/**
 * Utility function to validate patient data
 * @param patient - Patient object to validate
 * @returns boolean indicating if patient is valid
 */
export function isValidPatient(patient: any): boolean {
  return (
    typeof patient === 'object' &&
    patient !== null &&
    typeof patient.id === 'number' &&
    typeof patient.patient_name === 'string' &&
    typeof patient.age === 'number' &&
    typeof patient.email === 'string' &&
    typeof patient.contact_number === 'string' &&
    typeof patient.medical_issue === 'string'
  )
}

/**
 * Type guard for API response
 * @param data - Data to check
 * @returns boolean indicating if data is a valid ApiResponse
 */
export function isApiResponse(data: any): data is ApiResponse {
  return (
    typeof data === 'object' &&
    data !== null &&
    Array.isArray(data.data) &&
    data.data.every(isValidPatient) &&
    typeof data.meta === 'object' &&
    data.meta !== null &&
    typeof data.meta.total === 'number' &&
    typeof data.meta.page === 'number' &&
    typeof data.meta.limit === 'number' &&
    typeof data.meta.totalPages === 'number'
  )
}