"use client"
import { useAuth } from '@/contexts/auth';
import { db } from '@/lib/firebase/init';
import { onValue, ref, set } from 'firebase/database';
import { Building2, PlusCircle, FileSpreadsheet, DollarSign, Building, LineChart } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import DashboardRecentRequests from './DashboardRecentRequests';

export default function Dashboard() {
  const { user, loading } = useAuth();
  const [ requests, setRequests ] = useState(null)
  const [ loadingRequests, setLoadingRequests ] = useState(true)
  const [ requestStats, setRequestStats ] = useState({ total: 0, today: 0 })
  const [ kickbackStats, setKickbackStats ] = useState({ total: 0, today: 0 })
  const [ profitStats, setProfitStats ] = useState({ total: 0, today: 0 })
  const [ processedStats, setProcessedStats ] = useState({ total: 0, today: 0 })
  const [ bankFeeStats, setBankFeeStats ] = useState({ total: 0, today: 0 })

  useEffect(() => {
    setLoadingRequests(true)
    const requestsRef = ref(db, `requests`)
    const unsubscribe = onValue(requestsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val()
        setRequests(data)
        
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

        // Calculate bank fee statistics
        const bankFees = Object.values(data).reduce((acc, req) => {
          const bankFee = Number(req.bankFee) || 0
          acc.total += bankFee
          
          const requestDate = new Date(req.created_at)
          requestDate.setHours(0, 0, 0, 0)
          
          if (requestDate.getTime() === today.getTime()) {
            acc.today += bankFee
          }
          
          return acc
        }, { total: 0, today: 0 })

        setRequestStats(stats)
        setKickbackStats(kickback)
        setProfitStats(profit)
        setProcessedStats(processed)
        setBankFeeStats(bankFees)
        setLoadingRequests(false)
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
    <div className="mx-auto max-w-6xl px-6 pb-6 pt-20">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-2">
          <div className="flex flex-row items-center">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
          </div>
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <Link
              href="/report"
              className="flex-1 sm:flex-none bg-purple-600 text-white px-3 py-2 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center justify-center gap-2 text-sm"
            >
              <LineChart size={18} />
              <span>Report</span>
            </Link>
            <Link
              href="/companies"
              className="flex-1 sm:flex-none bg-yellow-600 text-white px-3 py-2 rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center justify-center gap-2 text-sm"
            >
              <Building2 size={18} />
              <span>Companies</span>
            </Link>
            <Link
              href="/request/new"
              className="flex-1 sm:flex-none bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center gap-2 text-sm"
            >
              <PlusCircle size={18} />
              <span>New Request</span>
            </Link>
          </div>
        </div>

  {/* Stats Cards */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
    {/* Total Requests Card */}
    <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
        <div className="flex items-center gap-3 mb-3">
            <FileSpreadsheet className="text-blue-600" size={18} />
            <h3 className="text-sm text-gray-500">Total Requests</h3>
        </div>
        <div>
            <p className="text-xl text-gray-800">{requestStats.total}</p>
            <p className="text-xs text-green-600 mt-1">
                +{requestStats.today} today
            </p>
        </div>
    </div>

    {/* Total Processed Card */}
    <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
        <div className="flex items-center gap-3 mb-3">
            <DollarSign className="text-yellow-600" size={18} />
            <h3 className="text-sm text-gray-500">Total Processed</h3>
        </div>
        <div>
            <p className="text-xl text-gray-800">{formatCurrency(processedStats.total)}</p>
            <p className="text-xs text-green-600 mt-1">
                +{formatCurrency(processedStats.today)} today
            </p>
        </div>
    </div>

    {/* Kickback Payouts Card */}
    <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
        <div className="flex items-center gap-3 mb-3">
            <DollarSign className="text-purple-600" size={18} />
            <h3 className="text-sm text-gray-500">Kickback Payouts</h3>
        </div>
        <div>
            <p className="text-xl text-gray-800">{formatCurrency(kickbackStats.total)}</p>
            <p className="text-xs text-purple-600 mt-1">
                +{formatCurrency(kickbackStats.today)} today
            </p>
        </div>
    </div>

    {/* Bank Fees Card */}
    <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
        <div className="flex items-center gap-3 mb-3">
            <DollarSign className="text-red-600" size={18} />
            <h3 className="text-sm text-gray-500">Bank Fees</h3>
        </div>
        <div>
            <p className="text-xl text-gray-800">{formatCurrency(bankFeeStats.total)}</p>
            <p className="text-xs text-red-600 mt-1">
                +{formatCurrency(bankFeeStats.today)} today
            </p>
        </div>
    </div>

    {/* Profit Card */}
    <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
        <div className="flex items-center gap-3 mb-3">
            <Building className="text-green-600" size={18} />
            <h3 className="text-sm text-gray-500">Profit</h3>
        </div>
        <div>
            <p className="text-xl text-gray-800">{formatCurrency(profitStats.total)}</p>
            <p className="text-xs text-green-600 mt-1">
                +{formatCurrency(profitStats.today)} today
            </p>
        </div>
    </div>
</div>

        {/* Recent Requests Section */}
        <DashboardRecentRequests 
          requests={requests}
          formatCurrency={formatCurrency}
          loadingRequests={loadingRequests}
        />
    </div>
  )
}