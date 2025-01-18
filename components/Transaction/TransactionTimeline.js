"use client";
import { CheckSquare } from 'lucide-react';
import TransactionTimelineCreated from './TransactionTimelineCreated';
import TransactionTimelineCheckReceived from './TransactionTimelineCheckReceived';
import TransactionTimelineCashDispensed from './TransactionTimelineCashDispensed';
import TransactionTimelineCheckCashedDate from './TransactionTimelineCheckCashedDate';
import TransactionTimelineKickback from './TransactionTimelineKickback';

const TransactionTimeline = ({ request, company }) => {
    const isTransactionComplete = () => {
        const hasCheckReceived = request?.checkReceivedDate && request.checkReceivedDate !== '';
        const hasCashDispensed = request?.cashDispensedDate && request.cashDispensedDate !== '';
        const hasCheckCashed = request?.checkCashedDate && request.checkCashedDate !== '';
        const kickbackPaid = request?.kickbackPaidDate && request.kickbackPaidDate !== '';
        const kickbackFee = request?.kickbackFee || 0;
        
        if(kickbackFee){
            return hasCheckReceived && hasCashDispensed && hasCheckCashed && kickbackPaid || false
        } else {
            return hasCheckReceived && hasCashDispensed && hasCheckCashed || false
        }
    };

    const complete = isTransactionComplete();

    return (
        <div className="lg:w-2/3">
            <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-8">Transaction Timeline</h2>
                <div className="relative">
                    <div className={`absolute left-[27px] top-[28px] h-[calc(100%-64px)] w-0.5 ${complete? 'bg-green-100' : 'bg-blue-100'  }`}></div>
                    <div className="space-y-8">
                        <TransactionTimelineCreated request={request} company={company} complete={complete} />
                        <TransactionTimelineCheckReceived request={request} company={company} complete={complete} />
                        <TransactionTimelineCashDispensed request={request} company={company} complete={complete} />
                        <TransactionTimelineCheckCashedDate request={request} company={company} complete={complete} />
                        {
                            request?.kickbackFee > 0 && (
                                <TransactionTimelineKickback request={request} company={company} complete={complete} />
                            )
                        }
                        <div className="relative flex gap-4 items-start">
                            <div className={`w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 ${
                                complete ? 'bg-green-100' : 'bg-gray-100'
                            }`}>
                                <CheckSquare className={`w-6 h-6 ${
                                    complete ? 'text-green-600' : 'text-gray-400'
                                }`} />
                            </div>
                            <div className="flex-1 pt-2">
                                <h3 className="font-medium text-gray-900">Transaction Complete</h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    {complete ? 'Completed' : 'Pending'}
                                </p>
                                <div className="mt-2 text-sm text-gray-600">All processes completed</div>
                            </div>
                            <div className="flex-shrink-0 w-24 pt-2">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    complete 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-gray-100 text-gray-800'
                                }`}>
                                    {complete ? 'Complete' : 'Upcoming'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TransactionTimeline;