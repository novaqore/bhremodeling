"use client"
import { ArrowLeftRight } from 'lucide-react'

export default function RequestNewDetailsKickback({ companies, selectedCompany, selectedSubCompany, kickbackFee }) {
    const company = companies[selectedCompany]
    const subCompany = company?.subcontractors?.[selectedSubCompany]
    
    const getCurrentKickback = () => {
        if (!selectedCompany || !companies[selectedCompany]) return 0

        // First check if there's a selected sub-company with a valid kickback
        if (selectedSubCompany && subCompany?.kickback) {
            const subKickback = parseFloat(subCompany.kickback)
            if (subKickback > 0) return subKickback
        }

        // If no valid sub-company kickback, use main company kickback
        return parseFloat(company?.kickback || 0)
    }

    const hasKickback = () => {
        // Check sub first, then fall back to main company
        if (selectedSubCompany && subCompany?.kickback > 0) {
            return true
        }
        return company?.kickback > 0
    }

    return (
        <div className={`flex justify-between items-center p-4 ${!hasKickback() ? 'bg-gray-50 border-gray-200' : 'bg-purple-50 border-purple-200'} rounded-lg border`}>
            <div className="flex items-center gap-2">
                <ArrowLeftRight className={`w-5 h-5 ${!hasKickback() ? 'text-gray-400' : 'text-purple-600'}`} />
                <div className="flex flex-col">
                    <span className={`font-medium ${!hasKickback() ? 'text-gray-500' : 'text-gray-900'}`}>
                        {!hasKickback() ? 'No Kickback' : `Kickback: ${companies[selectedCompany]?.companyName || "Select Company"}`}
                    </span>
                    {!hasKickback() ? null : 
                        <span className="text-sm text-purple-600">
                            ({(getCurrentKickback() * 100).toFixed(1)}% of profit)
                        </span>
                    }
                </div>
            </div>
            <span className={`text-lg font-semibold ${!hasKickback() ? 'text-gray-400' : 'text-purple-600'}`}>
                ${kickbackFee.toFixed(2)}
            </span>
        </div>
    )
}