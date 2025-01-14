"use client"
import { useParams, useRouter } from 'next/navigation'
import { Trash2, X } from 'lucide-react'
import { db } from '@/lib/firebase/init'
import { ref, remove } from 'firebase/database'
import { useEffect, useState } from 'react'

export default function CompanyDelete({ company }) {
    const params = useParams()
    const router = useRouter()
    const [showDeleteModal, setShowDeleteModal] = useState(false)



    const handleDelete = async () => {
        try {
            await remove(ref(db, `companies/${params.id}`))
            router.push('/companies')
        } catch (error) {
            console.error('Error deleting company:', error)
        }
        setShowDeleteModal(false)
    }

    if (!company) return <div className="p-8 text-gray-900">Loading...</div>

    return (
        <>
                    <button
                        onClick={() => setShowDeleteModal(true)}
                        className="flex items-center gap-2 px-6 py-3 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                    >
                        <Trash2 size={20} />
                        Delete Company
                    </button>
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
                        <button 
                            onClick={() => setShowDeleteModal(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                        >
                            <X size={20} />
                        </button>

                        <div className="mb-6">
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Delete Company</h3>
                            <p className="text-gray-600">
                                Are you sure you want to delete {company.companyName}? This action cannot be undone.
                            </p>
                        </div>

                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
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