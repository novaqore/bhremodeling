"use client"

import { useEffect, useState } from 'react'
import { db } from '@/lib/firebase/init'
import { ref, onValue } from 'firebase/database'
import { Building2 } from 'lucide-react'

export default function RequestsNewCompanySelect({selectedCompany, setSelectedCompany, selectedSubCompany, setSelectedSubCompany, companies, setCompanies}) {
    const [isOpen, setIsOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        const companiesRef = ref(db, 'companies')
        const unsubscribe = onValue(companiesRef, (snapshot) => {
            if (snapshot.exists()) {
                setCompanies(snapshot.val())
            }
        })
        return () => unsubscribe()
    }, [])

    const filteredCompanies = Object.entries(companies).filter(([_, company]) => 
        company.companyName.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="space-y-3">
            <div>
                <label className="block text-sm font-medium text-gray-900 mb-1.5">
                    <div className="flex items-center">
                        <Building2 className="w-4 h-4 mr-1.5 text-gray-500" />
                        Company
                    </div>
                </label>
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setIsOpen(!isOpen)}
                        className="w-full px-3 py-2.5 text-left rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <span className="block truncate">
                            {selectedCompany ? companies[selectedCompany]?.companyName : 'Select company...'}
                        </span>
                    </button>
                    
                    {isOpen && (
                        <div className="absolute w-full mt-1 max-h-56 overflow-auto bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                            <div className="sticky top-0 bg-white border-b border-gray-200">
                                <input
                                    type="text"
                                    placeholder="Search companies..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-3 py-2 bg-transparent focus:outline-none"
                                    autoFocus
                                />
                            </div>
                            <div className="py-1">
                                {filteredCompanies.map(([id, company]) => (
                                    <button
                                        key={id}
                                        type="button"
                                        onClick={() => {
                                            setSelectedCompany(id)
                                            setSelectedSubCompany('')
                                            setIsOpen(false)
                                            setSearchTerm('')
                                        }}
                                        className="w-full px-3 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                                    >
                                        {company.companyName}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Subcontractor Selection - Shows only if company has subs */}
            {selectedCompany && companies[selectedCompany]?.subcontractors && (
                <div>
                    <label className="block text-sm font-medium text-gray-900 mb-1.5">
                        <div className="flex items-center">
                            <Building2 className="w-4 h-4 mr-1.5 text-gray-500" />
                            Sub-Company
                        </div>
                    </label>
                    <select
                        value={selectedSubCompany}
                        onChange={(e) => setSelectedSubCompany(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">None</option>
                        {Object.entries(companies[selectedCompany].subcontractors).map(([id, sub]) => (
                            <option key={id} value={id}>
                                {sub.name} - {(parseFloat(sub.multiplier) * 100).toFixed(1)}%
                            </option>
                        ))}
                    </select>
                </div>
            )}
        </div>
    )
}