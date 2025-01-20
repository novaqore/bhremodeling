import { useState, useEffect, useRef } from 'react';
import { FileSpreadsheet, FileDown, Download } from "lucide-react";
import { format } from 'date-fns';
import * as XLSX from 'xlsx';

const ReportDownload = ({ filteredRequests }) => {
    const [html2pdf, setHtml2pdf] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        import('html2pdf.js').then(module => {
            setHtml2pdf(() => module.default);
        });

        // Close dropdown when clicking outside
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
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

    const handlePDFDownload = async () => {
        if (!html2pdf) return;
        setIsOpen(false);

        const totals = calculateTotals();
        const totalExpenses = totals.bankFee + totals.kickbackFee;
        const netProfit = totals.totalProcessed - totals.customerPayout - totalExpenses;

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

        const opt = {
            margin: 1,
            filename: `financial-report-${format(new Date(), 'yyyy-MM-dd')}.pdf`,
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
        const totalExpenses = totals.bankFee + totals.kickbackFee;
        const netProfit = totals.totalProcessed - totals.customerPayout - totalExpenses;

        // Create summary worksheet with header
        const summaryData = [
            ['Financial Report'],
            [''],
            ['Financial Summary'],
            ['Total Amount Processed', totals.totalProcessed],
            ['Customer Payouts', totals.customerPayout],
            [''],
            ['Expenses Breakdown'],
            ['Bank Fees', totals.bankFee],
            ['Kickback Fees', totals.kickbackFee],
            ['Total Expenses', totalExpenses],
            [''],
            ['Net Profit', netProfit]
        ];

        // Create transactions worksheet with header
        const transactionData = [
            ['Financial Report'],
            [''],
            ['Transaction Details'],
            [''],
            ['Date', 'Check Number', 'Amount', 'Customer Payout', 'Bank Fee', 'Kickback Fee'],
            ...Object.values(filteredRequests)
                .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
                .map(request => [
                    format(new Date(request.created_at), 'MM/dd/yyyy'),
                    request.checkNumber,
                    request.checkAmount || 0,
                    request.customerPayout || 0,
                    request.bankFee || 0,
                    request.kickbackFee || 0
                ])
        ];

        // Create workbook with US Letter size setup
        const wb = XLSX.utils.book_new();
        
        // Add summary worksheet
        const summaryWs = XLSX.utils.aoa_to_sheet(summaryData);
        
        // Set column widths to spread across standard page
        summaryWs['!cols'] = [
            { width: 45 },  // First column
            { width: 25 },  // Second column
            { width: 15 },  // Extra columns to fill width
            { width: 15 },
            { width: 15 },
            { width: 15 },
            { width: 15 }
        ];
        
        // Set specific row heights
        summaryWs['!rows'] = [
            { hpt: 30 },  // Header row height
            { hpt: 20 }   // Default row height
        ];
        
        // Apply styles to header
        summaryWs['A1'] = { v: 'Financial Report', s: { font: { bold: true, sz: 16 } } };
        
        // Fill empty columns to force full sheet width
        for (let i = 0; i < 20; i++) {
            summaryData.forEach((row, index) => {
                const cellRef = XLSX.utils.encode_cell({ r: index, c: i + 2 });
                summaryWs[cellRef] = { v: '' };
            });
        }
        
        XLSX.utils.book_append_sheet(wb, summaryWs, 'Summary');

        // Add transactions worksheet
        const transactionsWs = XLSX.utils.aoa_to_sheet(transactionData);
        
        // Set column widths to spread across standard page
        transactionsWs['!cols'] = [
            { width: 20 },  // Date
            { width: 20 },  // Check Number
            { width: 20 },  // Amount
            { width: 20 },  // Customer Payout
            { width: 20 },  // Bank Fee
            { width: 20 },  // Kickback Fee
            { width: 15 },  // Extra columns to fill width
            { width: 15 },
            { width: 15 }
        ];
        
        // Set specific row heights
        transactionsWs['!rows'] = [
            { hpt: 30 },  // Header row height
            { hpt: 20 }   // Default row height
        ];
        
        // Apply styles to header
        transactionsWs['A1'] = { v: 'Financial Report', s: { font: { bold: true, sz: 16 } } };
        
        // Fill empty columns to force full sheet width
        for (let i = 0; i < 20; i++) {
            transactionData.forEach((row, index) => {
                const cellRef = XLSX.utils.encode_cell({ r: index, c: i + 6 });
                transactionsWs[cellRef] = { v: '' };
            });
        }
        XLSX.utils.book_append_sheet(wb, transactionsWs, 'Transactions');

        // Save workbook
        XLSX.writeFile(wb, `financial-report-${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
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

export default ReportDownload;