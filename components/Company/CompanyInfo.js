"use client"
import { db } from '@/lib/firebase/init'
import { ref, update } from 'firebase/database'
import { Building2, User } from 'lucide-react'

export default function CompanyInfo({ company }) {
    const handleUpdate = (field, value) => {
            update(ref(db, `companies/${params.id}`), { [field]: value })
        }


    if (!company) return <div className="p-8 text-gray-900">Loading...</div>

    return (
        <div className="rounded-2xl p-8 shadow-sm bg-blue-50">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">Company Information</h2>
                        <div className="space-y-6">
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-900 mb-2">
                                    <Building2 className="w-4 h-4 text-gray-700" />
                                    Company Name
                                </label>
                                <input
                                    type="text"
                                    value={company.companyName}
                                    onChange={e => handleUpdate('companyName', e.target.value)}
                                    className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter company name"
                                />
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-900 mb-2">
                                    <User className="w-4 h-4 text-gray-700" />
                                    Contact Name
                                </label>
                                <input
                                    type="text"
                                    value={company.contactName}
                                    onChange={e => handleUpdate('contactName', e.target.value)}
                                    className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter contact name"
                                />
                            </div>
                        </div>
                    </div>
    )
}