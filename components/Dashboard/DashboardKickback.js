"use client"
import { useEffect, useState } from 'react';
import { DollarSign } from 'lucide-react';

export default function DashboardKickback({ request, loadingRequest }) {
  const [kickbackStats, setKickbackStats] = useState({ total: 0, today: 0 });

  useEffect(() => {
    if (request && !loadingRequest) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const stats = Object.values(request).reduce((acc, req) => {
        // Add to total kickback fees
        acc.total += req.kickbackFee || 0;
        
        // Check if request is from today
        const requestDate = new Date(req.created_at);
        requestDate.setHours(0, 0, 0, 0);
        
        if (requestDate.getTime() === today.getTime()) {
          acc.today += req.kickbackFee || 0;
        }
        
        return acc;
      }, { total: 0, today: 0 });
      
      setKickbackStats(stats);
    }
  }, [request, loadingRequest]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-center gap-2">
        <DollarSign className="text-gray-600" size={18} />
        <h3 className="text-gray-700 text-sm font-medium">Kickback Payouts</h3>
      </div>
      <p className="text-2xl sm:text-3xl font-semibold mt-2 text-gray-900">
        {formatCurrency(kickbackStats.total)}
      </p>
      <p className="text-sm text-green-600 mt-1">
        Today: {formatCurrency(kickbackStats.today)}
      </p>
    </div>
  );
}