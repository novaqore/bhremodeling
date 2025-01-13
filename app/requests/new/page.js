"use client"
import { useEffect, useState } from 'react'
import { db } from '@/lib/firebase/init'
import { ref, onValue, push, update } from 'firebase/database'
import { useRouter } from 'next/navigation'
import { 
    Building2, 
    DollarSign, 
    Percent, 
    AlertCircle,
    CheckCircle,
    LineChart,
    Wallet
} from 'lucide-react'

export default function NewRequest() {
    const router = useRouter()
    const [companies, setCompanies] = useState({})
    const [selectedCompany, setSelectedCompany] = useState('')
    const [requestAmount, setRequestAmount] = useState('')
    const [checkAmount, setCheckAmount] = useState('')
    const [cashDate, setCashDate] = useState('immediate')

    useEffect(() => {
        const companiesRef = ref(db, 'companies')
        const unsubscribe = onValue(companiesRef, (snapshot) => {
            if (snapshot.exists()) {
                setCompanies(snapshot.val())
            }
        })
        return () => unsubscribe()
    }, [])

    const calculateFee = () => {
        if (!selectedCompany || !companies[selectedCompany]) return 0
        const amount = parseFloat(requestAmount) || 0
        const multiplier = companies[selectedCompany]?.multiplier || 0
        return amount * multiplier
    }

    const fee = calculateFee()
    const bankFee = (parseFloat(checkAmount) || 0) * 0.01
    const feeIncludedInCheck = parseFloat(checkAmount) > parseFloat(requestAmount)
    const customerPayout = feeIncludedInCheck
        ? parseFloat(requestAmount) || 0
        : (parseFloat(requestAmount) || 0) - fee
    const profit = fee - bankFee

    const expectedAmount = feeIncludedInCheck 
        ? parseFloat(requestAmount) + fee 
        : parseFloat(requestAmount)
    
    const discrepancy = (parseFloat(checkAmount) || 0) - expectedAmount
    const hasDiscrepancy = Math.abs(discrepancy) > 0.01 && checkAmount !== ''

    const isValidRequest = () => {
        return selectedCompany !== '' && 
               requestAmount !== '' && 
               checkAmount !== '' &&
               parseFloat(requestAmount) > 0 &&
               parseFloat(checkAmount) > 0 &&
               cashDate !== ''
    }

    const handleSubmit = async () => {
        if (!isValidRequest()) return

        const requestData = {
            company: selectedCompany,
            companyName: companies[selectedCompany]?.companyName,
            requestAmount,
            checkAmount,
            fee,
            bankFee,
            feeIncludedInCheck,
            customerPayout,
            profit,
            discrepancy,
            cashDate,
            createdAt: new Date().toISOString(),
            status: 'pending'
        }

        try {
            // Push the request to get a new key
            const newRequestRef = push(ref(db, 'requests/'))
            
            // Update the request with its own key
            await update(ref(db, `requests/${newRequestRef.key}`), {
                ...requestData,
                id: newRequestRef.key
            })

            // Navigate to the request details page
            router.push(`/requests/${newRequestRef.key}`)
        } catch (error) {
            console.error('Error submitting request:', error)
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-900 mb-8">New Request</h1>
                
                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Left Column - Inputs */}
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <div className="space-y-6">
                            {/* Company Select */}
                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-2">
                                    <div className="flex items-center">
                                        <Building2 className="w-4 h-4 mr-2 text-gray-500" />
                                        Select Company
                                    </div>
                                </label>
                                <select
                                    value={selectedCompany}
                                    onChange={(e) => setSelectedCompany(e.target.value)}
                                    className="w-full p-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Choose a company...</option>
                                    {Object.entries(companies).map(([id, company]) => (
                                        <option key={id} value={id}>
                                            {company.companyName} ({(company.multiplier * 100).toFixed(1)}%)
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Request Amount */}
                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-2">
                                    <div className="flex items-center">
                                        <DollarSign className="w-4 h-4 mr-2 text-gray-500" />
                                        Request Amount
                                    </div>
                                </label>
                                <input
                                    type="text"
                                    value={requestAmount}
                                    onChange={(e) => setRequestAmount(e.target.value)}
                                    placeholder="Enter amount"
                                    className="w-full p-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            {/* Check Amount */}
                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-2">
                                    <div className="flex items-center">
                                        <CheckCircle className="w-4 h-4 mr-2 text-gray-500" />
                                        Check Amount
                                    </div>
                                </label>
                                <div className="space-y-2">
                                    <input
                                        type="text"
                                        value={checkAmount}
                                        onChange={(e) => setCheckAmount(e.target.value)}
                                        placeholder="Enter check amount"
                                        className={`w-full p-3 rounded-lg border ${hasDiscrepancy ? 'border-amber-500' : 'border-gray-300'} bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                                    />
                                    {hasDiscrepancy && (
                                        <div className="flex items-start gap-2 text-amber-700 text-sm bg-amber-50 p-3 rounded-lg border border-amber-200">
                                            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <p>Check amount discrepancy detected</p>
                                                <p>Expected: ${expectedAmount.toFixed(2)}</p>
                                                <p>Difference: ${discrepancy.toFixed(2)}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Cash Date */}
                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-2">
                                    <div className="flex items-center">
                                        <LineChart className="w-4 h-4 mr-2 text-gray-500" />
                                        When to Cash Check
                                    </div>
                                </label>
                                <div className="space-y-2">
                                    <div className="flex gap-4 items-center">
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                value="immediate"
                                                checked={cashDate === 'immediate'}
                                                onChange={(e) => setCashDate(e.target.value)}
                                                className="mr-2"
                                            />
                                            Immediately
                                        </label>
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                value="custom"
                                                checked={cashDate !== 'immediate'}
                                                onChange={(e) => setCashDate('custom')}
                                                className="mr-2"
                                            />
                                            Set Date
                                        </label>
                                    </div>
                                    
                                    {cashDate !== 'immediate' && (
                                        <input
                                            type="date"
                                            min={new Date().toISOString().split('T')[0]}
                                            onChange={(e) => setCashDate(e.target.value)}
                                            className="w-full mt-2 p-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Results */}
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <h2 className="text-lg font-semibold text-gray-900 mb-6">Calculation Results</h2>
                        
                        <div className="space-y-4">
                            {/* Processing Fee */}
                            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <div className="flex items-center gap-2">
                                    <Percent className="w-4 h-4 text-gray-500" />
                                    <span className="text-gray-900">Processing Fee</span>
                                </div>
                                <span className="font-medium text-gray-900">${fee.toFixed(2)}</span>
                            </div>

                            {/* Bank Fee */}
                            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <div className="flex items-center gap-2">
                                    <Building2 className="w-4 h-4 text-gray-500" />
                                    <span className="text-gray-900">Bank Fee (1%)</span>
                                </div>
                                <span className="font-medium text-gray-900">${bankFee.toFixed(2)}</span>
                            </div>

                            {/* Fee Status */}
                            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <div className="flex items-center gap-2">
                                    <LineChart className="w-4 h-4 text-gray-500" />
                                    <span className="text-gray-900">Fee Status</span>
                                </div>
                                <span className="font-medium text-gray-900">
                                    {feeIncludedInCheck ? "Included" : "Not included"}
                                </span>
                            </div>

                            {/* Customer Payout */}
                            <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg border border-blue-200 mt-6">
                                <div className="flex items-center gap-2">
                                    <Wallet className="w-5 h-5 text-blue-600" />
                                    <span className="font-medium text-gray-900">Customer Payout</span>
                                </div>
                                <span className="text-lg font-semibold text-blue-600">
                                    ${customerPayout.toFixed(2)}
                                </span>
                            </div>

                            {/* Profit */}
                            <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg border border-green-200">
                                <div className="flex items-center gap-2">
                                    <DollarSign className="w-5 h-5 text-green-600" />
                                    <span className="font-medium text-gray-900">Profit</span>
                                </div>
                                <span className="text-lg font-semibold text-green-600">
                                    ${profit.toFixed(2)}
                                </span>
                            </div>

                            {/* Submit Button */}
                            <button
                                onClick={handleSubmit}
                                className="w-full mt-4 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                                disabled={!isValidRequest()}
                            >
                                Submit Request
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}