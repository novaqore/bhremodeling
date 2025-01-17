"use client";
import { CalendarCheck } from 'lucide-react';

const TransactionTimelineCreated = ({ request, company}) => {
    // Format the timestamp to date and time
    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric'
        }) + ' - ' + date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };
 
    return (
        <div className="relative flex gap-4 items-start">
        <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
            <CalendarCheck className="w-6 h-6 text-blue-500" />
        </div>
        <div className="flex-1 pt-2">
            <h3 className="font-medium text-gray-900">Request Created</h3>
            <p className="text-sm text-gray-500 mt-1">{formatDate(request.created_at)}</p>
            <div className="mt-2 text-sm text-gray-600">Initial request submitted for processing</div>
        </div>
        <div className="flex-shrink-0 w-24 pt-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Completed
            </span>
        </div>
    </div>
    );
};

export default TransactionTimelineCreated;