import Image from 'next/image'

interface ContactInfo {
  address: string | null
  number: string
  email: string
}

interface Patient {
  patient_id: number
  patient_name: string
  age: number
  medical_issue: string
  photo_url?: string
  contact: ContactInfo[]
}

interface PatientCardProps {
  patient: Patient
  viewMode: 'card' | 'row'
}

export function PatientCard({ patient, viewMode }: PatientCardProps) {
  const contactInfo = patient.contact?.[0] || { email: '', number: '', address: null }

  const formatMedicalIssue = (issue: string) =>
    issue.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())

  const getSeverityColor = (issue: string) => {
    const severityMap: Record<string, string> = {
      fever: 'bg-red-100 text-red-800',
      headache: 'bg-yellow-100 text-yellow-800',
      rash: 'bg-orange-100 text-orange-800',
      back_pain: 'bg-blue-100 text-blue-800',
      allergies: 'bg-purple-100 text-purple-800',
    }
    return severityMap[issue] || 'bg-gray-100 text-gray-800'
  }

  const FallbackAvatar = () => (
    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
      {patient.patient_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
    </div>
  )

  if (viewMode === 'row') {
    return (
      <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Photo */}
            <div className="flex-shrink-0">
              {patient.photo_url ? (
                <Image
                  src={patient.photo_url}
                  alt={`${patient.patient_name} photo`}
                  width={48}
                  height={48}
                  className="rounded-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                  }}
                />
              ) : <FallbackAvatar />}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-3">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {patient.patient_name}
                </h3>
                <span className="text-sm text-gray-500">Age {patient.age}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(patient.medical_issue)}`}>
                  {formatMedicalIssue(patient.medical_issue)}
                </span>
              </div>
              <p className="text-xs text-gray-400">ID: {patient.patient_id}</p>

              {/* Address */}
              {contactInfo.address && (
                <p className="text-sm text-gray-600 mt-1">
                  📍 {contactInfo.address}
                </p>
              )}
            </div>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col items-end text-sm text-gray-600 space-y-1">
            {contactInfo.email && (
              <a href={`mailto:${contactInfo.email}`} className="hover:text-primary-600">
                📧 {contactInfo.email}
              </a>
            )}
            {contactInfo.number && (
              <a href={`tel:${contactInfo.number}`} className="hover:text-primary-600">
                📞 {contactInfo.number}
              </a>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Card view
  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-200 p-6">
      <div className="flex items-center space-x-4 mb-4">
        <div className="flex-shrink-0 relative">
          {patient.photo_url ? (
            <Image
              src={patient.photo_url}
              alt={`${patient.patient_name} photo`}
              width={48}
              height={48}
              className="rounded-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
              }}
            />
          ) : <FallbackAvatar />}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {patient.patient_name}
          </h3>
          <p className="text-sm text-gray-600">{patient.age} years old</p>
          <p className="text-xs text-gray-400">ID: {patient.patient_id}</p>
        </div>
      </div>

      <div className="mb-4">
        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(patient.medical_issue)}`}>
          {formatMedicalIssue(patient.medical_issue)}
        </span>
      </div>

      {/* Address */}
      {contactInfo.address && (
        <div className="flex items-center text-sm text-gray-600 mb-2">
          <span className="text-gray-400 mr-2 text-base">📍</span>
          <span className="truncate">{contactInfo.address}</span>
        </div>
      )}

      {/* Contact */}
      <div className="space-y-2">
        {contactInfo.email && (
          <div className="flex items-center text-sm text-gray-600">
            <span className="text-gray-400 mr-2 text-base">📧</span>
            <a
              href={`mailto:${contactInfo.email}`}
              className="hover:text-primary-600 transition-colors truncate"
              title={contactInfo.email}
            >
              {contactInfo.email}
            </a>
          </div>
        )}
        {contactInfo.number && (
          <div className="flex items-center text-sm text-gray-600">
            <span className="text-gray-400 mr-2 text-base">📞</span>
            <a
              href={`tel:${contactInfo.number}`}
              className="hover:text-primary-600 transition-colors"
            >
              {contactInfo.number}
            </a>
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <button className="flex-1 px-3 py-2 text-xs font-medium text-primary-600 bg-primary-50 hover:bg-primary-100 rounded-md transition-colors">
            View Details
          </button>
          <button className="flex-1 px-3 py-2 text-xs font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors">
            Contact
          </button>
        </div>
      </div>
    </div>
  )
}