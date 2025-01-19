"use client"
import { DollarSign} from 'lucide-react'

export default function RequestsNewAmount({requestAmount, setRequestAmount}) {
 

    return (
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
    )
}