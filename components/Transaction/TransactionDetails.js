"use client";
import React from 'react';
import Link from 'next/link';
import {
    ArrowLeftRight,
    Building2,
    CircleArrowDown,
    Coins,
    DollarSign,
    HashIcon,
    PenLine,
    Percent,
    ChevronRight,
} from 'lucide-react';

const TransactionDetails = ({ request, company }) => {
    const getActiveMultiplier = () => {
        if (request?.subCompany_id && company?.subcontractors?.[request.subCompany_id]?.multiplier) {
            return company.subcontractors[request.subCompany_id].multiplier;
        }
        return company?.multiplier || 0;
    };

    const formatMultiplierAsPercentage = (multiplier) => {
        return `${(parseFloat(multiplier) * 100).toFixed(1)}%`;
    };

    return (
        <div className="lg:w-1/3">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                {/* Header */}
                <div className="p-4 border-b border-gray-100">
                    <h2 className="font-semibold text-gray-900">Transaction Details</h2>
                </div>

                {/* Content */}
                <div className="divide-y divide-gray-100">
                    {/* Company Info Section */}
                    <div className="bg-gray-50 p-4">
                        <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-gray-600" />
                            <span className="text-sm font-medium text-gray-900">Company Details</span>
                        </div>
                        
                        <div className="mt-3 space-y-2">
                            <div className="flex items-center">
                                <div className="w-28 text-sm text-gray-500">Main Company:</div>
                                <Link
                                    href={`/company?id=${company.id.slice(1)}`}
                                    className="text-sm font-medium text-blue-500 hover:underline"
                                >
                                    {company.companyName}
                                </Link>
                            </div>
                            
                            {request?.subCompany_id && (
                                <div className="flex items-center">
                                    <div className="w-28 text-sm text-gray-500">Sub Company:</div>
                                    <span className="text-sm font-medium text-gray-900">
                                        {company.subcontractors[request?.subCompany_id]?.name || "Sub Company"}
                                    </span>
                                </div>
                            )}

                            <div className="flex items-center">
                                <div className="w-28 text-sm text-gray-500">Active Rate:</div>
                                <div className="flex items-center gap-2">
                                    <Percent className="w-3.5 h-3.5 text-gray-400" />
                                    <span className="text-sm font-medium text-gray-900">
                                        {formatMultiplierAsPercentage(getActiveMultiplier())}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Transaction Details */}
                    <div className="p-4 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <Coins className="w-4 h-4 text-blue-400" />
                            <span className="text-sm text-gray-600">Request Amount</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">${request.requestAmount}</span>
                    </div>

                    <div className="p-4 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <PenLine className="w-4 h-4 text-orange-400" />
                            <span className="text-sm text-gray-600">Check Amount</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">${request.checkAmount}</span>
                    </div>

                    <div className="p-4 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <HashIcon className="w-4 h-4 text-orange-400" />
                            <span className="text-sm text-gray-600">Check Number</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{request.checkNumber}</span>
                    </div>

                    <div className="p-4 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <CircleArrowDown className="w-4 h-4 text-red-400" />
                            <span className="text-sm text-gray-600">Processing Fee</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">${request.processingFee}</span>
                    </div>

                    <div className="p-4 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <ArrowLeftRight
                                className={`w-4 h-4 ${
                                    request.kickbackFee <= 0 ? "text-gray-400" : "text-purple-400"
                                }`}
                            />
                            <span
                                className={`text-sm ${
                                    request.kickbackFee <= 0 ? "text-gray-400" : "text-purple-400"
                                }`}
                            >
                                {request.kickbackFee <= 0 ? "No Kickback" : "Kickback Fee"}
                            </span>
                        </div>
                        <span
                            className={`text-sm font-medium ${
                                request.kickbackFee <= 0 ? "text-gray-400" : "text-purple-400"
                            }`}
                        >
                            ${request.kickbackFee}
                        </span>
                    </div>

                    <div className="p-4 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <Coins className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">Bank Fee</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">${request.bankFee}</span>
                    </div>

                    {/* Final Results Section */}
                    <div className="bg-gray-50">
                        <div className="p-4 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <Building2 className="w-4 h-4 text-blue-500" />
                                <span className="text-sm font-medium text-gray-900">Company Payout</span>
                            </div>
                            <span className="text-sm font-medium text-blue-600">${request.customerPayout}</span>
                        </div>

                        <div className="p-4 flex justify-between items-center border-t border-gray-200">
                            <div className="flex items-center gap-2">
                                <DollarSign className="w-4 h-4 text-green-500" />
                                <span className="text-sm font-medium text-gray-900">Final Profit</span>
                            </div>
                            <span className="text-sm font-medium text-green-600">${request.profit}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TransactionDetails;