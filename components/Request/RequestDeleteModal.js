"use client"
import { useState } from 'react'
import { db } from '@/lib/firebase/init'
import { ref, remove } from 'firebase/database'
import { Trash2, X } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function RequestDeleteModal({ setShowDeleteModal, requestId }) {
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const router = useRouter()

    const handleDelete = async () => {
            try {
                await remove(ref(db, `requests/${requestId}`))
                router.push('/requests')
            } catch (error) {
                console.error('Error deleting company:', error)
            }
            setShowDeleteModal(false)
        }

    return (
        <>
            <button
                onClick={() => setShowDeleteModal(true)}
                className="flex items-center justify-center gap-2 px-4 py-3 text-red-600 hover:bg-red-50 rounded-full transition-colors"
            >
                <Trash2 size={20} />
                <span>Delete Company</span>
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
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Delete Request</h3>
                            <p className="text-gray-600">
                                Are you sure you want to delete? This action cannot be undone.
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