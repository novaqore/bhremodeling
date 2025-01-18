"use client";
import { useState, useEffect } from 'react';
import { Calendar, AlertTriangle } from 'lucide-react';
import { ref, update } from 'firebase/database';
import { db } from '@/lib/firebase/init';

const TransactionTimelineCheckCashedDate = ({ request, company }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');
    const [daysUntilCashable, setDaysUntilCashable] = useState(0);

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

    useEffect(() => {
        if (request.cashDate) {
            const cashDate = new Date(request.cashDate);
            const today = new Date();
            const diffTime = cashDate - today;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            setDaysUntilCashable(diffDays);
        }
    }, [request.cashDate]);

    const handleDateSelect = (date) => {
        setSelectedDate(date);
        update(ref(db, `requests/-${request.id}`), {
            checkCashedDate: date || null
        });
        setIsModalOpen(false);
    };

    const isPending = !request.checkCashedDate;
    const isEligibleToCash = daysUntilCashable <= 0;

    return (
        <>
            <div 
                className="relative flex gap-4 items-start cursor-pointer group"
                onClick={() => setIsModalOpen(true)}
            >
                <div className={`w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200 group-hover:scale-105 ${
                    isPending ? 'bg-gray-100 group-hover:bg-gray-200' : 'bg-blue-50 group-hover:bg-blue-100'
                }`}>
                    <Calendar className={`w-6 h-6 transition-all duration-200 group-hover:scale-110 ${
                        isPending ? 'text-gray-400' : 'text-blue-500'
                    }`} />
                </div>
                <div className="flex-1 pt-2">
                    <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-200">Check Cashed Status</h3>
                    <p className="text-sm text-gray-500 mt-1">
                        {isPending ? 'Not yet cashed' : `Cashed on ${formatDate(request.checkCashedDate)}`}
                    </p>
                    {daysUntilCashable > 0 && !request.checkCashedDate && (
                        <div className="mt-2 flex items-center gap-2 text-orange-500 bg-orange-50 px-3 py-2 rounded-md">
                            <AlertTriangle className="w-4 h-4" />
                            <span className="text-sm">
                                Check becomes eligible to cash in {daysUntilCashable} days (on {new Date(request.cashDate).toLocaleDateString()})
                            </span>
                        </div>
                    )}
                    <div className="mt-2 text-sm text-gray-600">
                        {request.cashDate && `Eligible to cash from ${formatDate(request.cashDate)}`}
                    </div>
                </div>
                <div className="flex-shrink-0 w-24 pt-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        isPending 
                            ? 'bg-gray-100 text-gray-800' 
                            : 'bg-green-100 text-green-800'
                    }`}>
                        {isPending ? 'Pending' : 'Cashed'}
                    </span>
                </div>
            </div>

            {/* Custom Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl transform transition-all">
                        {/* Header */}
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                                    <Calendar className="w-6 h-6 text-blue-500" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-900">Record Check Cashed Date</h3>
                                    <p className="text-sm text-gray-500 mt-1">When was the check actually cashed?</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                            >
                                <span className="text-2xl text-gray-400 hover:text-gray-600">&times;</span>
                            </button>
                        </div>

                        {/* Warning Message When Not Eligible */}
                        {!isEligibleToCash && (
                            <div className="mb-6 flex items-center gap-2 text-orange-500 bg-orange-50 px-4 py-3 rounded-lg">
                                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                                <span className="text-sm">
                                    This check is not eligible to be cashed until {new Date(request.cashDate).toLocaleDateString()}
                                </span>
                            </div>
                        )}
                        
                        {/* Date Input Section */}
                        <div className="mb-8">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Cashed Date
                            </label>
                            <input
                                type="datetime-local"
                                className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                    !isEligibleToCash ? 'bg-gray-100 cursor-not-allowed opacity-50' : ''
                                }`}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                defaultValue={request.checkCashedDate || ''}
                                min={request.cashDate}
                                disabled={!isEligibleToCash}
                            />
                            {request.cashDate && isEligibleToCash && (
                                <div className="mt-2 flex items-center gap-2 text-gray-600">
                                    <span className="text-sm">
                                        Must be on or after {new Date(request.cashDate).toLocaleDateString()}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDateSelect(selectedDate)}
                                className={`px-5 py-2.5 bg-blue-500 text-white rounded-lg transition-colors font-medium flex items-center gap-2 ${
                                    !isEligibleToCash ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
                                }`}
                                disabled={!isEligibleToCash}
                            >
                                Update Cashed Date
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default TransactionTimelineCheckCashedDate;