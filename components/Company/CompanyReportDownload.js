import { useState, useEffect, useRef } from 'react';
import { FileSpreadsheet, FileDown, Download } from "lucide-react";
import { format } from 'date-fns';
import * as XLSX from 'xlsx';

const CompanyReportDownload = ({ requests, company }) => {
    const [html2pdf, setHtml2pdf] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        import('html2pdf.js').then(module => {
            setHtml2pdf(() => module.default);
        });

        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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

    const formatCurrency = (value) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 2,
        }).format(value);
    };

    const handlePDFDownload = async () => {
        if (!html2pdf) return;
        setIsOpen(false);

        const totals = calculateTotals();

        const content = `
            <div style="padding: 40px; font-family: Arial, sans-serif;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="font-size: 24px; margin-bottom: 10px;">Financial Report: ${company?.companyName || 'Company'}</h1>
                    <p style="color: #666;">${(() => {
                        const dates = Object.values(requests).map(r => new Date(r.created_at));
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
                            <td style="text-align: right;">${formatCurrency(totals.requestAmount)}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px 0;">Customer Payouts</td>
                            <td style="text-align: right;">${formatCurrency(totals.customerPayout)}</td>
                        </tr>
                    </table>
                </div>

                <div style="margin-bottom: 30px;">
                    <h2 style="font-size: 18px; padding-bottom: 10px; border-bottom: 2px solid #eee;">Fees Breakdown</h2>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 10px 0;">Bank Fees</td>
                            <td style="text-align: right;">${formatCurrency(totals.bankFee)}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px 0;">Kickback Fees</td>
                            <td style="text-align: right;">${formatCurrency(totals.kickbackFee)}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px 0;">Processing Fees</td>
                            <td style="text-align: right;">${formatCurrency(totals.processingFee)}</td>
                        </tr>
                    </table>
                </div>

                <div style="margin-bottom: 30px;">
                    <h2 style="font-size: 18px; padding-bottom: 10px; border-bottom: 2px solid #eee;">Profit</h2>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 10px 0;"><strong>Total Profit</strong></td>
                            <td style="text-align: right;"><strong>${formatCurrency(totals.profit)}</strong></td>
                        </tr>
                    </table>
                </div>

                <div>
                    <h2 style="font-size: 18px; padding-bottom: 10px; border-bottom: 2px solid #eee;">Transaction Details</h2>
                    <table style="width: 100%; border-collapse: collapse;">
                        ${Object.values(requests)
                            .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
                            .map(request => `
                                <tr>
                                    <td style="padding: 10px 0;">
                                        ${format(new Date(request.created_at), 'MM/dd/yyyy')} - Check #${request.checkNumber}
                                    </td>
                                    <td style="text-align: right;">${formatCurrency(request.requestAmount)}</td>
                                </tr>
                            `).join('')}
                    </table>
                </div>

                <div style="margin-top: 50px; text-align: center; color: #666; font-size: 12px;">
                    Generated on ${format(new Date(), "MMMM dd, yyyy 'at' HH:mm:ss")}
                </div>
            </div>
        `;

        const opt = {
            margin: 1,
            filename: `${company?.companyName || 'company'}-financial-report-${format(new Date(), 'yyyy-MM-dd')}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        const element = document.createElement('div');
        element.innerHTML = content;
        html2pdf().set(opt).from(element).save();
    };

    const handleExcelDownload = () => {
        setIsOpen(false);
        const totals = calculateTotals();

        // Create summary worksheet
        const summaryData = [
            [`Financial Report: ${company?.companyName || 'Company'}`],
            [''],
            ['Financial Summary'],
            ['Total Amount Processed', totals.requestAmount],
            ['Customer Payouts', totals.customerPayout],
            [''],
            ['Fees Breakdown'],
            ['Bank Fees', totals.bankFee],
            ['Kickback Fees', totals.kickbackFee],
            ['Processing Fees', totals.processingFee],
            [''],
            ['Profit', totals.profit]
        ];

        // Create transactions worksheet
        const transactionData = [
            [`${company?.companyName || 'Company'} - Financial Report`],
            [''],
            ['Transaction Details'],
            [''],
            ['Date', 'Check Number', 'Amount', 'Customer Payout', 'Bank Fee', 'Kickback Fee', 'Processing Fee', 'Profit'],
            ...Object.values(requests)
                .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
                .map(request => [
                    format(new Date(request.created_at), 'MM/dd/yyyy'),
                    request.checkNumber,
                    request.requestAmount || 0,
                    request.customerPayout || 0,
                    request.bankFee || 0,
                    request.kickbackFee || 0,
                    request.processingFee || 0,
                    request.profit || 0
                ])
        ];

        // Create workbook
        const wb = XLSX.utils.book_new();
        
        // Add summary worksheet
        const summaryWs = XLSX.utils.aoa_to_sheet(summaryData);
        summaryWs['!cols'] = [
            { width: 45 },
            { width: 25 },
            { width: 15 },
            { width: 15 },
            { width: 15 }
        ];
        summaryWs['!rows'] = [
            { hpt: 30 },
            { hpt: 20 }
        ];
        summaryWs['A1'] = { v: `Financial Report: ${company?.companyName || 'Company'}`, s: { font: { bold: true, sz: 16 } } };
        XLSX.utils.book_append_sheet(wb, summaryWs, 'Summary');

        // Add transactions worksheet
        const transactionsWs = XLSX.utils.aoa_to_sheet(transactionData);
        transactionsWs['!cols'] = [
            { width: 20 },
            { width: 20 },
            { width: 20 },
            { width: 20 },
            { width: 20 },
            { width: 20 },
            { width: 20 },
            { width: 20 }
        ];
        transactionsWs['!rows'] = [
            { hpt: 30 },
            { hpt: 20 }
        ];
        transactionsWs['A1'] = { v: `${company?.companyName || 'Company'} - Financial Report`, s: { font: { bold: true, sz: 16 } } };
        XLSX.utils.book_append_sheet(wb, transactionsWs, 'Transactions');

        // Save workbook
        XLSX.writeFile(wb, `${company?.companyName || 'company'}-financial-report-${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 
                         rounded-lg shadow-sm hover:bg-gray-50 transition-colors duration-200
                         text-gray-700 hover:text-gray-900"
            >
                <Download className="h-5 w-5" />
                <span>Download Report</span>
            </button>

            {isOpen && (
                <div className="absolute z-10 mt-2 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                        <button
                            onClick={handlePDFDownload}
                            className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                            <FileDown className="h-4 w-4" />
                            <span>Download PDF</span>
                        </button>
                        <button
                            onClick={handleExcelDownload}
                            className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                            <FileSpreadsheet className="h-4 w-4" />
                            <span>Download Excel</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CompanyReportDownload;