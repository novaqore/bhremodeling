"use client"

export default function RequestHeader({ requestId }) {
    return (
        <div className="flex flex-col">
            <div className="flex items-center justify-between">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Transaction Details</h1>
                <span className="rounded-full bg-blue-100 px-3 py-1 text-blue-800 text-sm font-medium">
                    {requestId}
                </span>
            </div>
        </div>
    )
}