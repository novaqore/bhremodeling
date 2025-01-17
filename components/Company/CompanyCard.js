'use client'

import { useRouter } from "next/navigation"
import { Building2, User, TrendingUp, BarChart3 } from "lucide-react"

export default function CompanyCard({ company }) {
  const router = useRouter()
  
  return (
    <div
      onClick={() => router.push(`/company?id=${company.id.slice(1)}`)}
      className="group cursor-pointer"
    >
      <div className="bg-white border border-gray-200 rounded-lg p-5 transition-all duration-200 hover:shadow-md">
        {/* Company Header */}
        <div className="flex items-start gap-4 pb-4 border-b border-gray-100">
          <div className="flex-shrink-0 p-2.5 bg-blue-50 rounded-lg">
            <Building2 className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
              {company.companyName}
            </h3>
            <div className="flex items-center mt-1 text-gray-500">
              <User className="w-4 h-4 mr-1.5" />
              <span className="text-sm truncate">{company.contactName}</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          {/* Multiplier */}
          <div className="bg-gray-50 rounded-md p-3 group-hover:bg-blue-50/50 transition-colors">
            <div className="flex items-center gap-1.5 mb-1">
              <TrendingUp className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600 font-medium">Multiplier</span>
            </div>
            <div className="flex items-baseline">
              <span className="text-xl font-semibold text-gray-900">
                {Math.round(company.multiplier * 100)}
              </span>
              <span className="text-sm text-gray-500 ml-1">%</span>
            </div>
          </div>

          {/* Kickback */}
          <div className="bg-gray-50 rounded-md p-3 group-hover:bg-blue-50/50 transition-colors">
            <div className="flex items-center gap-1.5 mb-1">
              <BarChart3 className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600 font-medium">Kickback</span>
            </div>
            <div className="flex items-baseline">
              <span className="text-xl font-semibold text-gray-900">
                {Math.round(company.kickback * 100)}
              </span>
              <span className="text-sm text-gray-500 ml-1">%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}