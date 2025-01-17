"use client";
import { useState } from 'react';
import { Calendar } from 'lucide-react';
import { ref, update } from 'firebase/database';
import { db } from '@/lib/firebase/init';

const TransactionTimelineCheckCashedDate = ({ request, company }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');

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

    const handleDateSelect = (date) => {
        setSelectedDate(date);
        update(ref(db, `requests/-${request.id}`), {
            checkCashDate: date
        })
        setIsModalOpen(false);
    };

    const isPending = !request.checkCashDate;

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
                    <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-200">Check Cash Date</h3>
                    <p className="text-sm text-gray-500 mt-1">
                        {isPending ? 'Pending' : formatDate(request.checkCashDate)}
                    </p>
                    <div className="mt-2 text-sm text-gray-600">Scheduled date for check processing</div>
                </div>
                <div className="flex-shrink-0 w-24 pt-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        isPending 
                            ? 'bg-gray-100 text-gray-800' 
                            : 'bg-green-100 text-green-800'
                    }`}>
                        {isPending ? 'Pending' : 'Completed'}
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
                                    <h3 className="text-xl font-semibold text-gray-900">Check Cash Date</h3>
                                    <p className="text-sm text-gray-500 mt-1">When was the check cashed?</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                            >
                                <span className="text-2xl text-gray-400 hover:text-gray-600">&times;</span>
                            </button>
                        </div>
                        
                        {/* Date Input Section */}
                        <div className="mb-8">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Timestamp
                            </label>
                            <input
                                type="datetime-local"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                onChange={(e) => setSelectedDate(e.target.value)}
                                defaultValue={request.checkCashDate || ''}
                            />
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
                                className="px-5 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium flex items-center gap-2"
                            >
                                Update Timeline
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default TransactionTimelineCheckCashedDate;