
'use client'

import { db } from "@/lib/firebase/init"
import { ref, get } from "firebase/database"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Search, ArrowLeft, PlusIcon } from "lucide-react"
import Link from "next/link"
import Loading from "@/components/Loading/Loading"
import CompanyCard from "@/components/Company/CompanyCard"

export default function Companies() {
    const router = useRouter()
    const [companies, setCompanies] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [searchTerm, setSearchTerm] = useState("")

    useEffect(() => {
        setLoading(true)
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

    if(loading) return <Loading />
    
    return (
        <div className="mx-auto max-w-6xl px-6 pb-6 pt-20">
            <div className="flex flex-row items-center justify-between gap-2 pb-2">
                <div className="flex flex-row">
                    <button
                        onClick={() => router.back()}
                        className="inline-flex items-center text-gray-600 hover:text-gray-900"
                    >
                        <ArrowLeft className="h-5 w-5 mr-2" />
                    </button>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Companies</h1>
                </div>

                <Link
                    href="/company/new"
                    className="flex-1 sm:flex-none bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center gap-2 text-sm"
                >
                    <PlusIcon size={18} />
                    <span>New Company</span>
                </Link>
            </div>
         
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
                        <CompanyCard key={company.id} company={company} />
                    ))
                )}
            </div>
        </div>
    )
}