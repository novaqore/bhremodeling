// CompanySubcontractorsDelete.js
"use client"
import { useParams } from 'next/navigation'
import { X } from 'lucide-react'
import { db } from '@/lib/firebase/init'
import { ref, remove } from 'firebase/database'
import { useState } from 'react'

export default function CompanySubcontractorsDelete({ sub }) {
    const params = useParams()
    const [showDeleteSubModal, setShowDeleteSubModal] = useState(false)

    const handleDeleteSub = async () => {
        await remove(ref(db, `companies/${params.id}/subcontractors/${sub.id}`))
        setShowDeleteSubModal(false)
    }

    return (
        <>
            <button
                onClick={() => setShowDeleteSubModal(true)}
                className="text-red-600 hover:text-red-800 px-3 py-1 rounded"
            >
                Delete
            </button>

            {/* Delete Sub Confirmation Modal */}
            {showDeleteSubModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
                        <button 
                            onClick={() => setShowDeleteSubModal(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                        >
                            <X size={20} />
                        </button>

                        <div className="mb-6">
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Delete Subcontractor</h3>
                            <p className="text-gray-600">
                                Are you sure you want to delete {sub.name}? This action cannot be undone.
                            </p>
                        </div>

                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setShowDeleteSubModal(false)}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteSub}
                                className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}