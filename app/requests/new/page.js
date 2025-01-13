"use client"
import { useApp } from '@/contexts/AppContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function NewRequest() {
  const { user } = useApp()
  const [clientType, setClientType] = useState('existing')
  const [selectedCompany, setSelectedCompany] = useState('')
  const [customCompanyName, setCustomCompanyName] = useState('')
  const [multiplier, setMultiplier] = useState('0')
  const [amount, setAmount] = useState('')
  const [checkAmount, setCheckAmount] = useState('')
  const bankFeePercentage = 1
  const router = useRouter()

  const companies = {
    "-abc123": { companyName: "GT Remodling Inc", multiplier: 4 },
    "-def456": { companyName: "Laor Marketing Solutions GT", multiplier: 3 }
  }
  
  useEffect(()=> {
    if(!user) router.push('/login')
  })

  useEffect(() => {
    // Clear ALL states when client type changes
    setMultiplier('0')
    setSelectedCompany('')
    setCustomCompanyName('')
    setAmount('')
    setCheckAmount('')
    
    // Then if it's new client, clear multiplier completely
    if (clientType === 'new') {
      setMultiplier('')
    }
  }, [clientType])
  
  useEffect(() => {
    // Only set multiplier from company selection if we're in existing client mode
    if (clientType === 'existing' && selectedCompany) {
      setMultiplier(companies[selectedCompany].multiplier.toString())
    }
  }, [selectedCompany, clientType])
  const calculateFinalAmount = () => {
    if (!amount || !multiplier) {
      return {
        grossAmount: 0,
        fee: 0,
        customerPayout: 0,
        bankFee: 0,
        profit: 0,
        isFeeIncluded: false,
        discrepancies: {}
      }
    }
    
    const numAmount = parseFloat(amount)
    const numMultiplier = parseFloat(multiplier)
    const numCheckAmount = parseFloat(checkAmount || 0)
    
    if (numMultiplier >= 100 || isNaN(numAmount) || isNaN(numMultiplier)) {
      return {
        grossAmount: 0,
        fee: 0,
        customerPayout: 0,
        bankFee: 0,
        profit: 0,
        isFeeIncluded: false,
        discrepancies: {}
      }
    }

    const grossAmount = (numAmount * 100) / (100 - numMultiplier)
    const fee = grossAmount - numAmount
    const bankFee = (numCheckAmount * bankFeePercentage) / 100
    
    const expectedCheckWithFee = numAmount + fee
    const expectedCheckWithoutFee = numAmount
    
    const diffWithFee = Math.abs(numCheckAmount - expectedCheckWithFee)
    const diffWithoutFee = Math.abs(numCheckAmount - expectedCheckWithoutFee)
    const isFeeIncluded = diffWithFee < diffWithoutFee
    
    const discrepancies = {}
    const expectedCheck = isFeeIncluded ? expectedCheckWithFee : expectedCheckWithoutFee
    if (Math.abs(numCheckAmount - expectedCheck) > 0.01) {
      discrepancies.check = {
        expected: expectedCheck,
        actual: numCheckAmount,
        difference: numCheckAmount - expectedCheck
      }
    }
    
    const customerPayout = isFeeIncluded ? numAmount : numAmount - fee
    const profit = fee - bankFee

    return {
      grossAmount,
      fee,
      customerPayout,
      bankFee,
      profit,
      isFeeIncluded,
      discrepancies
    }
  }

  const calculations = calculateFinalAmount()

  return (
    <div className="p-4 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">New Request</h1>
        
        <div className="flex flex-col lg:flex-row lg:space-x-8">
          {/* Left Column - Form Inputs */}
          <div className="lg:w-1/2">
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-6">
              {/* Client Type Selection */}
              <div className="inline-flex p-1 bg-gray-100 rounded-md">
                <button
                  onClick={() => setClientType('existing')}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    clientType === 'existing'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  Existing Client
                </button>
                <button
                  onClick={() => setClientType('new')}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    clientType === 'new'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  New Client
                </button>
              </div>

              {clientType === 'existing' ? (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                      Select Company
                    </label>
                    <select
                      id="company"
                      value={selectedCompany}
                      onChange={(e) => setSelectedCompany(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-900
                                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="" disabled>Choose a company...</option>
                      {Object.entries(companies).map(([id, company]) => (
                        <option key={id} value={id}>
                          {company.companyName} ({company.multiplier}%)
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="multiplier" className="block text-sm font-medium text-gray-700 mb-2">
                      Multiplier (%)
                    </label>
                    <input
                      type="number"
                      id="multiplier"
                      name="multiplier"
                      value={multiplier}
                      disabled={true}
                      className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-900"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="customCompanyName" className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name
                    </label>
                    <input
                      type="text"
                      id="customCompanyName"
                      value={customCompanyName}
                      onChange={(e) => setCustomCompanyName(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-900 placeholder-gray-400
                                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter company name"
                    />
                  </div>
                  <div>
                    <label htmlFor="multiplier" className="block text-sm font-medium text-gray-700 mb-2">
                      Multiplier (%)
                    </label>
                    <input
                      type="number"
                      id="multiplier"
                      name="multiplier"
                      value={multiplier}
                      onChange={(e) => setMultiplier(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-900 placeholder-gray-400
                                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter percentage"
                      step="0.1"
                      min="0"
                      max="99.9"
                    />
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                  Request Amount
                </label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-900 placeholder-gray-400
                            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter amount"
                />
              </div>
              <div>
                <label htmlFor="checkAmount" className="block text-sm font-medium text-gray-700 mb-2">
                  Check Amount
                </label>
                <input
                  type="number"
                  id="checkAmount"
                  name="checkAmount"
                  value={checkAmount}
                  onChange={(e) => setCheckAmount(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-900 placeholder-gray-400
                            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter check amount"
                />
                {calculations.discrepancies.check && (
                  <p className="mt-1 text-sm text-amber-600">
                    ${Math.abs(calculations.discrepancies.check.difference).toFixed(2)} discrepancy found in check amount 
                    (expected: ${calculations.discrepancies.check.expected.toFixed(2)})
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="bankFee" className="block text-sm font-medium text-gray-700 mb-2">
                  Bank Fee (%)
                </label>
                <input
                  type="number"
                  id="bankFee"
                  name="bankFee"
                  value={bankFeePercentage}
                  disabled
                  className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-500"
                />
              </div>
            </div>
          </div>

          {/* Right Column - Transaction Details */}
          <div className="lg:w-1/2 mt-6 lg:mt-0">
            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h2 className="text-lg font-semibold mb-4 text-gray-900">Transaction Details</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Company:</span>
                  <span className="font-medium text-gray-900">
                    {clientType === 'new' ? 
                      (customCompanyName || 'New Client') : 
                      (selectedCompany ? companies[selectedCompany].companyName : 'Choose a company...')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Request Amount:</span>
                  <span className="font-medium text-gray-900">
                    ${amount ? parseFloat(amount).toFixed(2) : '0.00'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Processing Fee:</span>
                  <span className="font-medium text-gray-900">${calculations.fee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Check Amount:</span>
                  <span className="font-medium text-gray-900">
                    ${checkAmount ? parseFloat(checkAmount).toFixed(2) : '0.00'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Bank Fee:</span>
                  <span className="font-medium text-gray-900">${calculations.bankFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fee Status:</span>
                  <span className="font-medium text-gray-900">
                    {checkAmount ? (calculations.isFeeIncluded ? 'Fee included in check' : 'Fee not included in check') : '-'}
                  </span>
                </div>
                <div className="flex flex-col pt-3 border-t border-gray-200 space-y-2 mt-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Customer Payout:</span>
                    <span className="font-semibold text-blue-600">${calculations.customerPayout.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Profit:</span>
                    <span className="font-semibold text-green-600">${calculations.profit.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}