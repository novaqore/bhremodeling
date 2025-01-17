"use client"
import { useState } from 'react'
import { X, PlusCircle } from 'lucide-react'
import { db } from '@/lib/firebase/init'
import { ref, update, push } from 'firebase/database'
import { useParams } from 'next/navigation'

export default function CompanySubcontractorAdd({company}) {
    const params = useParams()
    const [showSubModal, setShowSubModal] = useState(false)
    const [tempSub, setTempSub] = useState({
        name: '',
        multiplier: '0',
        kickback: '0'
    })

    const openNewSubModal = () => {
        setTempSub({
            name: '',
            multiplier: '0',
            kickback: '0'
        })
        setShowSubModal(true)
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
            multiplier: tempSub.multiplier ? Math.round(parseFloat(tempSub.multiplier) * 10) / 1000 : 0,
            kickback: tempSub.kickback ? Math.round(parseFloat(tempSub.kickback) * 10) / 1000 : 0
        }
        
        const newSubRef = push(ref(db, `companies/${company.id}/subcontractors`))
        await update(newSubRef, {
            ...subDetails,
            id: newSubRef.key
        })
        
        setShowSubModal(false)
        setTempSub({ name: '', multiplier: '', kickback: '' })
    }

    return (
        <>
            <button
                onClick={openNewSubModal}
                className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
                <PlusCircle size={20} />
                Add Sub-Company
            </button>

            {showSubModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-md w-full p-6 relative">

                        <div className="mb-6">
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">
                                Add Sub-Company
                            </h3>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Sub-Company Name
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
                                onClick={() => setShowSubModal(false)}
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