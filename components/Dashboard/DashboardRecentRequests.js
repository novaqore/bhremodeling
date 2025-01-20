"use client"
import { FileSpreadsheet, ArrowUpDown, LayoutGrid, ClipboardCheck, CircleDollarSign, Banknote, ArrowLeftRight, CheckCircle, Hash, Download } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { onValue, ref } from 'firebase/database'
import { db } from '@/lib/firebase/init'
import KickbackPending from '../Kickback/KickbackPendingModal'

const style = `
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}

.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}`

export default function DashboardRecentRequests({ requests, formatCurrency, loadingRequests }) {
  const [companies, setCompanies] = useState({})
  const [loadingCompanies, setLoadingCompanies] = useState(true)
  const [sortNewest, setSortNewest] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    const companiesRef = ref(db, 'companies')
    const unsubscribe = onValue(companiesRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val()
        setCompanies(data)
      }
      setLoadingCompanies(false)
    })

    return () => unsubscribe()
  }, [])

  const getCompanyName = (companyId) => {
    if (!companies || !companyId) return 'Unknown Company'
    const company = companies[companyId]
    return company ? company.companyName : 'Unknown Company'
  }

  const formatDateTime = (timestamp) => {
    const date = new Date(timestamp)
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date)
  }

  const getFilteredAndSortedRequests = () => {
    if (!requests) return []
    
    let filteredRequests = Object.entries(requests)
    
    if (filter === 'received') {
      filteredRequests = filteredRequests.filter(([_, req]) => req.checkReceivedDate)
    } else if (filter === 'dispensed') {
      filteredRequests = filteredRequests.filter(([_, req]) => req.cashDispensedDate)
    } else if (filter === 'cashed') {
      filteredRequests = filteredRequests.filter(([_, req]) => req.checkCashedDate)
    } else if (filter === 'kickback') {
      filteredRequests = filteredRequests.filter(([_, req]) => req.kickbackPaidDate)
    } else if (filter === 'completed') {
      filteredRequests = filteredRequests.filter(([_, req]) => 
        req.checkReceivedDate && 
        req.cashDispensedDate && 
        req.checkCashedDate && 
        ((Number(req.kickbackFee) > 0 && req.kickbackPaidDate) || Number(req.kickbackFee) <= 0)
      )
    }
    
    return filteredRequests.sort((a, b) => {
      const dateA = new Date(a[1].created_at).getTime()
      const dateB = new Date(b[1].created_at).getTime()
      return sortNewest ? dateB - dateA : dateA - dateB
    })
  }

  return (
    <>
      <style>{style}</style>
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="text-gray-600" size={18} />
                <h2 className="text-lg font-medium text-gray-900">Recent Requests</h2>
              </div>
              <button
                onClick={() => setSortNewest(!sortNewest)}
                className="p-1.5 rounded-md hover:bg-gray-100 text-gray-600 flex items-center gap-1"
              >
                <ArrowUpDown size={16} />
                <span className="text-sm">{sortNewest ? 'Newest' : 'Oldest'}</span>
              </button>
            </div>
            
            <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
              <div className="flex gap-2 min-w-max">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-3 py-1.5 rounded-md text-sm flex items-center gap-1 ${
                    filter === 'all' 
                    ? 'bg-gray-100 text-gray-700 font-medium' 
                    : 'hover:bg-gray-100 text-gray-600'
                  }`}
                >
                  <LayoutGrid size={16} />
                  <span>All</span>
                </button>
                <button
                  onClick={() => setFilter('received')}
                  className={`px-3 py-1.5 rounded-md text-sm flex items-center gap-1 ${
                    filter === 'received' 
                    ? 'bg-yellow-100 text-yellow-700 font-medium' 
                    : 'hover:bg-gray-100 text-gray-600'
                  }`}
                >
                  <Hash size={16} />
                  <span>Received</span>
                </button>
                <button
                  onClick={() => setFilter('dispensed')}
                  className={`px-3 py-1.5 rounded-md text-sm flex items-center gap-1 ${
                    filter === 'dispensed' 
                    ? 'bg-green-100 text-green-700 font-medium' 
                    : 'hover:bg-gray-100 text-gray-600'
                  }`}
                >
                  <CircleDollarSign size={16} />
                  <span>Dispensed</span>
                </button>
                <button
                  onClick={() => setFilter('cashed')}
                  className={`px-3 py-1.5 rounded-md text-sm flex items-center gap-1 ${
                    filter === 'cashed' 
                    ? 'bg-blue-100 text-blue-700 font-medium' 
                    : 'hover:bg-gray-100 text-gray-600'
                  }`}
                >
                  <Download size={16} />
                  <span>Cashed</span>
                </button>
                <button
                  onClick={() => setFilter('kickback')}
                  className={`px-3 py-1.5 rounded-md text-sm flex items-center gap-1 ${
                    filter === 'kickback' 
                    ? 'bg-purple-100 text-purple-700 font-medium' 
                    : 'hover:bg-gray-100 text-gray-600'
                  }`}
                >
                  <ArrowLeftRight size={16} />
                  <span>Kickback</span>
                </button>
                <button
                  onClick={() => setFilter('completed')}
                  className={`px-3 py-1.5 rounded-md text-sm flex items-center gap-1 ${
                    filter === 'completed' 
                    ? 'bg-emerald-100 text-emerald-700 font-medium' 
                    : 'hover:bg-gray-100 text-gray-600'
                  }`}
                >
                  <CheckCircle size={16} />
                  <span>Completed</span>
                </button>
                {/* <KickbackPending requests={requests} formatCurrency={formatCurrency} /> */}
              </div>
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {getFilteredAndSortedRequests().map(([id, req]) => (
            <Link 
              key={id}
              href={`/transaction?id=${id.slice(1)}`}
              className={`p-4 flex flex-col sm:flex-row justify-between hover:bg-gray-50 cursor-pointer ${
                req.checkReceivedDate && 
                req.cashDispensedDate && 
                req.checkCashedDate && 
                ((Number(req.kickbackFee) > 0 && req.kickbackPaidDate) || Number(req.kickbackFee) <= 0)
                ? 'bg-emerald-50'
                : ''
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between sm:justify-start sm:gap-3 mb-1">
                  <p className="font-medium text-gray-900 truncate">{getCompanyName(req.company_id)}</p>
                  <div className="flex items-center gap-3 sm:hidden">
                    <Hash 
                      size={15} 
                      className={req.checkReceivedDate ? 'text-yellow-500' : 'text-gray-300'} 
                    />
                    <CircleDollarSign 
                      size={15} 
                      className={req.cashDispensedDate ? 'text-green-500' : 'text-gray-300'} 
                    />
                    <Download 
                      size={15} 
                      className={req.checkCashedDate ? 'text-blue-500' : 'text-gray-300'} 
                    />
                    <ArrowLeftRight 
                      size={15} 
                      className={
                        Number(req.kickbackFee) <= 0 
                          ? 'text-red-500' 
                          : req.kickbackPaidDate 
                            ? 'text-purple-500' 
                            : 'text-gray-300'
                      } 
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-start gap-6">
                  <p className="text-sm text-gray-600">{formatDateTime(req.created_at)}</p>
                  <div className="hidden sm:flex items-center gap-3">
                    <Hash 
                      size={16} 
                      className={req.checkReceivedDate ? 'text-yellow-500' : 'text-gray-300'} 
                    />
                    <CircleDollarSign 
                      size={16} 
                      className={req.cashDispensedDate ? 'text-green-500' : 'text-gray-300'} 
                    />
                    <Download 
                      size={16} 
                      className={req.checkCashedDate ? 'text-blue-500' : 'text-gray-300'} 
                    />
                    <ArrowLeftRight 
                      size={16} 
                      className={
                        Number(req.kickbackFee) <= 0 
                          ? 'text-red-500' 
                          : req.kickbackPaidDate 
                            ? 'text-purple-500' 
                            : 'text-gray-300'
                      } 
                    />
                  </div>
                </div>
              </div>
              <div className="mt-2 sm:mt-0 sm:ml-4 sm:text-right flex sm:flex-col items-center sm:items-end justify-between">
                <p className="font-medium text-gray-900">{formatCurrency(req.requestAmount || 0)}</p>
                <p className="text-sm text-gray-600">Check #: {req.checkNumber || 'N/A'}</p>
              </div>
            </Link>
          ))}
          {getFilteredAndSortedRequests().length === 0 && (
            <div className="p-4 text-center text-gray-500">
              No requests found
            </div>
          )}
        </div>
      </div>
    </>
  )
}