'use client'

import { useSearchParams } from 'next/navigation'
import { ArrowRight, Search, ArrowUpDown, Hash, CircleDollarSign, Download, ArrowLeftRight, LayoutGrid } from 'lucide-react'
import Link from 'next/link'
import { useState, useMemo } from 'react'

export default function CompanyTransactions({ requests }) {
    const searchParams = useSearchParams()
    const companyId = searchParams.get('id')

    // State management
    const [searchTerm, setSearchTerm] = useState('')
    const [activeFilter, setActiveFilter] = useState('all')
    const [sortOrder, setSortOrder] = useState('newest')

    // Filter, search, and sort logic
    const filteredTransactions = useMemo(() => {
        if (!requests) return []

        const filtered = Object.entries(requests).filter(([requestId, request]) => {
            // Filter by status
            if (activeFilter === 'received' && !request.checkReceivedDate) return false
            if (activeFilter === 'dispensed' && !request.cashDispensedDate) return false
            if (activeFilter === 'cashed' && !request.checkCashedDate) return false
            if (activeFilter === 'kickback' && !request.kickbackPaidDate) return false
            if (activeFilter === 'completed' && !(
                request.checkReceivedDate && 
                request.cashDispensedDate && 
                request.checkCashedDate && 
                ((Number(request.kickbackFee) > 0 && request.kickbackPaidDate) || Number(request.kickbackFee) <= 0)
            )) return false

            // Search by ID or checkNumber
            const searchLower = searchTerm.toLowerCase()
            const idMatch = requestId.toLowerCase().includes(searchLower)
            const checkMatch = request.checkNumber?.toLowerCase().includes(searchLower)

            return searchLower === '' || idMatch || checkMatch
        })

        // Sort by date
        return filtered.sort(([, a], [, b]) => {
            const dateA = new Date(a.created_at).getTime()
            const dateB = new Date(b.created_at).getTime()
            return sortOrder === 'newest' ? dateB - dateA : dateA - dateB
        })
    }, [requests, searchTerm, activeFilter, sortOrder])

    // Format date and time
    const formatDateTime = (timestamp) => {
        const date = new Date(timestamp)
        return {
            date: date.toLocaleDateString(undefined, {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }),
            time: date.toLocaleTimeString(undefined, {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            })
        }
    }

    // Filter button styling
    const getFilterButtonClass = (filterType) => {
        const baseClasses = "px-3 py-1.5 rounded-md transition-colors duration-200 flex items-center gap-2"
        const filterStyles = {
            all: "bg-blue-50 text-blue-600",
            received: "bg-yellow-50 text-yellow-600",
            dispensed: "bg-green-50 text-green-600",
            cashed: "bg-blue-50 text-blue-600", 
            kickback: "bg-purple-50 text-purple-600",
            completed: "bg-emerald-50 text-emerald-600"
        }
        return `${baseClasses} ${
            activeFilter === filterType 
                ? filterStyles[filterType] + " font-medium" 
                : "text-gray-600 hover:bg-gray-50"
        }`
    }

    return (
        <div className="bg-white shadow-sm rounded-lg border border-gray-200">
            {/* Header with search and filters */}
            <div className="px-6 py-5 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-semibold text-gray-900">Transaction History</h2>
                    <div className="flex items-center gap-4">
                        {/* Sort Button */}
                        <button
                            onClick={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')}
                            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
                        >
                            <ArrowUpDown className="h-4 w-4" />
                            {sortOrder === 'newest' ? 'Newest First' : 'Oldest First'}
                        </button>
                        
                        {/* Search Input */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input 
                                type="text" 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search by ID or check number..." 
                                className="w-64 pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                </div>
                <div className="flex gap-2 text-sm overflow-x-auto pb-2">
                    <button 
                        onClick={() => setActiveFilter('all')}
                        className={getFilterButtonClass('all')}
                    >
                        <LayoutGrid className="h-4 w-4" />
                        All Transactions
                    </button>
                    <button 
                        onClick={() => setActiveFilter('received')}
                        className={getFilterButtonClass('received')}
                    >
                        <Hash className="h-4 w-4" />
                        Check Received
                    </button>
                    <button 
                        onClick={() => setActiveFilter('dispensed')}
                        className={getFilterButtonClass('dispensed')}
                    >
                        <CircleDollarSign className="h-4 w-4" />
                        Cash Dispensed
                    </button>
                    <button 
                        onClick={() => setActiveFilter('cashed')}
                        className={getFilterButtonClass('cashed')}
                    >
                        <Download className="h-4 w-4" />
                        Check Cashed
                    </button>
                    <button 
                        onClick={() => setActiveFilter('kickback')}
                        className={getFilterButtonClass('kickback')}
                    >
                        <ArrowLeftRight className="h-4 w-4" />
                        Kickback Paid
                    </button>
                    <button 
                        onClick={() => setActiveFilter('completed')}
                        className={getFilterButtonClass('completed')}
                    >
                        <ArrowRight className="h-4 w-4" />
                        Completed
                    </button>
                </div>
            </div>

            {/* Transaction List */}
            <div className="px-6 py-4">
                <div className="space-y-2">
                    {filteredTransactions.length > 0 ? (
                        filteredTransactions.map(([requestId, request]) => {
                            const { date, time } = formatDateTime(request.created_at)
                            return (
                                <Link
                                    key={requestId}
                                    href={`/transaction?id=${requestId.slice(1)}`}
                                    className="block group"
                                >
                                    <div className="flex items-center justify-between px-4 py-5 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors duration-200">
                                        <div className="flex items-center gap-6 flex-1">
                                            {/* Status Icons */}
                                            <div className="flex gap-3">
                                                <Hash 
                                                    className={`h-5 w-5 ${request.checkReceivedDate ? 'text-yellow-500' : 'text-gray-300'}`}
                                                />
                                                <CircleDollarSign 
                                                    className={`h-5 w-5 ${request.cashDispensedDate ? 'text-green-500' : 'text-gray-300'}`}
                                                />
                                                <Download 
                                                    className={`h-5 w-5 ${request.checkCashedDate ? 'text-blue-500' : 'text-gray-300'}`}
                                                />
                                                <ArrowLeftRight 
                                                    className={`h-5 w-5 ${
                                                        Number(request.kickbackFee) <= 0 
                                                            ? 'text-red-500' 
                                                            : request.kickbackPaidDate 
                                                                ? 'text-purple-500' 
                                                                : 'text-gray-300'
                                                    }`}
                                                />
                                            </div>

                                            {/* Transaction Details */}
                                            <div className="flex flex-col gap-1 flex-1">
                                                <div className="flex items-center gap-3">
                                                    <span className="font-medium text-gray-900">
                                                        {requestId}
                                                    </span>
                                                    {request.checkNumber && (
                                                        <span className="text-sm text-gray-500">
                                                            Check #{request.checkNumber}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                                    <span>{date}</span>
                                                    <span className="text-gray-400">•</span>
                                                    <span>{time}</span>
                                                </div>
                                            </div>

                                            {/* Amount Details */}
                                            <div className="flex items-center gap-8">
                                                <div className="flex flex-col items-end">
                                                    <span className="text-sm text-gray-500">Request Amount</span>
                                                    <span className="font-semibold text-gray-900">
                                                        ${(request.requestAmount || 0).toLocaleString()}
                                                    </span>
                                                </div>
                                                {Number(request.kickbackFee) > 0 && (
                                                    <div className="flex flex-col items-end min-w-[100px]">
                                                        <span className="text-sm text-gray-500">Kickback</span>
                                                        <span className="font-semibold text-purple-600">
                                                            ${Number(request.kickbackFee).toLocaleString()}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="ml-6">
                                            <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" />
                                        </div>
                                    </div>
                                </Link>
                            )
                        })
                    ) : (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                                <Search className="h-6 w-6 text-gray-400" />
                            </div>
                            <span className="text-gray-600 font-medium">No transactions found</span>
                            <span className="text-sm text-gray-500 mt-1">
                                {searchTerm 
                                    ? "Try adjusting your search terms" 
                                    : "Try adjusting your filters"}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}