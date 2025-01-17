"use client"
import { useEffect, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import RequestsNewCompanySelect from '@/components/Requests/RequestsNewCompanySelect'
import RequestsNewAmount from '@/components/Requests/RequestsNewAmount'
import RequestsNewCheck from '@/components/Request/RequestNewCheck'
import RequestNewDetails from '@/components/Requests/RequestsNewDetails'
import Loading from '@/components/Loading/Loading'
import { useAuth } from '@/contexts/auth'
import { onValue, ref } from 'firebase/database'
import { db } from '@/lib/firebase/init'

export default function RequestsNew() {
    const { loading } = useAuth()
    const searchParams = useSearchParams()
    const companyId = searchParams.get('id')
    const router = useRouter()
    const [companies, setCompanies] = useState({})
    const [selectedCompany, setSelectedCompany] = useState(companyId? `-${companyId}` :"")
    const [selectedSubCompany, setSelectedSubCompany] = useState('')
    const [requestAmount, setRequestAmount] = useState('')
    const [checkAmount, setCheckAmount] = useState('')
    const [checkNumber, setCheckNumber] = useState('')
    const [cashDate, setCashDate] = useState('')

    useEffect(() => {
            const companiesRef = ref(db, 'companies')
            const unsubscribe = onValue(companiesRef, (snapshot) => {
                if (snapshot.exists()) {
                    setCompanies(snapshot.val())
                }
            })
            return () => unsubscribe()
        }, [])

    if(loading) return <Loading />

    return (
        <div className="mx-auto px-6 pb-6 pt-20">
            <div className="flex flex-row items-center justify-between gap-2 pb-2">
                <div className="flex flex-row">
                    <button
                        onClick={() => router.back()}
                        className="inline-flex items-center text-gray-600 hover:text-gray-900"
                        >
                        <ArrowLeft className="h-5 w-5 mr-2" />
                    </button>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">New Request</h1>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-x-6">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="space-y-6">
                        <RequestsNewCompanySelect 
                            selectedCompany={selectedCompany} 
                            setSelectedCompany={setSelectedCompany} 
                            selectedSubCompany={selectedSubCompany}
                            setSelectedSubCompany={setSelectedSubCompany}
                            companies={companies}
                            setCompanies={setCompanies}
                            companyId={companyId}
                        />
                        <RequestsNewAmount 
                            requestAmount={requestAmount} 
                            setRequestAmount={setRequestAmount} 
                        />
                        <RequestsNewCheck 
                            checkAmount={checkAmount} 
                            setCheckAmount={setCheckAmount} 
                            checkNumber={checkNumber}
                            setCheckNumber={setCheckNumber}
                            cashDate={cashDate}
                            setCashDate={setCashDate}
                        />
                    </div>
                </div>
                <RequestNewDetails 
                    companies={companies} 
                    selectedCompany={selectedCompany} 
                    selectedSubCompany={selectedSubCompany} 
                    requestAmount={requestAmount} 
                    checkAmount={checkAmount} 
                    checkNumber={checkNumber}
                    cashDate={cashDate}
                />
            </div>
        </div>
    )
}