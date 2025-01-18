"use client";
import React, { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { onValue, ref, set } from 'firebase/database';
import { db } from '@/lib/firebase/init';
import Loading from '@/components/Loading/Loading';
import TransactionDetails from '@/components/Transaction/TransactionDetails';
import TransactionTimeline from '@/components/Transaction/TransactionTimeline';
import TransactionNotes from '@/components/Transaction/TransactionNotes';
import TransactionDelete from '@/components/Transaction/TransactionDelete';

const Request = () => {
    const searchParams = useSearchParams()
    const transactionId = searchParams.get('id')
    const [ request, setRequest ] = useState(null)
    const [ loadingRequest, setLoadingRequest ] = useState(true)
    const [ company, setCompany ] = useState(null)
    const router = useRouter()

    useEffect(() => {
        setLoadingRequest(true)
        if (!transactionId) return

        const requestRef = ref(db, `requests/-${transactionId}`)
        const unsubscribe = onValue(requestRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val()
                setRequest(data)
            }
        })

        return () => unsubscribe()
    }, [transactionId])
        
    useEffect(() => {
        if (!request?.company_id) return
        const companyRef = ref(db, `companies/${request?.company_id}`)
        const unsubscribe = onValue(companyRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val()
                setCompany(data)
                setLoadingRequest(false)
            }
        })
        return () => unsubscribe()
    }, [request?.company_id])
    
    if(loadingRequest) return <Loading />
    
    return (
        <div className="mx-auto px-6 pb-6 pt-20">
            <div className="flex flex-row items-center justify-between gap-2 pb-2">
                <div className="flex flex-row">
                    <button
                        onClick={() => router.back()}
                        className="inline-flex items-center text-gray-600 hover:text-gray-900"
                    >
                        <ArrowLeft className="h-5 w-5 mr-2" />
                    </button>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{request?.id.slice(1)}</h1>
                </div>
            </div>
            <div className="mx-auto">
                <div className="flex flex-col lg:flex-row gap-8">
                  <TransactionDetails request={request} company={company} />
                  <TransactionTimeline request={request} />
                </div>
                <div className='mt-8'>
                  <TransactionNotes request={request} />
                </div>
                <div className='flex justify-center mt-4'>
                  <TransactionDelete request={request} />
                </div>
            </div>
        </div>
    );
};

export default Request;