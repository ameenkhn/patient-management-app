import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

interface Patient {
  id: number
  patient_name: string
  age: number
  email: string
  contact_number: string
  medical_issue: string
  photo_url?: string
}

interface ApiResponse {
  data: Patient[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

function loadPatientsData(): Patient[] {
  try {
    const dataPath = path.join(process.cwd(), 'data', 'patients.json')
    const jsonData = fs.readFileSync(dataPath, 'utf8')
    return JSON.parse(jsonData)
  } catch (error) {
    console.error('Error loading patients data:', error)
    throw new Error('Failed to load patients data')
  }
}

function filterPatients(patients: Patient[], params: URLSearchParams): Patient[] {
  let filteredPatients = [...patients]

  const search = params.get('search')?.toLowerCase()
  if (search) {
    filteredPatients = filteredPatients.filter(patient =>
      patient.patient_name.toLowerCase().includes(search) ||
      patient.medical_issue.toLowerCase().includes(search)
    )
  }

  const ageMin = params.get('ageMin')
  const ageMax = params.get('ageMax')
  if (ageMin) {
    const minAge = parseInt(ageMin)
    if (!isNaN(minAge)) {
      filteredPatients = filteredPatients.filter(patient => patient.age >= minAge)
    }
  }
  if (ageMax) {
    const maxAge = parseInt(ageMax)
    if (!isNaN(maxAge)) {
      filteredPatients = filteredPatients.filter(patient => patient.age <= maxAge)
    }
  }

  const medicalIssue = params.get('medical_issue')
  if (medicalIssue) {
    const issues = medicalIssue.split(',').map(issue => issue.trim().toLowerCase())
    filteredPatients = filteredPatients.filter(patient =>
      issues.includes(patient.medical_issue.toLowerCase())
    )
  }

  return filteredPatients
}

function sortPatients(patients: Patient[], sortBy?: string, sortOrder?: string): Patient[] {
  if (!sortBy) return patients

  const sortedPatients = [...patients]

  sortedPatients.sort((a, b) => {
    let compareValue = 0

    switch (sortBy) {
      case 'age':
        compareValue = a.age - b.age
        break
      case 'patient_name':
        compareValue = a.patient_name.localeCompare(b.patient_name)
        break
      default:
        return 0
    }

    return sortOrder === 'desc' ? -compareValue : compareValue
  })

  return sortedPatients
}

function paginateResults(patients: Patient[], page: number, limit: number) {
  const total = patients.length
  const totalPages = Math.ceil(total / limit)
  const offset = (page - 1) * limit
  const paginatedPatients = patients.slice(offset, offset + limit)

  return {
    data: paginatedPatients,
    meta: {
      total,
      page,
      limit,
      totalPages
    }
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20')))
    const sortBy = searchParams.get('sortBy') || ''
    const sortOrder = searchParams.get('sortOrder') || 'asc'

    const validSortFields = ['age', 'patient_name']
    if (sortBy && !validSortFields.includes(sortBy)) {
      return NextResponse.json(
        { error: `Invalid sortBy field. Must be one of: ${validSortFields.join(', ')}` },
        { status: 400 }
      )
    }

    const validSortOrders = ['asc', 'desc']
    if (sortOrder && !validSortOrders.includes(sortOrder)) {
      return NextResponse.json(
        { error: `Invalid sortOrder. Must be one of: ${validSortOrders.join(', ')}` },
        { status: 400 }
      )
    }

    const allPatients = loadPatientsData()

    const filteredPatients = filterPatients(allPatients, searchParams)

    const sortedPatients = sortPatients(filteredPatients, sortBy, sortOrder)

    const result = paginateResults(sortedPatients, page, limit)

    return NextResponse.json(result, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    })

  } catch (error) {
    console.error('API Error:', error)
    
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    )
  }
}

export async function POST() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
}

export async function PUT() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
}