"use client"
import { useEffect, useState } from 'react'
import { db } from '@/lib/firebase/init'
import { ref, onValue } from 'firebase/database'
import { Building2, DollarSign, Percent, CheckCircle, Wallet, AlertTriangle, Ban, CheckCheck, ArrowLeftRight } from 'lucide-react'

export default function FreshRequest() {
    // Basic state
    const [companies, setCompanies] = useState({})
    const [selectedCompany, setSelectedCompany] = useState('')
    const [selectedSubcontractor, setSelectedSubcontractor] = useState('')
    const [requestAmount, setRequestAmount] = useState('')
    const [checkAmount, setCheckAmount] = useState('')

    // Fetch companies
    useEffect(() => {
        const companiesRef = ref(db, 'companies')
        const unsubscribe = onValue(companiesRef, (snapshot) => {
            if (snapshot.exists()) {
                setCompanies(snapshot.val())
            }
        })
        return () => unsubscribe()
    }, [])

    // Calculate fees
    const getCurrentMultiplier = () => {
        if (!selectedCompany || !companies[selectedCompany]) return 0
        
        // Use subcontractor multiplier if selected
        if (selectedSubcontractor && companies[selectedCompany].subcontractors?.[selectedSubcontractor]) {
            return parseFloat(companies[selectedCompany].subcontractors[selectedSubcontractor].multiplier)
        }
        
        // Otherwise use company multiplier
        return parseFloat(companies[selectedCompany].multiplier || 0)
    }

    const getCurrentKickback = () => {
        if (!selectedCompany || !companies[selectedCompany]) return 0

        // If subcontractor is selected, use their kickback
        if (selectedSubcontractor) {
            const sub = companies[selectedCompany].subcontractors?.[selectedSubcontractor]
            return sub ? parseFloat(sub.kickback || 0) : 0
        }

        // Otherwise use company kickback
        return parseFloat(companies[selectedCompany].kickback || 0)
    }

    const processingFee = parseFloat(requestAmount || 0) * getCurrentMultiplier()
    const bankFee = parseFloat(checkAmount || 0) * 0.01
    const customerPayout = (parseFloat(checkAmount) || 0) - processingFee
    const profit = processingFee - bankFee
    const requestAmountNum = parseFloat(requestAmount) || 0
    const kickbackAmount = requestAmountNum * getCurrentKickback()

    const checkAmountNum = parseFloat(checkAmount) || 0
    const expectedWithFee = requestAmountNum + processingFee
    const discrepancy = checkAmountNum - expectedWithFee
    
    const getFeeStatus = () => {
        if (!requestAmount || !checkAmount) return null
        if (checkAmountNum === requestAmountNum) {
            return { type: 'warning', message: 'Check doesn\'t include fee' }
        } else if (Math.abs(checkAmountNum - expectedWithFee) < 0.01) {
            return { type: 'success', message: 'Check includes fee' }
        } else {
            return {
                type: 'error',
                message: `There was a ${Math.abs(discrepancy).toFixed(2)} discrepancy, expected ${expectedWithFee.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
            }
        }
    }

    const feeStatus = getFeeStatus()

    return (
        <div className="bg-gray-100 p-8">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-900 mb-8">New Request</h1>
                
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Left Column - Form */}
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <div className="space-y-6">
                            {/* Company Selection */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-900 mb-2">
                                        <div className="flex items-center">
                                            <Building2 className="w-4 h-4 mr-2 text-gray-500" />
                                            Company
                                        </div>
                                    </label>
                                    <select
                                        value={selectedCompany}
                                        onChange={(e) => {
                                            setSelectedCompany(e.target.value)
                                            setSelectedSubcontractor('')
                                        }}
                                        className="w-full p-3 rounded-lg border border-gray-300"
                                    >
                                        <option value="">Select company...</option>
                                        {Object.entries(companies).map(([id, company]) => (
                                            <option key={id} value={id}>
                                                {company.companyName}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Subcontractor Selection - Shows only if company has subs */}
                                {selectedCompany && companies[selectedCompany]?.subcontractors && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-900 mb-2">
                                            <div className="flex items-center">
                                                <Building2 className="w-4 h-4 mr-2 text-gray-500" />
                                                Subcontractor
                                            </div>
                                        </label>
                                        <select
                                            value={selectedSubcontractor}
                                            onChange={(e) => setSelectedSubcontractor(e.target.value)}
                                            className="w-full p-3 rounded-lg border border-gray-300"
                                        >
                                            <option value="">None</option>
                                            {Object.entries(companies[selectedCompany].subcontractors).map(([id, sub]) => (
                                                <option key={id} value={id}>
                                                    {sub.name} - {(parseFloat(sub.multiplier) * 100).toFixed(1)}%
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}
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
                                    className="w-full p-3 rounded-lg border border-gray-300"
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
                                <input
                                    type="text"
                                    value={checkAmount}
                                    onChange={(e) => setCheckAmount(e.target.value)}
                                    placeholder="Enter check amount"
                                    className="w-full p-3 rounded-lg border border-gray-300"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Details */}
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <h2 className="text-lg font-semibold text-gray-900 mb-6">Details</h2>
                        
                        <div className="space-y-4">
                            {/* Current Multiplier */}
                            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <div className="flex items-center gap-2">
                                    <Percent className="w-4 h-4 text-gray-500" />
                                    <span className="text-gray-900">Current Multiplier</span>
                                </div>
                                <span className="font-medium text-gray-900">
                                    {(getCurrentMultiplier() * 100).toFixed(1)}%
                                </span>
                            </div>

                            {/* Processing Fee */}
                            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <div className="flex items-center gap-2">
                                    <Percent className="w-4 h-4 text-gray-500" />
                                    <span className="text-gray-900">Processing Fee</span>
                                </div>
                                <span className="font-medium text-gray-900">
                                    ${processingFee.toFixed(2)}
                                </span>
                            </div>

                            {/* Bank Fee */}
                            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <div className="flex items-center gap-2">
                                    <Building2 className="w-4 h-4 text-gray-500" />
                                    <span className="text-gray-900">Bank Fee (1%)</span>
                                </div>
                                <span className="font-medium text-gray-900">
                                    ${bankFee.toFixed(2)}
                                </span>
                            </div>

                            {/* Fee Status */}
                            {feeStatus && (
                                <div className={`flex items-center p-4 rounded-lg border ${
                                    feeStatus.type === 'warning' ? 'bg-orange-50 border-orange-200 text-orange-700' :
                                    feeStatus.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' :
                                    'bg-amber-50 border-amber-200 text-amber-700'
                                }`}>
                                    <div className="flex items-center gap-2">
                                        {feeStatus.type === 'warning' && <Ban className="w-5 h-5" />}
                                        {feeStatus.type === 'success' && <CheckCheck className="w-5 h-5" />}
                                        {feeStatus.type === 'error' && <AlertTriangle className="w-5 h-5" />}
                                        <span className="font-medium">{feeStatus.message}</span>
                                    </div>
                                </div>
                            )}

                            {/* Customer Payout */}
                            <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg border border-blue-200">
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

                            {/* Kickback */}
                            {companies[selectedCompany] && (
                                <div className="flex justify-between items-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                                    <div className="flex items-center gap-2">
                                        <ArrowLeftRight className="w-5 h-5 text-purple-600" />
                                        <div className="flex flex-col">
                                            <span className="font-medium text-gray-900">
                                                Kickback to {companies[selectedCompany].companyName}
                                            </span>
                                            <span className="text-sm text-purple-600">
                                                ({(getCurrentKickback() * 100).toFixed(1)}% of profit)
                                            </span>
                                        </div>
                                    </div>
                                    <span className="text-lg font-semibold text-purple-600">
                                        ${kickbackAmount.toFixed(2)}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}