"use client"
import { DollarSign } from 'lucide-react'

export default function RequestsNewAmount({formData, setFormData}) {

  const handleAmountChange = (field) => (e) => {
    const value = e.target.value.replace(/[^\d.]/g, '')
    
    if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
      let formatted = value
      const parts = value.split('.')
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      formatted = parts.join('.')
      
      setFormData(prev => ({
        ...prev,
        [field]: formatted
      }))
    }
  }


  return (
    <>
    <label 
              htmlFor="requestAmount" 
              className="block text-base font-medium text-gray-700 mb-2 flex items-center gap-2"
            >
              <DollarSign className="w-5 h-5 text-blue-600" />
              Request Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                $
              </span>
              <input
                id="requestAmount"
                name="requestAmount"
                type="text"
                inputMode="decimal"
                placeholder="0.00"
                value={formData.requestAmount}
                onChange={handleAmountChange('requestAmount')}
                className="w-full pl-8 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              />
            </div>
    </>
  )
}