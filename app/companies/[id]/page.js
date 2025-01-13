"use client"
import { useParams, useRouter } from 'next/navigation'
import { Building2, User, Percent, Trash2, ArrowLeft } from 'lucide-react'
import { db } from '@/lib/firebase/init'
import { ref, onValue, update, remove } from 'firebase/database'
import { useEffect, useState } from 'react'

export default function Company() {
    const params = useParams()
    const router = useRouter()
    const [company, setCompany] = useState(null)

    useEffect(() => {
        const companyRef = ref(db, `companies/${params.id}`)
        const unsubscribe = onValue(companyRef, (snapshot) => {
            if (snapshot.exists()) {
                setCompany(snapshot.val())
            }
        })

        return () => unsubscribe()
    }, [params.id])

    const handleUpdate = (field, value) => {
        update(ref(db, `companies/${params.id}`), { [field]: value })
    }

    const handleDelete = async () => {
        await remove(ref(db, `companies/${params.id}`))
        router.push('/companies')
    }

    if (!company) return <div className="p-8 text-gray-900">Loading...</div>

    return (
        <div className="max-w-5xl mx-auto p-8">
            <div className="mb-8">
                <button 
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
                >
                    <ArrowLeft size={20} className="mr-2" />
                    Back to Companies
                </button>

                <h1 className="text-4xl font-bold text-gray-900">
                    {company.companyName}
                </h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-2xl p-8 shadow-sm">
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

                <div className="bg-white rounded-2xl p-8 shadow-sm">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Rates</h2>
                    <div className="space-y-6">
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-900 mb-2">
                                <Percent className="w-4 h-4 text-gray-700" />
                                Multiplier Rate
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={Math.round(company.multiplier * 100)}
                                    onChange={e => {
                                        const value = e.target.value.replace(/[^0-9]/g, '')
                                        const number = value === '' ? 0 : parseInt(value)
                                        if (number <= 100) {
                                            handleUpdate('multiplier', number / 100)
                                        }
                                    }}
                                    className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-8"
                                    placeholder="Enter rate (0-100)"
                                />
                                <span className="absolute right-3 top-3 text-gray-700">%</span>
                            </div>
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-900 mb-2">
                                <Percent className="w-4 h-4 text-gray-700" />
                                Kickback Rate
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={Math.round(company.kickback * 100)}
                                    onChange={e => {
                                        const value = e.target.value.replace(/[^0-9]/g, '')
                                        const number = value === '' ? 0 : parseInt(value)
                                        if (number <= 100) {
                                            handleUpdate('kickback', number / 100)
                                        }
                                    }}
                                    className="w-full p-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-8"
                                    placeholder="Enter rate (0-100)"
                                />
                                <span className="absolute right-3 top-3 text-gray-700">%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 flex justify-end">
                <button
                    onClick={handleDelete}
                    className="flex items-center gap-2 px-6 py-3 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                >
                    <Trash2 size={20} />
                    Delete Company
                </button>
            </div>
        </div>
    )
}