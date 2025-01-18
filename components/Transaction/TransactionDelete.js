"use client"
import { useSearchParams, useRouter } from 'next/navigation'
import { Trash2, X, AlertTriangle } from 'lucide-react'
import { db } from '@/lib/firebase/init'
import { ref, remove } from 'firebase/database'
import { useState } from 'react'

export default function TransactionDelete({ request }) {
    const router = useRouter()
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [confirmText, setConfirmText] = useState('')
    
    const CONFIRM_TEXT = 'delete this transaction'
    const isConfirmed = confirmText.toLowerCase() === CONFIRM_TEXT

    const handleDelete = async () => {
        if (!isConfirmed) return
        
        try {
            await remove(ref(db, `requests/-${request.id}`))
            router.back()
        } catch (error) {
            console.error('Error deleting company:', error)
        }
        setShowDeleteModal(false)
    }

    if (!request) return null

    return (
        <>
            <button
                onClick={() => setShowDeleteModal(true)}
                className="flex items-center gap-2 px-6 py-3 text-red-600 hover:bg-red-50 rounded-full transition-colors"
            >
                <Trash2 size={20} />
                Delete Transaction
            </button>
            
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
                        <button 
                            onClick={() => {
                                setShowDeleteModal(false)
                                setConfirmText('')
                            }}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                        >
                            <X size={20} />
                        </button>

                        <div className="space-y-6">
                            {/* Warning Header */}
                            <div className="flex items-center gap-3 border-b border-red-200 pb-4">
                                <div className="p-3 bg-red-100 rounded-full">
                                    <AlertTriangle className="h-6 w-6 text-red-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900">Delete Transaction</h3>
                                    <p className="text-sm text-gray-600">This action cannot be undone</p>
                                </div>
                            </div>

                            {/* Warning Content */}
                            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                                <p className="text-red-800 font-medium mb-1">Warning: Destructive Action</p>
                                <p className="text-red-700 text-sm">
                                    You are about to delete <span className="font-semibold">{request.id}</span>. 
                                    This will permanently remove all associated data and cannot be recovered.
                                </p>
                            </div>

                            {/* Confirmation Input */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    To confirm, type <span className="font-mono bg-gray-100 px-1 py-0.5 rounded text-gray-800">{CONFIRM_TEXT}</span> below:
                                </label>
                                <input
                                    type="text"
                                    value={confirmText}
                                    onChange={(e) => setConfirmText(e.target.value)}
                                    placeholder="Type to confirm deletion"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-colors"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
                            <button
                                onClick={() => {
                                    setShowDeleteModal(false)
                                    setConfirmText('')
                                }}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={!isConfirmed}
                                className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                                    isConfirmed 
                                        ? 'bg-red-600 text-white hover:bg-red-700' 
                                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                }`}
                            >
                                <Trash2 size={18} />
                                Delete Transaction
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}