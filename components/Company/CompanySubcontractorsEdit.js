"use client"
import { useParams, useSearchParams } from 'next/navigation'
import { X, Percent } from 'lucide-react'
import { db } from '@/lib/firebase/init'
import { ref, update } from 'firebase/database'
import { useState } from 'react'

export default function CompanySubcontractorsEdit({ sub }) {
    const searchParams = useSearchParams()
        const companyId = searchParams.get('id')
    const [showEditModal, setShowEditModal] = useState(false)
    const [tempSub, setTempSub] = useState({
        name: '',
        multiplier: '',
        kickback: ''
    })

    const openEditModal = () => {
        setTempSub({
            ...sub,
            multiplier: sub.multiplier ? (sub.multiplier * 100).toString() : '',
            kickback: sub.kickback ? (sub.kickback * 100).toString() : ''
        })
        setShowEditModal(true)
    }

    const handleChange = (field, value) => {
        const sanitizedValue = value.replace(/[^\d.]/g, '')
        const parts = sanitizedValue.split('.')
        let finalValue = sanitizedValue
        if (parts[1]?.length > 1) {
            finalValue = `${parts[0]}.${parts[1].charAt(0)}`
        }
        setTempSub({...tempSub, [field]: finalValue})
    }

    const handleSaveSub = async () => {
        const subDetails = {
            name: tempSub.name,
            multiplier: tempSub.multiplier ? parseFloat(tempSub.multiplier) / 100 : 0,
            kickback: tempSub.kickback ? parseFloat(tempSub.kickback) / 100 : 0,
        }
        console.log('Saving:', subDetails)
        try {
            await update(ref(db, `companies/-${companyId}/subcontractors/${sub.id}`), subDetails)
            setShowEditModal(false)
        } catch (error) {
            console.error('Error saving:', error)
        }
    }

    return (
        <>
            <button
                onClick={openEditModal}
                className="text-blue-600 hover:text-blue-800 px-3 py-1 rounded"
            >
                Edit
            </button>

            {showEditModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
                        <button 
                            onClick={() => setShowEditModal(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                        >
                            <X size={20} />
                        </button>

                        <div className="mb-6">
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                Edit Subcontractor
                            </h3>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Subcontractor Name
                                    </label>
                                    <input
                                        type="text"
                                        value={tempSub.name}
                                        onChange={e => setTempSub({...tempSub, name: e.target.value})}
                                        className="w-full p-2 border border-gray-300 rounded-md text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter name"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Multiplier Rate
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={tempSub.multiplier}
                                            onChange={e => handleChange('multiplier', e.target.value)}
                                            className="w-full p-2 border border-gray-300 rounded-md text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-8"
                                            placeholder="Enter rate"
                                        />
                                        <span className="absolute right-3 top-2 text-gray-500">%</span>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Kickback Rate
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={tempSub.kickback}
                                            onChange={e => handleChange('kickback', e.target.value)}
                                            className="w-full p-2 border border-gray-300 rounded-md text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-8"
                                            placeholder="Enter rate"
                                        />
                                        <span className="absolute right-3 top-2 text-gray-500">%</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveSub}
                                className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}