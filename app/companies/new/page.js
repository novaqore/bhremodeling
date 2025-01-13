"use client"
import { db } from '@/lib/firebase/init';
import { push, ref, set, update } from 'firebase/database';
import { useRouter } from 'next/navigation';
import { Building2, User, Percent, ArrowLeft } from 'lucide-react';
import React, { useState } from 'react';

export default function CompanyNew() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        companyName: '',
        contactName: '',
        multiplierPercentage: '',
        kickbackPercentage: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'multiplierPercentage' || name === 'kickbackPercentage') {
            // Remove non-numeric characters
            const numericValue = value.replace(/[^0-9]/g, '');
            const number = numericValue === '' ? '' : parseInt(numericValue);
            if (number <= 100) {
                setFormData(prevState => ({
                    ...prevState,
                    [name]: number
                }));
            }
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
            kickback: parseFloat(formData.kickbackPercentage) / 100,
            multiplier: parseFloat(formData.multiplierPercentage) / 100
        };
        
        const response = await push(ref(db, 'companies'), companyDetails)
        update(ref(db, 'companies/' + response.key), {
            id: response.key
        });
        router.push('/companies/' + response.key);
    };

    const inputClassNames = "w-full px-4 py-3 rounded-lg border border-gray-200 bg-white text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"

    return (
        <div>
            <div className="max-w-5xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <button 
                        onClick={() => router.back()}
                        className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
                    >
                        <ArrowLeft size={20} className="mr-2" />
                        Back to Dashboard
                    </button>
                    
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        Create New Company
                    </h1>
                    <p className="text-gray-600">Enter the company details below</p>
                </div>

                {/* Main Form */}
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Company Information */}
                        <div className="bg-white rounded-2xl p-8">
                            <h2 className="text-xl font-semibold text-gray-900 mb-6">Company Information</h2>
                            
                            <div className="space-y-6">
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
                                        className={inputClassNames}
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
                                        className={inputClassNames}
                                        placeholder="Enter contact name"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Rates Information */}
                        <div className="bg-white rounded-2xl p-8">
                            <h2 className="text-xl font-semibold text-gray-900 mb-6">Rate Information</h2>
                            
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
                                            className={inputClassNames}
                                            placeholder="Enter rate (0-100)"
                                            required
                                        />
                                        <span className="absolute right-4 top-3 text-gray-500">%</span>
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
                                            className={inputClassNames}
                                            placeholder="Enter rate (0-100)"
                                            required
                                        />
                                        <span className="absolute right-4 top-3 text-gray-500">%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="mt-8">
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white px-6 py-4 rounded-full hover:bg-blue-700 transition-all font-medium flex items-center justify-center text-lg"
                        >
                            Create Company
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}