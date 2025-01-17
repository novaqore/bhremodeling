'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { db } from '@/lib/firebase/init'
import { ref, onValue, orderByChild, equalTo, query } from 'firebase/database'
import { useEffect, useState } from 'react'
import { 
  ArrowLeft, 
  Building2, 
  Users, 
  ChartBar,
  Settings,
  ArrowRight,
  Percent
} from 'lucide-react'
import Link from 'next/link'
import CompanyInfo from '@/components/Company/CompanyInfo'
import CompanyDelete from '@/components/Company/CompanyDelete'
import CompanySubcontractors from '@/components/Company/CompanySubcontractors'
import CompanyMultipliers from '@/components/Company/CompanyMultipliers'
import CompanyTransactions from '@/components/Company/CompanyTransactions'

export default function Company() {
    const searchParams = useSearchParams()
    const companyId = searchParams.get('id')
    const [company, setCompany] = useState(null)
    const [ requests, setRequests ] = useState(null)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const router = useRouter()
    
    const tabs = [
        { id: 'overview', label: 'Overview', icon: Building2 },
        { id: 'transactions', label: 'Transactions', icon: ChartBar },
        { id: 'subcontractors', label: 'Subcontractors', icon: Users },
        { id: 'multipliers', label: 'Multipliers', icon: Percent },
        { id: 'settings', label: 'Settings', icon: Settings }
    ]

    const [activeTab, setActiveTab] = useState('overview')

    useEffect(() => {
        if (!companyId) return

        const companyRef = ref(db, `companies/-${companyId}`)
        const unsubscribe = onValue(companyRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val()
                setCompany(data)
            }
        })

        return () => unsubscribe()
    }, [companyId])

    useEffect(() => {
        if (!company) return
        const requestsQuery = query(
            ref(db, 'requests'), 
            orderByChild('company_id'), 
            equalTo(`-${companyId}`)
        )
        
        const unsubscribe = onValue(requestsQuery, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val()
                setRequests(data)
            }
        })
        
        return () => unsubscribe()
    }, [company, companyId])

    if (!companyId) return <div className="p-8 text-gray-900">No company ID provided</div>
    if (!company) return <div className="p-8 text-gray-900">Loading...</div>

    return (
        <div className="mx-auto px-4 sm:px-6 pb-6 pt-20">
            {/* Header */}
            <div className="flex flex-row items-center justify-between gap-2">
                <div className="flex flex-row items-center">
                    <button
                        onClick={() => router.back()}
                        className="inline-flex items-center text-gray-600 hover:text-gray-900"
                    >
                        <ArrowLeft className="h-5 w-5 mr-2" />
                    </button>
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">{company.companyName}</h1>
                </div>

                <div className="flex items-center gap-2">
                    <Link
                        href={`/company/stats?id=${companyId}`}
                        className="bg-yellow-600 text-white px-3 py-2 rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center gap-2 text-sm"
                    >
                        <ChartBar size={18} />
                        <span className="hidden sm:inline">Stats</span>
                    </Link>
                    <Link
                        href={`/request/new?id=${companyId}`}
                        className="bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center gap-2 text-sm"
                    >
                        <span className="hidden sm:inline">Start Request</span>
                        <ArrowRight size={18} />
                    </Link>
                </div>
            </div>

            {/* Tab Navigation - Scrollable */}
            <div className="border-b border-gray-200">
                <div className="overflow-x-auto scrollbar-hide">
                    <div className="flex min-w-max">
                        {tabs.map((tab) => {
                            const Icon = tab.icon
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => {
                                        setActiveTab(tab.id)
                                    }}
                                    className={`
                                        flex items-center whitespace-nowrap px-4 py-4 text-sm font-medium border-b-2
                                        ${activeTab === tab.id 
                                            ? 'border-blue-500 text-blue-600' 
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                                    `}
                                >
                                    <Icon className="h-4 w-4 mr-2" />
                                    {tab.label}
                                </button>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="mt-6 space-y-6">
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                            <div className="bg-white shadow-sm rounded-lg border border-gray-200">
                                <div className="px-4 sm:px-6 py-5 border-b border-gray-200">
                                    <h2 className="text-lg font-medium text-gray-900">Company Information</h2>
                                </div>
                                <div className="px-4 sm:px-6 py-5">
                                    <CompanyInfo company={company} />
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="bg-white shadow-sm rounded-lg border border-gray-200">
                                <div className="px-4 sm:px-6 py-5 border-b border-gray-200">
                                    <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
                                </div>
                                <div className="px-4 sm:px-6 py-5">
                                    <CompanyMultipliers company={company} />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'transactions' && (
                    <CompanyTransactions requests={requests} />
                )}

                {activeTab === 'subcontractors' && (
                    <div className="bg-white shadow-sm rounded-lg border border-gray-200">
                        <div className="px-4 sm:px-6 py-5 border-b border-gray-200">
                            <h2 className="text-lg font-medium text-gray-900">Sub-Company</h2>
                        </div>
                        <div className="px-4 sm:px-6 py-5">
                            <CompanySubcontractors company={company} />
                        </div>
                    </div>
                )}

                {activeTab === 'multipliers' && (
                    <div className="bg-white shadow-sm rounded-lg border border-gray-200">
                        <div className="px-4 sm:px-6 py-5 border-b border-gray-200">
                            <h2 className="text-lg font-medium text-gray-900">Rate Multipliers</h2>
                        </div>
                        <div className="px-4 sm:px-6 py-5">
                            <CompanyMultipliers company={company} />
                        </div>
                    </div>
                )}

                {activeTab === 'settings' && (
                    <div className="bg-white shadow-sm rounded-lg border border-gray-200">
                        <div className="px-4 sm:px-6 py-5 border-b border-gray-200">
                            <h2 className="text-lg font-medium text-gray-900">Company Settings</h2>
                        </div>
                        <div className="px-4 sm:px-6 py-5">
                            <div className="space-y-4">
                                <CompanyDelete company={company} />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}