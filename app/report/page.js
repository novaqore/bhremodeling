"use client";

import { db } from "@/lib/firebase/init";
import { onValue, ref, query } from "firebase/database";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
    ArcElement,
} from "chart.js";
import { format, startOfDay, endOfDay, startOfMonth, endOfMonth, startOfYear, subDays } from 'date-fns';
import ReportDownloadSpreadsheet from "@/components/Report/ReportDownloadSpreadsheet";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, ArcElement);

export default function ReportPage() {
    const router = useRouter();
    const [requests, setRequests] = useState({});
    const [loading, setLoading] = useState(true);
    const [filterType, setFilterType] = useState("all");
    const [dateRange, setDateRange] = useState({ from: "", to: "" });
    const [filteredRequests, setFilteredRequests] = useState({});

    useEffect(() => {
        setLoading(true);
        const requestsRef = query(ref(db, "requests"));
        const unsubscribe = onValue(requestsRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                console.log("Requests:", data);
                setRequests(data);
                setFilteredRequests(data);
            } else {
                console.log("No requests found.");
                setRequests({});
                setFilteredRequests({});
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleFilterChange = (e) => {
        const type = e.target.value;
        setFilterType(type);
        filterRequests(type);
    };

    const handleDateChange = (type, value) => {
        setDateRange(prev => ({
            ...prev,
            [type]: value
        }));
        
        if (filterType === 'custom' && dateRange.from && dateRange.to) {
            filterRequests('custom');
        }
    };

    // Filter requests based on date range
    const filterRequests = (type) => {
        const now = new Date();
        let startDate, endDate;

        switch (type) {
            case "today":
                startDate = startOfDay(now);
                endDate = endOfDay(now);
                break;
            case "yesterday":
                startDate = startOfDay(subDays(now, 1));
                endDate = endOfDay(subDays(now, 1));
                break;
            case "last7days":
                startDate = startOfDay(subDays(now, 6));
                endDate = endOfDay(now);
                break;
            case "last30days":
                startDate = startOfDay(subDays(now, 29));
                endDate = endOfDay(now);
                break;
            case "thisMonth":
                startDate = startOfMonth(now);
                endDate = endOfMonth(now);
                break;
            case "yearToDate":
                startDate = startOfYear(now);
                endDate = endOfDay(now);
                break;
            case "custom":
                if (dateRange.from && dateRange.to) {
                    startDate = startOfDay(new Date(dateRange.from));
                    endDate = endOfDay(new Date(dateRange.to));
                }
                break;
            default:
                setFilteredRequests(requests);
                return;
        }

        if (startDate && endDate) {
            const filtered = Object.entries(requests).reduce((acc, [key, value]) => {
                const requestDate = new Date(value.created_at);
                if (requestDate >= startDate && requestDate <= endDate) {
                    acc[key] = value;
                }
                return acc;
            }, {});
            setFilteredRequests(filtered);
        }
    };

    const calculateTotals = () => {
        return Object.values(filteredRequests).reduce(
            (acc, request) => {
                acc.totalProcessed += Number(request.checkAmount || 0);
                acc.customerPayout += Number(request.customerPayout || 0);
                acc.bankFee += Number(request.bankFee || 0);
                acc.kickbackFee += Number(request.kickbackFee || 0);
                return acc;
            },
            {
                totalProcessed: 0,
                customerPayout: 0,
                bankFee: 0,
                kickbackFee: 0,
            }
        );
    };

    const totals = calculateTotals();
    const totalExpenses = totals.bankFee + totals.kickbackFee;
    const netProfit = totals.totalProcessed - totals.customerPayout - totalExpenses;

    const formatCurrency = (value) =>
        new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(value);

    // Bar Chart Data
    const barChartData = {
        labels: ["Total Processed", "Customer Payout", "Expenses", "Net Profit"],
        datasets: [
            {
                label: "Amount in $",
                data: [
                    totals.totalProcessed,
                    totals.customerPayout,
                    totalExpenses,
                    netProfit,
                ],
                backgroundColor: [
                    "rgba(75, 192, 192, 0.6)",
                    "rgba(255, 99, 132, 0.6)",
                    "rgba(255, 206, 86, 0.6)",
                    "rgba(153, 102, 255, 0.6)",
                ],
                borderColor: [
                    "rgba(75, 192, 192, 1)",
                    "rgba(255, 99, 132, 1)",
                    "rgba(255, 206, 86, 1)",
                    "rgba(153, 102, 255, 1)",
                ],
                borderWidth: 1,
            },
        ],
    };

    // Pie Chart Data
    const pieChartData = {
        labels: ["Bank Fee", "Kickback Fee"],
        datasets: [
            {
                data: [totals.bankFee, totals.kickbackFee],
                backgroundColor: [
                    "rgba(255, 99, 132, 0.6)",
                    "rgba(54, 162, 235, 0.6)",
                ],
                hoverBackgroundColor: [
                    "rgba(255, 99, 132, 0.8)",
                    "rgba(54, 162, 235, 0.8)",
                ],
            },
        ],
    };

    const summaryDetails = [
        { label: "Total Amount Processed", amount: totals.totalProcessed, colorClass: "text-green-600" },
        { label: "Customer Payout", amount: totals.customerPayout, colorClass: "text-red-600" },
        { label: "Total Expenses", amount: totalExpenses, colorClass: "text-yellow-600" },
        { label: "Net Profit", amount: netProfit, colorClass: "text-blue-600" },
    ];

    const feeDetails = [
        { label: "Bank Fee", amount: totals.bankFee },
        { label: "Kickback Fee", amount: totals.kickbackFee },
    ];

    return (
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-6 pt-20">
            {/* Header Section - Kept exactly as requested */}
            <div className="flex flex-col items-start sm:flex-row sm:justify-between sm:items-center pb-6">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => router.back()}
                        className="inline-flex items-center text-gray-600 hover:text-gray-900"
                    >
                        <ArrowLeft className="h-5 w-5 mr-2" />
                    </button>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                        Financial Report
                    </h1>
                </div>
                <div className="mt-4 sm:mt-0">
                    <ReportDownloadSpreadsheet filteredRequests={filteredRequests} />
                </div>

            </div>

            {/* Main Content */}
            <div className="space-y-6">
                {/* Quick Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {summaryDetails.map((item, index) => (
                        <div key={index} 
                             className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 transition-all hover:shadow-md">
                            <h3 className="text-sm font-medium text-gray-500">{item.label}</h3>
                            <p className={`text-2xl font-bold mt-2 ${item.colorClass}`}>
                                {formatCurrency(item.amount)}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Filters Panel */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-900">Date Range</h2>
                        <p className="text-sm text-gray-500 mt-1">Select a time period to analyze</p>
                    </div>
                    <div className="p-6 bg-gray-50">
                        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                            <div className="flex-1">
                                <select
                                    value={filterType}
                                    onChange={handleFilterChange}
                                    className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg 
                                             text-gray-900 text-sm focus:ring-2 focus:ring-blue-500 
                                             focus:border-transparent transition-all cursor-pointer hover:border-gray-400"
                                >
                                    <option value="all">All Time</option>
                                    <option value="today">Today</option>
                                    <option value="yesterday">Yesterday</option>
                                    <option value="last7days">Last 7 Days</option>
                                    <option value="last30days">Last 30 Days</option>
                                    <option value="thisMonth">This Month</option>
                                    <option value="yearToDate">Year to Date</option>
                                    {/* <option value="custom">Custom Range</option> */}
                                </select>
                            </div>

                            {filterType === "custom" && (
                                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                                    <div className="flex-1 sm:flex-initial">
                                        <label htmlFor="start-date" className="block text-xs text-gray-500 mb-1">
                                            Start Date
                                        </label>
                                        <input
                                            type="date"
                                            id="start-date"
                                            value={dateRange.from}
                                            onChange={(e) => handleDateChange('from', e.target.value)}
                                            className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg 
                                                     text-gray-900 text-sm focus:ring-2 focus:ring-blue-500 
                                                     focus:border-transparent transition-all"
                                        />
                                    </div>
                                    <div className="flex-1 sm:flex-initial">
                                        <label htmlFor="end-date" className="block text-xs text-gray-500 mb-1">
                                            End Date
                                        </label>
                                        <input
                                            type="date"
                                            id="end-date"
                                            value={dateRange.to}
                                            onChange={(e) => handleDateChange('to', e.target.value)}
                                            className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg 
                                                     text-gray-900 text-sm focus:ring-2 focus:ring-blue-500 
                                                     focus:border-transparent transition-all"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Financial Overview Chart */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">Financial Overview</h2>
                                <p className="text-sm text-gray-500 mt-1">Breakdown of key metrics</p>
                            </div>
                        </div>
                        <div className="h-[300px]">
                            <Bar data={barChartData} 
                                 options={{ 
                                     responsive: true,
                                     maintainAspectRatio: false,
                                     plugins: {
                                         legend: {
                                             display: false
                                         }
                                     }
                                 }} />
                        </div>
                    </div>

                    {/* Fee Distribution Chart */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">Fee Distribution</h2>
                                <p className="text-sm text-gray-500 mt-1">Breakdown of fees</p>
                            </div>
                        </div>
                        <div className="h-[300px] flex items-center justify-center">
                            <div className="w-[80%]">
                                <Pie data={pieChartData} 
                                     options={{ 
                                         responsive: true,
                                         maintainAspectRatio: false
                                     }} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Detailed Fee Breakdown */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-900">Fee Details</h2>
                        <p className="text-sm text-gray-500 mt-1">Breakdown of individual fees</p>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {feeDetails.map((fee, index) => (
                                <div key={index} 
                                     className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-sm font-medium text-gray-600">{fee.label}</h4>
                                        <p className="text-lg font-semibold text-gray-900">
                                            {formatCurrency(fee.amount)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}