"use client"
import { db } from '@/lib/firebase/init';
import { push, ref, update } from 'firebase/database';
import { useRouter } from 'next/navigation';
import { Building2, User, Percent, ArrowLeft, Plus, PlusIcon } from 'lucide-react';
import React, { useState } from 'react';
import Link from 'next/link';

export default function CompanyNew() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        companyName: '',
        contactName: '',
        multiplierPercentage: '0',
        kickbackPercentage: '0'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'multiplierPercentage' || name === 'kickbackPercentage') {
            const value = e.target.value.replace(/[^\d.]/g, '')
            const parts = value.split('.')
            let finalValue = value
            if (parts[1]?.length > 1) {
                finalValue = `${parts[0]}.${parts[1].charAt(0)}`
            }
            setFormData(prevState => ({
                ...prevState,
                [name]: finalValue
            }));
        } else {
            setFormData(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const companyDetails = {
            companyName: formData.companyName,
            contactName: formData.contactName,
            kickback: formData.kickbackPercentage ? Math.round(parseFloat(formData.kickbackPercentage) * 10) / 1000 : 0,
            multiplier: formData.multiplierPercentage ? Math.round(parseFloat(formData.multiplierPercentage) * 10) / 1000 : 0
        };
        
        const response = await push(ref(db, 'companies'), companyDetails)
        await update(ref(db, 'companies/' + response.key), {
            id: response.key
        });
        router.push('/company?id=' + response.key.slice(1));
    };

    const inputClassName = "w-full px-3 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-gray-900 bg-white placeholder-gray-400";

    return (
        <div className="mx-auto max-w-6xl px-6 pb-6 pt-20">
            <div className="flex flex-row items-center justify-between gap-2 pb-2">
                <div className="flex flex-row">
                    <button
                        onClick={() => router.back()}
                        className="inline-flex items-center text-gray-600 hover:text-gray-900"
                        >
                        <ArrowLeft className="h-5 w-5 mr-2" />
                    </button>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">New Company</h1>
                </div>

                {/* <Link
                    href="/company/new"
                    className="flex-1 sm:flex-none bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center gap-2 text-sm"
                >
                    <PlusIcon size={18} />
                    <span>New Company</span>
                </Link> */}
            </div>
                <div className="bg-white rounded-xl shadow-sm p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                <Building2 className="w-4 h-4 mr-2" />
                                Company Name
                            </label>
                            <input
                                type="text"
                                name="companyName"
                                value={formData.companyName}
                                onChange={handleChange}
                                className={inputClassName}
                                placeholder="Enter company name"
                                required
                            />
                        </div>

                        <div>
                            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                <User className="w-4 h-4 mr-2" />
                                Contact Name
                            </label>
                            <input
                                type="text"
                                name="contactName"
                                value={formData.contactName}
                                onChange={handleChange}
                                className={inputClassName}
                                placeholder="Enter contact name"
                                required
                            />
                        </div>

                        <div className="border-t border-gray-100 pt-6">
                            <div className="space-y-6">
                                <div>
                                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                        <Percent className="w-4 h-4 mr-2" />
                                        Multiplier Rate
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="multiplierPercentage"
                                            value={formData.multiplierPercentage}
                                            onChange={handleChange}
                                            className={`${inputClassName} pr-8`}
                                            placeholder="Enter rate"
                                            required
                                        />
                                        <span className="absolute right-3 top-2 text-gray-500">%</span>
                                    </div>
                                </div>

                                <div>
                                    <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                        <Percent className="w-4 h-4 mr-2" />
                                        Kickback Rate
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="kickbackPercentage"
                                            value={formData.kickbackPercentage}
                                            onChange={handleChange}
                                            className={`${inputClassName} pr-8`}
                                            placeholder="Enter rate"
                                            required
                                        />
                                        <span className="absolute right-3 top-2 text-gray-500">%</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all font-medium"
                            >
                                Create Company
                            </button>
                        </div>
                    </form>
                </div>
            </div>
    );
}