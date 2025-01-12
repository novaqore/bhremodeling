"use client"
import { useApp } from "@/contexts/AppContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Link from "next/link"

export default function Dashboard() {
  const router = useRouter()
  const { user } = useApp()

  useEffect(() => {
    if (!user) router.push('/login')
  }, [user])

  // Example data - replace with your actual data
  const stats = {
    totalRequests: 156,
    totalProcessed: "$45,750.00",
    totalProfit: "$2,287.50"
  }

  return (
    <div className="bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <Link
            href="/requests/new"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Start New Request
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Requests Card */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-gray-700 text-sm font-medium">Total Requests</h3>
            <p className="text-3xl font-semibold mt-2 text-gray-900">{stats.totalRequests}</p>
            <div className="mt-2 text-sm text-green-600">+12 from last week</div>
          </div>

          {/* Total Cash Processed Card */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-gray-700 text-sm font-medium">Total Cash Processed</h3>
            <p className="text-3xl font-semibold mt-2 text-gray-900">{stats.totalProcessed}</p>
            <div className="mt-2 text-sm text-green-600">+$5,250 from last week</div>
          </div>

          {/* Total Profit Card */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-gray-700 text-sm font-medium">Total Profit</h3>
            <p className="text-3xl font-semibold mt-2 text-gray-900">{stats.totalProfit}</p>
            <div className="mt-2 text-sm text-green-600">+$262.50 from last week</div>
          </div>
        </div>

        {/* Recent Requests Section */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Recent Requests</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {/* Example request items - replace with your actual data */}
            <div className="p-6 flex justify-between items-center hover:bg-gray-50">
              <div>
                <p className="font-medium text-gray-900">Check #1234</p>
                <p className="text-sm text-gray-600">Requested 2h ago</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">$500.00</p>
                <p className="text-sm text-gray-600">Fee: $25.00</p>
              </div>
            </div>
            <div className="p-6 flex justify-between items-center hover:bg-gray-50">
              <div>
                <p className="font-medium text-gray-900">Check #1233</p>
                <p className="text-sm text-gray-600">Requested 5h ago</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">$750.00</p>
                <p className="text-sm text-gray-600">Fee: $37.50</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}