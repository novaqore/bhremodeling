"use client"
import { auth, db } from '@/lib/firebase/init'
import { push, ref } from 'firebase/database'
import { Building2, DollarSign, Percent, Wallet, AlertTriangle, Ban, CheckCheck, ArrowLeftRight } from 'lucide-react'

export default function RequestsNewDetails({ 
    companies, 
    selectedCompany, 
    selectedSubCompany, 
    requestAmount, 
    checkAmount,
    checkNumber,
    cashDate
}) {

    const getCurrentMultiplier = () => {
        if (!selectedCompany || !companies[selectedCompany]) return 0
        
        if (selectedSubCompany && companies[selectedCompany].subcontractors?.[selectedSubCompany]) {
            return parseFloat(companies[selectedCompany].subcontractors[selectedSubCompany].multiplier)
        }
        
        return parseFloat(companies[selectedCompany].multiplier || 0)
    }

    const getCurrentKickback = () => {
        if (!selectedCompany || !companies[selectedCompany]) return 0

        if (selectedSubCompany) {
            const sub = companies[selectedCompany].subcontractors?.[selectedSubCompany]
            return sub ? parseFloat(sub.kickback || 0) : 0
        }

        return parseFloat(companies[selectedCompany].kickback || 0)
    }

    const requestAmountNum = parseFloat(requestAmount || 0)
    const checkAmountNum = parseFloat(checkAmount || 0)

    // Step 1: Calculate processing fee (request amount × multiplier)
    const processingFee = requestAmountNum * getCurrentMultiplier()
    
    // Step 2: Calculate kickback amount (request amount × kickback rate)
    const kickbackFee = requestAmountNum * getCurrentKickback()
    
    // Step 3: Remaining amount after kickback
    const afterKickback = processingFee - kickbackFee
    
    // Step 4: Calculate bank fee (1% of check amount)
    const bankFee = checkAmountNum * 0.01
    
    // Step 5: Final profit (remaining after kickback minus bank fee)
    const profit = afterKickback - bankFee

    // Step 6: Customer payout
    const customerPayout = checkAmountNum - processingFee

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

    const handleSendRequest = async ()=> {
        const request_key = await push(ref(db, 'requests')).key
        const request = {
            id: request_key,
            created_at: new Date().getTime(),
            submitted_by: auth.currentUser.uid,
            company_id: selectedCompany,
            subCompany_id: selectedSubCompany,
            requestAmount,
            checkAmount,
            checkNumber,
            cashDate,
            processingFee,
            kickbackFee,
            bankFee,
            profit,
        }
        console.log(request)
    }

    return (
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

                            <div className="flex justify-between items-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                                    <div className="flex items-center gap-2">
                                        <ArrowLeftRight className="w-5 h-5 text-purple-600" />
                                        <div className="flex flex-col">
                                            <span className="font-medium text-gray-900">
                                                Kickback to {companies[selectedCompany]?.companyName}
                                            </span>
                                            <span className="text-sm text-purple-600">
                                                ({(getCurrentKickback() * 100).toFixed(1)}% of profit)
                                            </span>
                                        </div>
                                    </div>
                                    <span className="text-lg font-semibold text-purple-600">
                                        ${kickbackFee.toFixed(2)}
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
                        </div>
                        <button className='w-full bg-blue-600 p-2 text-white rounded-md shadow-xl my-2 hover:bg-blue-700' onClick={handleSendRequest}>Submit Request</button>
                    </div>
    )
}