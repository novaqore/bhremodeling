"use client"
import { db } from "@/lib/firebase/init"
import { ref, get } from "firebase/database"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, Building2, User, Search, ArrowRight } from "lucide-react"

export default function Companies() {
    const router = useRouter()
    const [companies, setCompanies] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [searchTerm, setSearchTerm] = useState("")

    useEffect(() => {
        async function fetchCompanies() {
            try {
                const companiesRef = ref(db, 'companies')
                const snapshot = await get(companiesRef)
                
                if (snapshot.exists()) {
                    const companiesData = Object.entries(snapshot.val()).map(([id, data]) => ({
                        id,
                        ...data
                    }))
                    setCompanies(companiesData)
                } else {
                    setCompanies([])
                }
            } catch (err) {
                console.error('Error fetching companies:', err)
                setError('Failed to load companies')
            } finally {
                setLoading(false)
            }
        }

        fetchCompanies()
    }, [])

    const filteredCompanies = companies.filter(company => 
        company.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.contactName?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (loading) return (
        <div className="flex items-center justify-center">
            <div className="animate-pulse text-lg text-gray-600">Loading companies...</div>
        </div>
    )

    if (error) return (
        <div className="flex items-center justify-center">
            <div className="bg-red-100 text-red-700 px-6 py-4 rounded-lg">{error}</div>
        </div>
    )

    return (
        <div>
            <div className="max-w-5xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">Companies</h1>
                        <p className="text-gray-600">Manage and view all companies</p>
                    </div>
                    <button
                        onClick={() => router.push('/companies/new')}
                        className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all font-medium"
                    >
                        <Plus size={20} className="mr-2" />
                        Add Company
                    </button>
                </div>

                {/* Search */}
                <div className="mb-8">
                    <div className="relative">
                        <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search companies or contacts..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 bg-white text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                        />
                    </div>
                </div>

                {/* Companies List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCompanies.length === 0 ? (
                        <div className="col-span-full text-center py-12">
                            <p className="text-gray-600">No companies found</p>
                        </div>
                    ) : (
                        filteredCompanies.map(company => (
                            <div
                                key={company.id}
                                onClick={() => router.push(`/companies/${company.id}`)}
                                className="bg-white rounded-2xl p-6 cursor-pointer hover:shadow-lg transition-all group"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center">
                                        <Building2 className="w-5 h-5 text-gray-400 mr-2" />
                                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                            {company.companyName}
                                        </h3>
                                    </div>
                                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                                </div>
                                
                                <div className="flex items-center text-gray-600 text-sm">
                                    <User className="w-4 h-4 mr-2" />
                                    {company.contactName}
                                </div>

                                <div className="mt-4 flex gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-600">Multiplier:</span>{' '}
                                        <span className="font-medium text-gray-900">
                                            {Math.round(company.multiplier * 100)}%
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Kickback:</span>{' '}
                                        <span className="font-medium text-gray-900">
                                            {Math.round(company.kickback * 100)}%
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}