"use client"
import { useParams } from 'next/navigation'
import { db } from '@/lib/firebase/init'
import { ref, onValue } from 'firebase/database'
import { useEffect, useState } from 'react'
import CompanyInfo from '@/components/Company/CompanyInfo'
import CompanyDelete from '@/components/Company/CompanyDelete'
import CompanySubcontractors from '@/components/Company/CompanySubcontractors'
import CompanyMultipliers from '@/components/Company/CompanyMultipliers'

export default function Company() {
    const params = useParams()
    const [company, setCompany] = useState(null)

    useEffect(() => {
        const companyRef = ref(db, `companies/${params.id}`)
        const unsubscribe = onValue(companyRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val()
                if (!data.subcontractors) {
                    data.subcontractors = {}
                }
                setCompany(data)
            }
        })

        return () => unsubscribe()
    }, [params.id])


    if (!company) return <div className="p-8 text-gray-900">Loading...</div>

    return (
            <div className="max-w-5xl mx-auto p-8">
                <div className="flex justify-between flex-row m-2">
                    <h1 className="text-4xl font-bold text-gray-900">{company.companyName}</h1>
                     <CompanyDelete company={company} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <CompanyInfo company={company} />
                    <CompanyMultipliers company={company} />
                </div>
                    <CompanySubcontractors company={company} />
            </div>
    )
}