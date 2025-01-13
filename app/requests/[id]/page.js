"use client"
import { useEffect, useState } from 'react'
import { use } from 'react'
import { db } from '@/lib/firebase/init'
import { ref, onValue, remove } from 'firebase/database'
import { 
    Building2, 
    DollarSign, 
    Percent,
    CheckCircle,
    Clock,
    Calendar,
    Trash2,
    X
} from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'

export default function Request({ params }) {
    const requestId = useParams().id
    const [request, setRequest] = useState(null)
    const [loading, setLoading] = useState(true)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const router = useRouter()


    useEffect(() => {
        const requestRef = ref(db, `requests/${requestId}`)
        const unsubscribe = onValue(requestRef, (snapshot) => {
            if (snapshot.exists()) {
                setRequest(snapshot.val())
            }
            setLoading(false)
        })

        return () => unsubscribe()
    }, [requestId])

    const handleDelete = async () => {
            try {
                await remove(ref(db, `requests/${requestId}`))
                router.push('/dashboard')
            } catch (error) {
                console.error('Error deleting company:', error)
            }
            setShowDeleteModal(false)
        }


    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center">
                <div className="text-gray-500">Loading request details...</div>
            </div>
        )
    }

    if (!request) {
        return (
            <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center">
                <div className="text-gray-500">Request not found</div>
            </div>
        )
    }

    const getTimelineStatus = () => {
        const createdDate = new Date(request.createdAt)
        const cashDate = request.cashDate === 'immediate' 
            ? createdDate 
            : new Date(request.cashDate)
        const now = new Date()
        const isCashed = now > cashDate

        return {
            createdDate,
            cashDate,
            isCashed
        }
    }

    const { createdDate, cashDate, isCashed } = getTimelineStatus()

    return (
        <>
        <div className="bg-gray-100 p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900">Request Details</h1>

                    <div className='flex flex-row'>
                    <span className="px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
                        ID: {requestId}
                    </span>
                    <button
                        onClick={() => setShowDeleteModal(true)}
                        className="flex items-center gap-2 px-6 py-3 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                        >

                        <Trash2 size={20} />
                        Delete Company
                    </button>
                        </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Request Details */}
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <h2 className="text-lg font-semibold text-gray-900 mb-6">Request Information</h2>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <div className="flex items-center gap-2">
                                    <Building2 className="w-4 h-4 text-gray-500" />
                                    <span className="text-gray-900">Company</span>
                                </div>
                                <span className="font-medium text-gray-900">{request.companyName}</span>
                            </div>

                            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <div className="flex items-center gap-2">
                                    <DollarSign className="w-4 h-4 text-gray-500" />
                                    <span className="text-gray-900">Request Amount</span>
                                </div>
                                <span className="font-medium text-gray-900">${request.requestAmount}</span>
                            </div>

                            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-gray-500" />
                                    <span className="text-gray-900">Check Amount</span>
                                </div>
                                <span className="font-medium text-gray-900">${request.checkAmount}</span>
                            </div>

                            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-gray-500" />
                                    <span className="text-gray-900">Cash Date</span>
                                </div>
                                <span className="font-medium text-gray-900">
                                    {request.cashDate === 'immediate' 
                                        ? 'Immediate'
                                        : new Date(request.cashDate).toLocaleDateString()
                                    }
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Financial Details */}
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <h2 className="text-lg font-semibold text-gray-900 mb-6">Financial Details</h2>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <div className="flex items-center gap-2">
                                    <Percent className="w-4 h-4 text-gray-500" />
                                    <span className="text-gray-900">Processing Fee</span>
                                </div>
                                <span className="font-medium text-gray-900">${request.fee.toFixed(2)}</span>
                            </div>

                            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <div className="flex items-center gap-2">
                                    <Building2 className="w-4 h-4 text-gray-500" />
                                    <span className="text-gray-900">Bank Fee</span>
                                </div>
                                <span className="font-medium text-gray-900">${request.bankFee.toFixed(2)}</span>
                            </div>

                            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-gray-500" />
                                    <span className="text-gray-900">Fee Status</span>
                                </div>
                                <span className="font-medium text-gray-900">
                                    {request.feeIncludedInCheck ? "Included in Check" : "Not Included"}
                                </span>
                            </div>

                            <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                                <div className="flex items-center gap-2">
                                    <DollarSign className="w-4 h-4 text-blue-600" />
                                    <span className="font-medium text-gray-900">Customer Payout</span>
                                </div>
                                <span className="text-lg font-semibold text-blue-600">
                                    ${request.customerPayout.toFixed(2)}
                                </span>
                            </div>

                            <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg border border-green-200">
                                <div className="flex items-center gap-2">
                                    <DollarSign className="w-4 h-4 text-green-600" />
                                    <span className="font-medium text-gray-900">Profit</span>
                                </div>
                                <span className="text-lg font-semibold text-green-600">
                                    ${request.profit.toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Timeline */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-900 mb-6">Request Timeline</h2>
                    <div className="relative">
                        {/* Timeline line */}
                        <div className="absolute left-8 top-0 h-full w-0.5 bg-gray-200"></div>
                        
                        {/* Submission */}
                        <div className="relative flex items-center mb-8">
                            <div className="absolute left-8 -translate-x-1/2 w-4 h-4 rounded-full bg-green-500 border-4 border-white"></div>
                            <div className="ml-12">
                                <h3 className="font-medium text-gray-900">Request Submitted</h3>
                                <p className="text-sm text-gray-500">
                                    {createdDate.toLocaleDateString()} at {createdDate.toLocaleTimeString()}
                                </p>
                            </div>
                        </div>

                        {/* Cash Date */}
                        <div className="relative flex items-center">
                            <div className={`absolute left-8 -translate-x-1/2 w-4 h-4 rounded-full ${isCashed ? 'bg-green-500' : 'bg-gray-300'} border-4 border-white`}></div>
                            <div className="ml-12">
                                <h3 className="font-medium text-gray-900">Check Cash Date</h3>
                                <p className="text-sm text-gray-500">
                                    {request.cashDate === 'immediate' 
                                        ? 'Immediate Processing'
                                        : new Date(request.cashDate).toLocaleDateString()
                                    }
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
         
        </div>
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