'use client'

import { CheckCircle, Calendar } from 'lucide-react'
import { useEffect } from 'react'

export default function RequestsNewCheckAmount({checkAmount, setCheckAmount, checkNumber, setCheckNumber, cashDate, setCashDate}) {
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];

    // Set initial date when component mounts
    useEffect(() => {
        if (!cashDate) {
            setCashDate(today)
        }
    }, [])

    return (
        <div className="max-w-md mx-auto">
            <div className="bg-gradient-to-r from-blue-50 to-gray-50 p-6 rounded-lg border-2 border-gray-200 shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <label className="text-sm font-medium text-gray-900">
                        <div className="flex items-center">
                            <CheckCircle className="w-4 h-4 mr-2 text-gray-500" />
                            Check Amount
                        </div>
                    </label>
                    <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                        <input
                            type="date"
                            value={cashDate}
                            onChange={(e) => setCashDate(e.target.value)}
                            min={today}
                            className="text-sm border-b border-gray-300 bg-transparent focus:outline-none focus:border-blue-500 p-1"
                        />
                    </div>
                </div>
                
                <div className="flex items-end gap-4">
                    <div className="relative flex-1">
                        <span className="absolute left-3 top-3 text-gray-500">$</span>
                        <input
                            type="text"
                            value={checkAmount}
                            onChange={(e) => setCheckAmount(e.target.value)}
                            placeholder="0.00"
                            className="w-full p-3 pl-8 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    
                    <div className="w-32">
                        <div className="text-xs text-gray-600">Check No.</div>
                        <input
                            type="text"
                            value={checkNumber}
                            onChange={(e) => setCheckNumber(e.target.value)}
                            className="w-full p-2 text-right border-b border-gray-300 bg-transparent focus:outline-none focus:border-blue-500"
                            placeholder="0001"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}