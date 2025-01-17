"use client"
import { useState } from 'react'
import RequestsNewCompanySelect from '@/components/Requests/RequestsNewCompanySelect'
import RequestsNewAmount from '@/components/Requests/RequestsNewAmount'
import RequestsNewCheck from '@/components/Requests/RequestsNewCheck'
import RequestsNewDetails from '@/components/Requests/RequestsNewDetails'

export default function RequestsNew() {
    const [companies, setCompanies] = useState({})
    const [selectedCompany, setSelectedCompany] = useState('')
    const [selectedSubCompany, setSelectedSubCompany] = useState('')
    const [requestAmount, setRequestAmount] = useState('')
    const [checkAmount, setCheckAmount] = useState('')
    const [ checkNumber, setCheckNumber ] = useState('')
    const [ cashDate, setCashDate ] = useState('')

    return (
        <div className="bg-gray-100 p-8">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-900 mb-8">New Request</h1>
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <div className="space-y-6">
                            <RequestsNewCompanySelect 
                                selectedCompany={selectedCompany} 
                                setSelectedCompany={setSelectedCompany} 
                                selectedSubCompany={selectedSubCompany}
                                setSelectedSubCompany={setSelectedSubCompany}
                                companies={companies}
                                setCompanies={setCompanies}
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
                        <RequestsNewDetails 
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
        </div>
    )
}