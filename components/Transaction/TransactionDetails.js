"use client";
import React from 'react';
import Link from 'next/link'; // Import from 'next/link'
import {
    ArrowLeftRight,
    Building2,
    CircleArrowDown,
    Coins,
    DollarSign,
    HashIcon,
    PenLine,
} from 'lucide-react';

const TransactionDetails = ({ request, company }) => {
    return (
        <div className="lg:w-1/3">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                {/* Header */}
                <div className="p-4 border-b border-gray-100">
                    <h2 className="font-semibold text-gray-900">Transaction Details</h2>
                </div>

                {/* Content */}
                <div className="divide-y divide-gray-100">
                    {/* Company Name */}
                    <div className="p-4 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">Company</span>
                        </div>
                        <Link
                            href={`/company?id=${company.id.slice(1)}`}
                            className="text-sm font-medium text-blue-500 hover:underline"
                        >
                            {company.companyName}
                        </Link>
                    </div>

                    {/* Sub Company */}
                    {request?.subCompany_id && (
                        <div className="p-4 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <Building2 className="w-4 h-4 text-gray-400" />
                                <span className="text-sm text-gray-600">Sub Company</span>
                            </div>
                            <span className="text-sm font-medium text-gray-900">
                                {company.subcontractors[request?.subCompany_id]?.name || "Sub Company"}
                            </span>
                        </div>
                    )}

                    {/* Request Amount */}
                    <div className="p-4 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <Coins className="w-4 h-4 text-blue-400" />
                            <span className="text-sm text-gray-600">Request Amount</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">${request.requestAmount}</span>
                    </div>

                    {/* Check Amount */}
                    <div className="p-4 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <PenLine className="w-4 h-4 text-orange-400" />
                            <span className="text-sm text-gray-600">Check Amount</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">${request.checkAmount}</span>
                    </div>

                    {/* Check Number */}
                    <div className="p-4 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <HashIcon className="w-4 h-4 text-orange-400" />
                            <span className="text-sm text-gray-600">Check Number</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{request.checkNumber}</span>
                    </div>

                    {/* Processing Fee */}
                    <div className="p-4 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <CircleArrowDown className="w-4 h-4 text-red-400" />
                            <span className="text-sm text-gray-600">Processing Fee</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">${request.processingFee}</span>
                    </div>

                    {/* Kickback Fee */}
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

                    {/* Bank Fee */}
                    <div className="p-4 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">Bank Fee</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">${request.bankFee}</span>
                    </div>

                    {/* Profit */}
                    <div className="p-4 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-green-400" />
                            <span className="text-sm text-gray-600">Profit</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">${request.profit}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TransactionDetails;
