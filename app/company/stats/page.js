"use client";

import { db } from "@/lib/firebase/init";
import { equalTo, onValue, orderByChild, query, ref } from "firebase/database";
import { ArrowLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
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

// Register chart components
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, ArcElement);

export default function CompanyStats() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const companyId = searchParams.get("id");
    const [requests, setRequests] = useState({});
    const [company, setCompany] = useState({});
    const [loadingRequest, setLoadingRequest] = useState(true);
    const [loadingCompany, setLoadingCompany] = useState(true);

    // Fetch requests based on companyId
    useEffect(() => {
        if (!companyId) {
            setLoadingRequest(false);
            return;
        }

        setLoadingRequest(true);

        const requestsRef = query(
            ref(db, "requests"),
            orderByChild("company_id"),
            equalTo(`-${companyId}`)
        );

        const unsubscribe = onValue(requestsRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                console.log("Requests:", data);
                setRequests(data);
            } else {
                console.log("No requests found.");
                setRequests({});
            }
            setLoadingRequest(false);
        });

        return () => unsubscribe();
    }, [companyId]);

    // Fetch company data
    useEffect(() => {
        if (!companyId) return;
        setLoadingCompany(true);
        const companyRef = ref(db, `companies/-${companyId}`);
        const unsubscribe = onValue(companyRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                console.log(company)
                setCompany(data);
                setLoadingCompany(false);
            }
        });
        return () => unsubscribe();
    }, [companyId]);

    // Calculate totals from requests data
    const calculateTotals = () => {
        return Object.values(requests).reduce(
            (acc, request) => {
                acc.bankFee += Number(request.bankFee || 0);
                acc.kickbackFee += Number(request.kickbackFee || 0);
                acc.processingFee += Number(request.processingFee || 0);
                acc.profit += Number(request.profit || 0);
                acc.requestAmount += Number(request.requestAmount || 0);
                acc.customerPayout += Number(request.customerPayout || 0);
                return acc;
            },
            {
                bankFee: 0,
                kickbackFee: 0,
                processingFee: 0,
                profit: 0,
                requestAmount: 0,
                customerPayout: 0,
            }
        );
    };

    const totals = calculateTotals();

    // Format numbers as currency
    const formatCurrency = (value) =>
        new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(value);

    // Bar Chart Data
    const barChartData = {
        labels: ["Bank Fee", "Kickback Fee", "Processing Fee", "Profit", "Request Amount"],
        datasets: [
            {
                label: "Totals in $",
                data: [
                    totals.bankFee,
                    totals.kickbackFee,
                    totals.processingFee,
                    totals.profit,
                    totals.requestAmount,
                ],
                backgroundColor: [
                    "rgba(255, 99, 132, 0.2)",
                    "rgba(54, 162, 235, 0.2)",
                    "rgba(255, 206, 86, 0.2)",
                    "rgba(75, 192, 192, 0.2)",
                    "rgba(153, 102, 255, 0.2)",
                ],
                borderColor: [
                    "rgba(255, 99, 132, 1)",
                    "rgba(54, 162, 235, 1)",
                    "rgba(255, 206, 86, 1)",
                    "rgba(75, 192, 192, 1)",
                    "rgba(153, 102, 255, 1)",
                ],
                borderWidth: 1,
            },
        ],
    };

    // Pie Chart Data
    const pieChartData = {
        labels: ["Bank Fee", "Kickback Fee", "Processing Fee", "Profit"],
        datasets: [
            {
                data: [
                    totals.bankFee,
                    totals.kickbackFee,
                    totals.processingFee,
                    totals.profit,
                ],
                backgroundColor: [
                    "rgba(255, 99, 132, 0.6)",
                    "rgba(54, 162, 235, 0.6)",
                    "rgba(255, 206, 86, 0.6)",
                    "rgba(75, 192, 192, 0.6)",
                ],
                hoverBackgroundColor: [
                    "rgba(255, 99, 132, 0.8)",
                    "rgba(54, 162, 235, 0.8)",
                    "rgba(255, 206, 86, 0.8)",
                    "rgba(75, 192, 192, 0.8)",
                ],
            },
        ],
    };

    return (
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pb-6 pt-20">
            {/* Header Section */}
            <div className="flex flex-col items-start sm:flex-row sm:justify-between sm:items-center pb-6">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => router.back()}
                        className="inline-flex items-center text-gray-600 hover:text-gray-900"
                    >
                        <ArrowLeft className="h-5 w-5 mr-2" />
                    </button>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                        Financial Stats: {company?.companyName || "Company"}
                    </h1>
                </div>
            </div>

            {/* Totals Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
                {Object.entries(totals).map(([key, value]) => (
                    <div key={key} className="bg-white shadow rounded-lg p-4 text-center">
                        <h3 className="text-sm font-medium text-gray-500 capitalize">{key}</h3>
                        <p className="text-lg font-semibold text-gray-900">
                            {formatCurrency(value)}
                        </p>
                    </div>
                ))}
            </div>

            {/* Visualizations */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                <div className="bg-white shadow rounded-lg p-4">
                    <h2 className="text-lg font-semibold mb-4">Profit Breakdown</h2>
                    <Bar data={barChartData} options={{ responsive: true }} />
                </div>
                <div className="bg-white shadow rounded-lg p-4">
                    <h2 className="text-lg font-semibold mb-4">Fees Distribution</h2>
                    <Pie data={pieChartData} options={{ responsive: true }} />
                </div>
            </div>
        </div>
    );
}
