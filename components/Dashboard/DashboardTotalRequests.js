"use client"
import { useAuth } from '@/contexts/auth';
import { db } from '@/lib/firebase/init';
import { onValue, ref } from 'firebase/database';
import { Building2, PlusCircle, FileSpreadsheet, DollarSign, Building, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import DashboardTotalRequests from './DashboardTotalRequests';

export default function Dashboard() {
  const { user, loading } = useAuth();
  const [ request, setRequest ] = useState(null);
  const [ loadingRequest, setLoadingRequest ] = useState(true);

  useEffect(() => {
    setLoadingRequest(true);
    const requestRef = ref(db, `requests`);
    const unsubscribe = onValue(requestRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setRequest(data);
        setLoadingRequest(false);
      }
    });

    return () => unsubscribe();
  }, []);

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <DashboardTotalRequests request={request} loadingRequest={loadingRequest} />

          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="text-gray-600" size={18} />
              <h3 className="text-gray-700 text-sm font-medium">Total Processed</h3>
            </div>
            <p className="text-2xl sm:text-3xl font-semibold mt-2 text-gray-900">$0.00</p>
            <p className="text-sm text-green-600 mt-1">
              Today: $0.00
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2">
              <Building className="text-gray-600" size={18} />
              <h3 className="text-gray-700 text-sm font-medium">Profit</h3>
            </div>
            <p className="text-2xl sm:text-3xl font-semibold mt-2 text-gray-900">$0.00</p>
            <p className="text-sm text-green-600 mt-1">
              Today: $0.00
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
            {/* Example Request Item */}
            <Link 
              href="/requests/123"
              className="p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 hover:bg-gray-50 cursor-pointer"
            >
              <div>
                <p className="font-medium text-gray-900">Example Company</p>
                <p className="text-sm text-gray-600">Requested 2h ago</p>
              </div>
              <div className="sm:text-right">
                <p className="font-medium text-gray-900">$1,000.00</p>
                <p className="text-sm text-gray-600">Fee: $50.00</p>
              </div>
            </Link>
          </div>
        </div>
    </div>
  )
}