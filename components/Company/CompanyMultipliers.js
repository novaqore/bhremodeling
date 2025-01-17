"use client"
import { useParams, useSearchParams } from 'next/navigation'
import { Percent } from 'lucide-react'
import { ref, update } from 'firebase/database'
import { db } from '@/lib/firebase/init'
import { useState, useEffect } from 'react'

export default function CompanyMultipliers({ company }) {
    const searchParams = useSearchParams()
    const companyId = searchParams.get('id')
    const [multiplier, setMultiplier] = useState('0')
    const [kickback, setKickback] = useState('0')

    useEffect(() => {
        if (company) {
            // Round to prevent floating point issues
            setMultiplier(company.multiplier ? Math.round(company.multiplier * 1000) / 10 : '')
            setKickback(company.kickback ? Math.round(company.kickback * 1000) / 10 : '')
        }
    }, [company])

    const handleUpdate = (field, value) => {
        // Round to 3 decimal places to avoid floating point issues
        const number = value ? Math.round(parseFloat(value) * 10) / 1000 : 0
        update(ref(db, `companies/${company.id}`), { [field]: number })
    }

    const handleInput = (e, field, setter) => {
        const value = e.target.value.replace(/[^\d.]/g, '')
        const parts = value.split('.')
        let finalValue = value
        if (parts[1]?.length > 1) {
            finalValue = `${parts[0]}.${parts[1].charAt(0)}`
        }
        setter(finalValue)
        handleUpdate(field, finalValue)
    }

    if (!company) return <div className="p-8 text-gray-900">Loading...</div>

    return (
        <div className="bg-green-50 rounded-2xl p-8 shadow-sm">
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
                            value={multiplier}
                            onChange={e => handleInput(e, 'multiplier', setMultiplier)}
                            className="w-full p-3 rounded-lg border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-8"
                            placeholder="Enter rate"
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
                            value={kickback}
                            onChange={e => handleInput(e, 'kickback', setKickback)}
                            className="w-full p-3 rounded-lg border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-8"
                            placeholder="Enter rate"
                        />
                        <span className="absolute right-3 top-3 text-gray-700">%</span>
                    </div>
                </div>
            </div>
        </div>
    )
}