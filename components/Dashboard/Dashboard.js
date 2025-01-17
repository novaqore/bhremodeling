"use client"
import { useAuth } from '@/contexts/auth';
import { db } from '@/lib/firebase/init';
import { onValue, ref, set } from 'firebase/database';
import { Building2, PlusCircle, FileSpreadsheet, DollarSign, Building, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const { user, loading } = useAuth();
  const [ request, setRequest ] = useState(null)
  const [ loadingRequest, setLoadingRequest ] = useState(true)
  const [ requestStats, setRequestStats ] = useState({ total: 0, today: 0 })
  const [ kickbackStats, setKickbackStats ] = useState({ total: 0, today: 0 })
  const [ profitStats, setProfitStats ] = useState({ total: 0, today: 0 })
  const [ processedStats, setProcessedStats ] = useState({ total: 0, today: 0 })

  useEffect(() => {
    setLoadingRequest(true)
    const requestRef = ref(db, `requests`)
    const unsubscribe = onValue(requestRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val()
        setRequest(data)
        
        // Calculate request statistics
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        
        const stats = Object.values(data).reduce((acc, req) => {
          acc.total++
          
          const requestDate = new Date(req.created_at)
          requestDate.setHours(0, 0, 0, 0)
          
          if (requestDate.getTime() === today.getTime()) {
            acc.today++
          }
          
          return acc
        }, { total: 0, today: 0 })
        
        // Calculate kickback statistics
        const kickback = Object.values(data).reduce((acc, req) => {
          const kickbackFee = Number(req.kickbackFee) || 0
          acc.total += kickbackFee
          
          const requestDate = new Date(req.created_at)
          requestDate.setHours(0, 0, 0, 0)
          
          if (requestDate.getTime() === today.getTime()) {
            acc.today += kickbackFee
          }
          
          return acc
        }, { total: 0, today: 0 })

        // Calculate profit statistics
        const profit = Object.values(data).reduce((acc, req) => {
          const profitAmount = Number(req.profit) || 0
          acc.total += profitAmount
          
          const requestDate = new Date(req.created_at)
          requestDate.setHours(0, 0, 0, 0)
          
          if (requestDate.getTime() === today.getTime()) {
            acc.today += profitAmount
          }
          
          return acc
        }, { total: 0, today: 0 })
        
        setRequestStats(stats)
        setKickbackStats(kickback)
        // Calculate processed statistics
        const processed = Object.values(data).reduce((acc, req) => {
          const checkAmount = Number(req.checkAmount) || 0
          acc.total += checkAmount
          
          const requestDate = new Date(req.created_at)
          requestDate.setHours(0, 0, 0, 0)
          
          if (requestDate.getTime() === today.getTime()) {
            acc.today += checkAmount
          }
          
          return acc
        }, { total: 0, today: 0 })

        setRequestStats(stats)
        setKickbackStats(kickback)
        setProfitStats(profit)
        setProcessedStats(processed)
        setLoadingRequest(false)
      }
    })

    return () => unsubscribe()
  }, [])

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount)
  }

  if(loading || !user) return null;

  return (
    <div className="mx-auto px-6 pb-6 pt-20">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-2">
          <div className="flex flex-row items-center">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
          </div>
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <Link
              href="/companies"
              className="flex-1 sm:flex-none bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center justify-center gap-2 text-sm"
            >
              <Building2 size={18} />
              <span>Companies</span>
            </Link>
            <Link
              href="/request/new"
              className="flex-1 sm:flex-none bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center gap-2 text-sm"
            >
              <PlusCircle size={18} />
              <span>New Request</span>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg shadow-sm p-4">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="text-gray-600" size={18} />
              <h3 className="text-gray-700 text-sm font-medium">Total Requests</h3>
            </div>
            <p className="text-2xl sm:text-3xl font-semibold mt-2 text-gray-900">{requestStats.total}</p>
            <p className="text-sm text-green-600 mt-1">
              Today: +{requestStats.today}
            </p>
          </div>

          <div className="bg-purple-50 rounded-lg shadow-sm p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="text-gray-600" size={18} />
              <h3 className="text-gray-700 text-sm font-medium">Kickback Payouts</h3>
            </div>
            <p className="text-2xl sm:text-3xl font-semibold mt-2 text-gray-900">{formatCurrency(kickbackStats.total)}</p>
            <p className="text-sm text-green-600 mt-1">
              Today: {formatCurrency(kickbackStats.today)}
            </p>
          </div>

          <div className="bg-yellow-50 rounded-lg shadow-sm p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="text-gray-600" size={18} />
              <h3 className="text-gray-700 text-sm font-medium">Total Processed</h3>
            </div>
            <p className="text-2xl sm:text-3xl font-semibold mt-2 text-gray-900">{formatCurrency(processedStats.total)}</p>
            <p className="text-sm text-green-600 mt-1">
              Today: {formatCurrency(processedStats.today)}
            </p>
          </div>

          <div className="bg-green-50 rounded-lg shadow-sm p-4">
            <div className="flex items-center gap-2">
              <Building className="text-gray-600" size={18} />
              <h3 className="text-gray-700 text-sm font-medium">Profit</h3>
            </div>
            <p className="text-2xl sm:text-3xl font-semibold mt-2 text-gray-900">{formatCurrency(profitStats.total)}</p>
            <p className="text-sm text-green-600 mt-1">
              Today: {formatCurrency(profitStats.today)}
            </p>
          </div>
        </div>

        {/* Recent Requests Section */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="text-gray-600" size={18} />
                <h2 className="text-lg font-medium text-gray-900">Recent Requests</h2>
              </div>
              <div className="flex items-center justify-end gap-3">
                <button
                  className="p-1.5 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Previous page"
                >
                  <ChevronLeft size={18} />
                </button>
                <span className="text-sm text-gray-600">Page 1</span>
                <button
                  className="p-1.5 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Next page"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {request && Object.entries(request).map(([id, req]) => (
              <Link 
                key={id}
                href={`/transaction/${id.slice(1)}`}
                className="p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 hover:bg-gray-50 cursor-pointer"
              >
                <div>
                  <p className="font-medium text-gray-900">{req.company_id}</p>
                  <p className="text-sm text-gray-600">{new Date(req.created_at).getTime()}</p>
                </div>
                <div className="sm:text-right">
                  <p className="font-medium text-gray-900">{formatCurrency(req.requestAmount || 0)}</p>
                  <p className="text-sm text-gray-600">Check: {req.checkNumber || 'N/A'}</p>
                </div>
              </Link>
            ))}
            {(!request || Object.keys(request).length === 0) && (
              <div className="p-4 text-center text-gray-500">
                No requests found
              </div>
            )}
          </div>
        </div>
    </div>
  )
}