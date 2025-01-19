"use client";

import { FileSpreadsheet } from "lucide-react";
import { format } from 'date-fns';
import { useState, useEffect } from 'react';

const ReportDownloadSpreadsheet = ({ filteredRequests }) => {
    const [html2pdf, setHtml2pdf] = useState(null);

    useEffect(() => {
        // Dynamically import html2pdf only on client side
        import('html2pdf.js').then(module => {
            setHtml2pdf(() => module.default);
        });
    }, []);

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

    const formatCurrency = (value) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2,
        }).format(value);
    };

    const handleDownload = async () => {
        if (!html2pdf) return;

        const totals = calculateTotals();
        const totalExpenses = totals.bankFee + totals.kickbackFee;
        const netProfit = totals.totalProcessed - totals.customerPayout - totalExpenses;

        // Create HTML content
        const content = `
            <div style="padding: 40px; font-family: Arial, sans-serif;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="font-size: 24px; margin-bottom: 10px;">Financial Report</h1>
                    <p style="color: #666;">${(() => {
                        const dates = Object.values(filteredRequests).map(r => new Date(r.created_at));
                        const startDate = new Date(Math.min(...dates));
                        const endDate = new Date(Math.max(...dates));
                        return `${format(startDate, 'MMMM dd, yyyy')} - ${format(endDate, 'MMMM dd, yyyy')}`;
                    })()}</p>
                </div>

                <div style="margin-bottom: 30px;">
                    <h2 style="font-size: 18px; padding-bottom: 10px; border-bottom: 2px solid #eee;">Financial Summary</h2>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 10px 0;">Total Amount Processed</td>
                            <td style="text-align: right;">${formatCurrency(totals.totalProcessed)}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px 0;">Customer Payouts</td>
                            <td style="text-align: right;">${formatCurrency(totals.customerPayout)}</td>
                        </tr>
                    </table>
                </div>

                <div style="margin-bottom: 30px;">
                    <h2 style="font-size: 18px; padding-bottom: 10px; border-bottom: 2px solid #eee;">Expenses Breakdown</h2>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 10px 0;">Bank Fees</td>
                            <td style="text-align: right;">${formatCurrency(totals.bankFee)}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px 0;">Kickback Fees</td>
                            <td style="text-align: right;">${formatCurrency(totals.kickbackFee)}</td>
                        </tr>
                        <tr style="border-top: 2px solid #000;">
                            <td style="padding: 10px 0;"><strong>Total Expenses</strong></td>
                            <td style="text-align: right;"><strong>${formatCurrency(totalExpenses)}</strong></td>
                        </tr>
                    </table>
                </div>

                <div style="margin-bottom: 30px;">
                    <h2 style="font-size: 18px; padding-bottom: 10px; border-bottom: 2px solid #eee;">Net Profit</h2>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr style="border-top: 2px solid #000;">
                            <td style="padding: 10px 0;"><strong>Net Profit</strong></td>
                            <td style="text-align: right;"><strong>${formatCurrency(netProfit)}</strong></td>
                        </tr>
                    </table>
                </div>

                <div>
                    <h2 style="font-size: 18px; padding-bottom: 10px; border-bottom: 2px solid #eee;">Transaction Details</h2>
                    <table style="width: 100%; border-collapse: collapse;">
                        ${Object.values(filteredRequests)
                            .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
                            .map(request => `
                                <tr>
                                    <td style="padding: 10px 0;">
                                        ${format(new Date(request.created_at), 'MM/dd/yyyy')} - Check #${request.checkNumber}
                                    </td>
                                    <td style="text-align: right;">${formatCurrency(request.checkAmount)}</td>
                                </tr>
                            `).join('')}
                    </table>
                </div>

                <div style="margin-top: 50px; text-align: center; color: #666; font-size: 12px;">
                    Generated on ${format(new Date(), "MMMM dd, yyyy 'at' HH:mm:ss")}
                </div>
            </div>
        `;

        // PDF options
        const opt = {
            margin: 1,
            filename: `financial-report-${format(new Date(), 'yyyy-MM-dd')}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        // Generate PDF
        const element = document.createElement('div');
        element.innerHTML = content;
        html2pdf().set(opt).from(element).save();
    };

    return (
        <button
            onClick={handleDownload}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 
                     rounded-lg shadow-sm hover:bg-gray-50 transition-colors duration-200
                     text-gray-700 hover:text-gray-900"
        >
            <FileSpreadsheet className="h-5 w-5" />
            <span>Download Report</span>
        </button>
    );
};

export default ReportDownloadSpreadsheet;