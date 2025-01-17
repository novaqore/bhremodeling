"use client"
import { ArrowLeftRight } from 'lucide-react'

export default function RequestNewDetailsKickback({ companies, selectedCompany, selectedSubCompany, kickbackFee }) {
    const company = companies[selectedCompany]
    const subCompany = company?.subcontractors?.[selectedSubCompany]
    console.log(subCompany?.kickback)
    console.log(company?.kickback)
    const getCurrentKickback = () => {
        if (!selectedCompany || !companies[selectedCompany]) return 0

        if (selectedSubCompany) {
            const sub = companies[selectedCompany].subcontractors?.[selectedSubCompany]
            return sub ? parseFloat(sub.kickback || 0) : 0
        }

        return parseFloat(companies[selectedCompany].kickback || 0)
    }

    return (
        <div className={`flex justify-between items-center p-4 ${subCompany?.kickback <= 0 || company?.kickback <= 0 || !company ? 'bg-gray-50 border-gray-200' : 'bg-purple-50 border-purple-200'} rounded-lg border`}>
            <div className="flex items-center gap-2">
                <ArrowLeftRight className={`w-5 h-5 ${subCompany?.kickback <= 0 || company?.kickback <= 0 || !company ? 'text-gray-400' : 'text-purple-600'}`} />
                <div className="flex flex-col">
                    <span className={`font-medium ${subCompany?.kickback <= 0 || company?.kickback <= 0 || !company ? 'text-gray-500' : 'text-gray-900'}`}>
                        {subCompany?.kickback <= 0 || company?.kickback <= 0 ? 'No Kickback' : `Kickback: ${companies[selectedCompany]?.companyName || "Select Company"}`}
                    </span>
                    {
                        subCompany?.kickback <= 0 || company?.kickback <= 0 || !company ? null :
                    <span className={`text-sm ${subCompany?.kickback <= 0 || company?.kickback <= 0 ? 'text-gray-400' : 'text-purple-600'}`}>
                        ({(getCurrentKickback() * 100).toFixed(1)}% of profit)
                    </span>
                    }
                </div>
            </div>
            <span className={`text-lg font-semibold ${subCompany?.kickback <= 0 || company?.kickback <= 0 ? 'text-gray-400' : 'text-purple-600'}`}>
                ${kickbackFee.toFixed(2)}
            </span>
        </div>
    )
}