"use client"
import CompanySubcontractorsDelete from './CompanySubcontractorsDelete'
import CompanySubcontractorsEdit from './CompanySubcontractorsEdit'
import CompanySubcontractorAdd from './CompanySubcontractorAdd'

export default function CompanySubcontractors({ company }) {
    if (!company) return <div className="p-8 text-gray-900">Loading...</div>

    return (
        <>
            <div className="mt-8 bg-white rounded-2xl p-8 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Subcontractors</h2>
                    <CompanySubcontractorAdd />
                </div>

                <div className="space-y-3">
                    {company.subcontractors && Object.entries(company.subcontractors).map(([key, sub]) => (
                        <div key={key} className="p-4 rounded-lg bg-gray-50 border border-gray-100 hover:border-gray-200 transition-colors">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="font-medium text-gray-900">{sub.name}</h3>
                                </div>
                                <div className="flex gap-2">
                                    <CompanySubcontractorsEdit sub={{...sub, id: key}} />
                                    <CompanySubcontractorsDelete sub={{...sub, id: key}} />
                                </div>
                            </div>
                            <div className="mt-2 flex gap-4">
                                <p className="text-sm text-gray-500 bg-white px-3 py-1 rounded-md">
                                    Multiplier: {Math.round(sub.multiplier * 100)}%
                                </p>
                                <p className="text-sm text-gray-500 bg-white px-3 py-1 rounded-md">
                                    Kickback: {Math.round(sub.kickback * 100)}%
                                </p>
                            </div>
                        </div>
                    ))}
                    
                    {(!company.subcontractors || Object.keys(company.subcontractors).length === 0) && (
                        <div className="text-center text-gray-500 py-8">
                            No subcontractors added yet
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}