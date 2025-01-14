"use client"
import { useApp } from "@/contexts/AppContext"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Building2, PlusCircle, FileSpreadsheet, DollarSign, Building, ChevronLeft, ChevronRight } from 'lucide-react'
import { db } from "@/lib/firebase/init"
import { ref, query, limitToLast, get, orderByChild, endBefore, startAfter } from 'firebase/database'

export default function Dashboard() {
  const router = useRouter()
  const { user } = useApp()
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [lastVisible, setLastVisible] = useState(null)
  const [firstVisible, setFirstVisible] = useState(null)
  const [stats, setStats] = useState({
    totalRequests: 0,
    todayRequests: 0,
    totalProcessed: 0,
    todayProcessed: 0,
    totalProfit: 0,
    todayProfit: 0
  })

  useEffect(() => {
    if (!user) router.push('/login')
  }, [user])

  useEffect(() => {
    loadInitialStats()
    loadInitialRequests()
  }, [])

  const loadInitialStats = async () => {
    const requestsRef = ref(db, 'requests')
    try {
      const snapshot = await get(requestsRef)
      if (snapshot.exists()) {
        const allRequests = Object.values(snapshot.val())
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        
        const todaysRequests = allRequests.filter(req => new Date(req.createdAt) >= today)
        
        setStats({
          totalRequests: allRequests.length,
          todayRequests: todaysRequests.length,
          totalProcessed: allRequests.reduce((sum, req) => sum + parseFloat(req.requestAmount), 0),
          todayProcessed: todaysRequests.reduce((sum, req) => sum + parseFloat(req.requestAmount), 0),
          totalProfit: allRequests.reduce((sum, req) => sum + (req.profit || 0), 0),
          todayProfit: todaysRequests.reduce((sum, req) => sum + (req.profit || 0), 0)
        })
      }
    } catch (error) {
      console.error("Error loading stats:", error)
    }
  }

  const loadInitialRequests = async () => {
    setLoading(true)
    const requestsRef = ref(db, 'requests')
    const recentRequestsQuery = query(
      requestsRef,
      orderByChild('createdAt'),
      limitToLast(5)
    )
    
    try {
      const snapshot = await get(recentRequestsQuery)
      if (snapshot.exists()) {
        const requestsArray = Object.values(snapshot.val())
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        setRequests(requestsArray)
        setFirstVisible(requestsArray[0].createdAt)
        setLastVisible(requestsArray[requestsArray.length - 1].createdAt)
      }
    } catch (error) {
      console.error("Error loading requests:", error)
    }
    setLoading(false)
  }

  const loadNextPage = async () => {
    if (!lastVisible) return
    setLoading(true)
    
    const requestsRef = ref(db, 'requests')
    const nextQuery = query(
      requestsRef,
      orderByChild('createdAt'),
      endBefore(lastVisible),
      limitToLast(5)
    )

    try {
      const snapshot = await get(nextQuery)
      if (snapshot.exists()) {
        const requestsArray = Object.values(snapshot.val())
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        setRequests(requestsArray)
        setFirstVisible(requestsArray[0].createdAt)
        setLastVisible(requestsArray[requestsArray.length - 1].createdAt)
        setCurrentPage(prev => prev + 1)
      }
    } catch (error) {
      console.error("Error loading next page:", error)
    }
    setLoading(false)
  }

  const loadPreviousPage = async () => {
    if (!firstVisible || currentPage === 1) return
    setLoading(true)
    
    const requestsRef = ref(db, 'requests')
    const previousQuery = query(
      requestsRef,
      orderByChild('createdAt'),
      startAfter(firstVisible),
      limitToLast(5)
    )

    try {
      const snapshot = await get(previousQuery)
      if (snapshot.exists()) {
        const requestsArray = Object.values(snapshot.val())
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        setRequests(requestsArray)
        setFirstVisible(requestsArray[0].createdAt)
        setLastVisible(requestsArray[requestsArray.length - 1].createdAt)
        setCurrentPage(prev => prev - 1)
      }
    } catch (error) {
      console.error("Error loading previous page:", error)
    }
    setLoading(false)
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const getRelativeTime = (dateString) => {
    const diff = new Date() - new Date(dateString)
    const hours = diff / (1000 * 60 * 60)
    
    if (hours < 1) return 'Just now'
    if (hours < 24) return `${Math.floor(hours)}h ago`
    return new Date(dateString).toLocaleDateString()
  }

  if (loading && currentPage === 1) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-gray-500">Loading dashboard...</div>
    </div>
  }

  return (
    <div className="bg-gray-50 py-6 px-4 mt-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section - Made more compact on mobile */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <Link
              href="/companies"
              className="flex-1 sm:flex-none bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center justify-center gap-2 text-sm"
            >
              <Building2 size={18} />
              <span>Companies</span>
            </Link>
            <Link
              href="/requests/new"
              className="flex-1 sm:flex-none bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center gap-2 text-sm"
            >
              <PlusCircle size={18} />
              <span>New Request</span>
            </Link>
          </div>
        </div>

        {/* Stats Cards - Single column on mobile, three columns on larger screens */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="text-gray-600" size={18} />
              <h3 className="text-gray-700 text-sm font-medium">Total Requests</h3>
            </div>
            <p className="text-2xl sm:text-3xl font-semibold mt-2 text-gray-900">{stats.totalRequests}</p>
            <p className="text-sm text-green-600 mt-1">
              Today: {stats.todayRequests}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="text-gray-600" size={18} />
              <h3 className="text-gray-700 text-sm font-medium">Total Processed</h3>
            </div>
            <p className="text-2xl sm:text-3xl font-semibold mt-2 text-gray-900">{formatCurrency(stats.totalProcessed)}</p>
            <p className="text-sm text-green-600 mt-1">
              Today: {formatCurrency(stats.todayProcessed)}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2">
              <Building className="text-gray-600" size={18} />
              <h3 className="text-gray-700 text-sm font-medium">Profit</h3>
            </div>
            <p className="text-2xl sm:text-3xl font-semibold mt-2 text-gray-900">{formatCurrency(stats.totalProfit)}</p>
            <p className="text-sm text-green-600 mt-1">
              Today: {formatCurrency(stats.todayProfit)}
            </p>
          </div>
        </div>

        {/* Recent Requests Section - Improved mobile layout */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="text-gray-600" size={18} />
                <h2 className="text-lg font-medium text-gray-900">Recent Requests</h2>
              </div>
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={loadPreviousPage}
                  disabled={currentPage === 1 || loading}
                  className="p-1.5 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Previous page"
                >
                  <ChevronLeft size={18} />
                </button>
                <span className="text-sm text-gray-600">Page {currentPage}</span>
                <button
                  onClick={loadNextPage}
                  disabled={!lastVisible || loading}
                  className="p-1.5 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Next page"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {requests.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No requests yet
              </div>
            ) : (
              requests.map((request) => (
                <Link 
                  key={request.id}
                  href={`/requests/${request.id}`}
                  className="p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 hover:bg-gray-50 cursor-pointer"
                >
                  <div>
                    <p className="font-medium text-gray-900">{request.companyName}</p>
                    <p className="text-sm text-gray-600">Requested {getRelativeTime(request.createdAt)}</p>
                  </div>
                  <div className="sm:text-right">
                    <p className="font-medium text-gray-900">{formatCurrency(request.requestAmount)}</p>
                    <p className="text-sm text-gray-600">Fee: {formatCurrency(request.fee)}</p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}