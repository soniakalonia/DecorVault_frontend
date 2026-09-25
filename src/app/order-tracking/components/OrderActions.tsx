// 'use client';

// import { useState, useEffect } from 'react';
// import Icon from '@/components/ui/AppIcon';
// import FileUpload from '@/components/ui/FileUpload';

// interface OrderActionsProps {
//   orderId: string;
//   canCancel: boolean;
//   canReturn: boolean;
//   invoiceUrl: string;
//   orderTotal?: number | string;
//   paymentMethod?: string;
//   orderStatus?: string;
// }

// // Company Details
// const COMPANY_DETAILS = {
//   name: 'DECOR VAULT',
  
//   address: 'H No. 9/149, Shyam Block, Kailash Nagar, Gandhi Nagar, New Delhi - 110031',
//   email: 'support@decorvault.online',
//   phone: '++91 95827 91995',
//   gstin: '27AABCZ1234D1ZP',
//   cin: 'U74999MH2020PTC345678',
//   logoUrl: '/assets/images/logo.png',
// };

// // Cancel Reasons
// const CANCEL_REASONS = [
//   { id: 'changed_mind', label: 'Changed my mind', icon: '🔄' },
//   { id: 'found_cheaper', label: 'Found cheaper elsewhere', icon: '💰' },
//   { id: 'delivery_time', label: 'Delivery time is too long', icon: '⏰' },
//   { id: 'wrong_address', label: 'Wrong address entered', icon: '📍' },
//   { id: 'duplicate_order', label: 'Duplicate order', icon: '📋' },
//   { id: 'payment_issue', label: 'Payment issue', icon: '💳' },
//   { id: 'other', label: 'Other reason', icon: '📝' },
// ];

// // Report Issue Reasons
// const REPORT_REASONS = [
//   { id: 'damaged', label: 'Product is damaged', icon: '💔' },
//   { id: 'wrong_item', label: 'Wrong item received', icon: '📦' },
//   { id: 'missing_items', label: 'Missing items', icon: '❓' },
//   { id: 'delayed_delivery', label: 'Delayed delivery', icon: '🚚' },
//   { id: 'quality_issue', label: 'Quality issue', icon: '⭐' },
//   { id: 'size_issue', label: 'Size/Fit issue', icon: '📐' },
//   { id: 'other', label: 'Other issue', icon: '📝' },
// ];

// const OrderActions = ({
//   orderId,
//   canCancel,
//   canReturn,
//   orderTotal = 0,
//   paymentMethod = 'UPI',
//   orderStatus = 'pending'
// }: OrderActionsProps) => {
//   const [isHydrated, setIsHydrated] = useState(false);
//   const [isGeneratingInvoice, setIsGeneratingInvoice] = useState(false);

//   // Cancel Order State
//   const [showCancelModal, setShowCancelModal] = useState(false);
//   const [cancelReason, setCancelReason] = useState('');
//   const [cancelNote, setCancelNote] = useState('');
//   const [isCancelling, setIsCancelling] = useState(false);

//   // Report Issue State
//   const [showReportModal, setShowReportModal] = useState(false);
//   const [reportReason, setReportReason] = useState('');
//   const [reportDescription, setReportDescription] = useState('');
//   const [reportFile, setReportFile] = useState<File | null>(null);
//   const [isSubmittingReport, setIsSubmittingReport] = useState(false);

//   // Show success/confirmation messages
//   const [showSuccessMessage, setShowSuccessMessage] = useState<{ type: 'cancel' | 'report'; message: string } | null>(null);

//   const totalAmount = typeof orderTotal === 'string' ? parseFloat(orderTotal) : Number(orderTotal) || 0;

//   useEffect(() => {
//     setIsHydrated(true);
//   }, []);

//   useEffect(() => {
//     if (!showSuccessMessage) return;

//     const timer = setTimeout(() => {
//       setShowSuccessMessage(null);
//     }, 5000);
//     return () => clearTimeout(timer);
//   }, [showSuccessMessage]);

//   // ===================== INVOICE FUNCTIONS =====================

//   const getBaseUrl = () => {
//     if (process.env.NODE_ENV === 'production') {
//       return process.env.NEXT_PUBLIC_APP_URL || 'https://yourdomain.com';
//     }
//     if (process.env.NEXT_PUBLIC_NGROK_URL) {
//       return process.env.NEXT_PUBLIC_NGROK_URL;
//     }
//     return window.location.origin || 'http://localhost:4029';
//   };

//   const getAmountInWords = (amount: number): string => {
//     if (amount === 0) return 'Zero';

//     const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
//       'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
//       'Seventeen', 'Eighteen', 'Nineteen'];
//     const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

//     const numToWords = (n: number): string => {
//       if (n < 20) return ones[n];
//       if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
//       if (n < 1000) return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + numToWords(n % 100) : '');
//       if (n < 100000) return numToWords(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 ? ' ' + numToWords(n % 1000) : '');
//       if (n < 10000000) return numToWords(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 ? ' ' + numToWords(n % 100000) : '');
//       return numToWords(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 ? ' ' + numToWords(n % 10000000) : '');
//     };

//     const rupees = Math.floor(amount);
//     const paise = Math.round((amount - rupees) * 100);

//     let words = numToWords(rupees) + ' Rupees';
//     if (paise > 0) {
//       words += ' and ' + numToWords(paise) + ' Paise';
//     }
//     return words + ' Only';
//   };

//   const handleDownloadInvoice = async () => {
//     if (!isHydrated || isGeneratingInvoice) return;

//     setIsGeneratingInvoice(true);
//     const orderIdNum = orderId.replace('ORD', '');
//     const token = localStorage.getItem('auth_token');
//     const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

//     try {
//       const response = await fetch(`${API_URL}/orders/${orderIdNum}/invoice`, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();

//       if (data.success && data.invoice) {
//         generateInvoiceHTML(data.invoice, orderIdNum);
//       } else {
//         throw new Error('Invalid invoice data received');
//       }
//     } catch (error) {
//       console.error('Invoice generation error:', error);
//       alert('Failed to generate invoice. Please try again or contact support.');
//     } finally {
//       setIsGeneratingInvoice(false);
//     }
//   };

//   const generateInvoiceHTML = (invoice: any, orderIdNum: string) => {
//     const printWindow = window.open('', '_blank');
//     if (!printWindow) {
//       alert('Please allow pop-ups to view the invoice.');
//       return;
//     }

//     const rupee = '&#8377;';
//     const formatCurrency = (value: number) => (Number.isFinite(value) ? value.toFixed(2) : '0.00');
//     const safe = (value: any) => (value === null || value === undefined ? '' : String(value));

//     const address = invoice.address || {};
//     const addressLine1 = address.addressLine1 || address.address_line1 || '';
//     const addressLine2 = address.addressLine2 || address.address_line2 || '';
//     const city = address.city || '';
//     const state = address.state || '';
//     const pincode = address.pincode || '';

//     const addressPrimary = [addressLine1, addressLine2].filter(Boolean).join(', ');
//     const addressSecondary = [city, state].filter(Boolean).join(', ');
//     const addressFull = [addressPrimary, addressSecondary].filter(Boolean).join(', ');
//     const addressWithPin = addressFull ? `${addressFull}${pincode ? ` - ${pincode}` : ''}` : (pincode || 'N/A');

//     const items = Array.isArray(invoice.items) ? invoice.items : [];
//     const subtotal = Number(invoice.subtotal || 0);
//     const gst = Number(invoice.gst || 0);
//     const deliveryCharges = Number(invoice.deliveryCharges || 0);
//     const discount = Number(invoice.discount || 0);
//     const total = Number(invoice.total || 0);
//     const orderDate = invoice.orderDate || new Date().toLocaleDateString('en-GB');

//     const baseUrl = getBaseUrl();
//     const invoiceUrl = `${baseUrl}/order-tracking?orderId=${orderIdNum}`;
//     const qrData = encodeURIComponent(invoiceUrl);

//     const fallbackRow = '<tr><td class="table-cell" colspan="4" style="text-align:center;">No items found</td></tr>';
//     const itemRows = items.length > 0 ? items.map((item: any, index: number) => {
//       const qty = Number(item.quantity || 0);
//       const price = Number(item.price || 0);
//       const lineTotal = Number(item.total || qty * price || 0);
//       return `
//         <tr>
//           <td class="table-cell">
//             <div class="item-name">${safe(item.name) || 'Product'}</div>
//           </td>
//           <td class="table-cell" style="text-align:center;">${qty}</td>
//           <td class="table-cell" style="text-align:right;">${rupee}${formatCurrency(price)}</td>
//           <td class="table-cell" style="text-align:right;">${rupee}${formatCurrency(lineTotal)}</td>
//         </tr>
//       `;
//     }).join('') : fallbackRow;

//     const htmlContent = `
//       <!DOCTYPE html>
//       <html>
//         <head>
//           <meta charset="UTF-8" />
//           <title>Invoice - ${safe(invoice.orderNumber)}</title>
//           <style>
//             * { box-sizing: border-box; margin: 0; padding: 0; }
//             body { font-family: Arial, Helvetica, sans-serif; font-size: 12px; line-height: 1.4; margin: 0; background: #f0f0f0; color: #1a1a1a; }
//             .toolbar { display: flex; justify-content: flex-end; gap: 10px; padding: 12px 20px; background: #fff; border-bottom: 1px solid #ddd; position: sticky; top: 0; z-index: 100; }
//             .btn { padding: 8px 16px; border: 1px solid #333; background: #fff; cursor: pointer; font-size: 12px; border-radius: 4px; transition: all 0.2s; }
//             .btn:hover { background: #f5f5f5; }
//             .btn.primary { background: #1a1a2e; color: #fff; }
//             .btn.primary:hover { background: #333; }
//             .page { width: 210mm; min-height: 297mm; margin: 20px auto; background: #fff; border: 1px solid #ddd; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
//             .section { border-bottom: 1px solid #e8e4e0; padding: 12px 20px; }
//             .section:last-child { border-bottom: none; }
//             .invoice-header { display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; border-bottom: 3px solid #1a1a2e; background: #fafafa; }
//             .header-left { display: flex; align-items: center; gap: 16px; }
//             .company-logo { width: 70px; height: 70px; object-fit: contain; border: 1px solid #e8e4e0; padding: 4px; border-radius: 4px; }
//             .company-name { font-size: 24px; font-weight: 700; color: #1a1a2e; letter-spacing: 1px; }
//             .company-tagline { font-size: 11px; color: #666; margin-top: 2px; }
//             .header-right { text-align: right; }
//             .invoice-title { font-size: 20px; font-weight: 700; color: #1a1a2e; letter-spacing: 2px; }
//             .flex { display: flex; justify-content: space-between; align-items: flex-start; gap: 20px; }
//             .muted { color: #666; font-size: 11px; }
//             .right { text-align: right; }
//             .qr-container { display: flex; flex-direction: column; align-items: center; gap: 4px; }
//             .qr { border: 1px solid #ddd; padding: 4px; width: 72px; height: 72px; background: #fff; }
//             .qr-label { font-size: 9px; color: #666; text-align: center; }
//             .company-details { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 11px; color: #444; padding: 8px 0; }
//             .company-details-item { display: flex; gap: 4px; }
//             .company-details-item strong { font-weight: 600; color: #1a1a2e; min-width: 60px; }
//             .address-grid { display: grid; grid-template-columns: 1fr 1fr; border-top: 1px solid #e8e4e0; }
//             .address-block { padding: 12px 20px; border-right: 1px solid #e8e4e0; }
//             .address-block:last-child { border-right: none; }
//             .address-title { font-weight: 700; margin-bottom: 6px; font-size: 13px; color: #1a1a2e; }
//             table { width: 100%; border-collapse: collapse; }
//             th, td { border: 1px solid #ddd; padding: 8px 10px; vertical-align: middle; }
//             th { background: #f5f5f5; text-align: left; font-weight: 600; font-size: 11px; color: #1a1a2e; }
//             .table-cell { font-size: 11px; }
//             .text-right { text-align: right; }
//             .text-center { text-align: center; }
//             .item-name { font-weight: 600; color: #1a1a2e; }
//             .summary { max-width: 320px; margin-left: auto; padding: 4px 0; }
//             .summary-row { display: flex; justify-content: space-between; padding: 5px 0; font-size: 12px; }
//             .summary-row.total { font-weight: 700; border-top: 2px solid #1a1a2e; padding-top: 8px; margin-top: 5px; font-size: 14px; color: #1a1a2e; }
//             .footer { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; font-size: 11px; }
//             .signature { text-align: right; }
//             .signature-line { border-top: 1px solid #1a1a2e; margin-top: 30px; padding-top: 4px; font-weight: 600; }
//             .thank-you { text-align: center; font-size: 14px; font-weight: 600; color: #1a1a2e; padding: 12px 0 4px 0; letter-spacing: 1px; }
//             .bill-header { text-align: center; font-size: 16px; font-weight: 700; color: #1a1a2e; padding: 8px 0; border-bottom: 2px dashed #1a1a2e; margin-bottom: 12px; }
//             .bill-footer { text-align: center; font-size: 10px; color: #666; padding-top: 8px; border-top: 2px dashed #1a1a2e; margin-top: 12px; }
//             @media print { body { background: #fff; } .toolbar { display: none; } .page { margin: 0; border: none; width: auto; min-height: auto; box-shadow: none; } }
//           </style>
//         </head>
//         <body>
//           <div class="toolbar">
//             <button class="btn" onclick="window.close()">Close</button>
//             <button class="btn primary" onclick="window.print()">Print / Download</button>
//           </div>
//           <div class="page">
//             <div class="invoice-header">
//               <div class="header-left">
//                 <img class="company-logo" src="${COMPANY_DETAILS.logoUrl}" alt="${COMPANY_DETAILS.name}" onerror="this.style.display='none'" />
//                 <div>
//                   <div class="company-name">${COMPANY_DETAILS.name}</div>
//                   <div class="company-tagline">Premium Home Decor & Furniture</div>
//                 </div>
//               </div>
//               <div class="header-right">
//                 <div class="invoice-title">TAX INVOICE</div>
//                 <div style="font-size:10px;color:#666;margin-top:4px;">GST Invoice</div>
//               </div>
//             </div>
//             <div class="section" style="background:#fafafa;border-bottom:2px solid #e8e4e0;">
//               <div class="company-details">
//                 <div class="company-details-item"><strong>Address:</strong><span>${COMPANY_DETAILS.address}</span></div>
//                 <div class="company-details-item"><strong>Email:</strong><span>${COMPANY_DETAILS.email}</span></div>
//                 <div class="company-details-item"><strong>Phone:</strong><span>${COMPANY_DETAILS.phone}</span></div>
//                 <div class="company-details-item"><strong>GSTIN:</strong><span>${COMPANY_DETAILS.gstin}</span></div>
//               </div>
//             </div>
//             <div class="section flex">
//               <div>
//                 <div><strong>Order Number:</strong> ${safe(invoice.orderNumber)}</div>
//                 <div><strong>Order Date:</strong> ${orderDate}</div>
//                 <div><strong>Payment Method:</strong> ${safe(invoice.paymentMethod) || 'N/A'}</div>
//                 <div><strong>Order Status:</strong> ${safe(invoice.status) || 'N/A'}</div>
//                 <div style="margin-top:4px;font-size:10px;color:#666;"><strong>Invoice Date:</strong> ${orderDate}</div>
//               </div>
//               <div class="right qr-container">
//                 <img class="qr" src="https://api.qrserver.com/v1/create-qr-code/?size=72x72&data=${qrData}" alt="Invoice QR Code" />
//                 <div class="qr-label">Scan to view bill</div>
//               </div>
//             </div>
//             <div class="address-grid">
//               <div class="address-block">
//                 <div class="address-title">Billed To</div>
//                 <div>${safe(invoice.customerName) || 'Customer'}</div>
//                 <div class="muted">${addressWithPin}</div>
//                 <div class="muted">Email: ${safe(invoice.customerEmail) || 'N/A'}</div>
//                 <div class="muted">Phone: ${safe(invoice.customerPhone) || 'N/A'}</div>
//               </div>
//               <div class="address-block">
//                 <div class="address-title">Shipped To</div>
//                 <div>${safe(invoice.customerName) || 'Customer'}</div>
//                 <div class="muted">${addressWithPin}</div>
//                 <div class="muted">Phone: ${safe(invoice.customerPhone) || 'N/A'}</div>
//               </div>
//             </div>
//             <div class="section" style="padding: 0;">
//               <div class="bill-header">ORDER ITEMS</div>
//               <table>
//                 <thead>
//                   <tr>
//                     <th style="width:45%;">Item</th>
//                     <th style="width:15%;text-align:center;">Qty</th>
//                     <th style="width:20%;text-align:right;">Price</th>
//                     <th style="width:20%;text-align:right;">Total</th>
//                   </tr>
//                 </thead>
//                 <tbody>${itemRows}</tbody>
//               </table>
//               <div class="bill-footer">Thank you for your purchase!</div>
//             </div>
//             <div class="section">
//               <div class="summary">
//                 <div class="summary-row"><span>Subtotal</span><span>${rupee}${formatCurrency(subtotal)}</span></div>
//                 <div class="summary-row"><span>GST (18%)</span><span>${rupee}${formatCurrency(gst)}</span></div>
//                 <div class="summary-row"><span>Delivery Charges</span><span>${rupee}${formatCurrency(deliveryCharges)}</span></div>
//                 ${discount > 0 ? `<div class="summary-row"><span>Discount</span><span>-${rupee}${formatCurrency(discount)}</span></div>` : ''}
//                 <div class="summary-row total"><span>Grand Total</span><span>${rupee}${formatCurrency(total)}</span></div>
//               </div>
//               <div style="text-align:right;margin-top:8px;font-size:10px;color:#666;">
//                 Amount in Words: ${getAmountInWords(total)}
//               </div>
//             </div>
//             <div class="section footer">
//               <div>
//                 <div><strong>Returns Policy:</strong> Returns accepted within 7 days of delivery with original packaging and invoice.</div>
//                 <div class="muted" style="margin-top:4px;">For warranty and support, please retain this invoice.</div>
//               </div>
//               <div class="signature">
//                 <div><strong>FOR ${COMPANY_DETAILS.name}</strong></div>
//                 <div class="signature-line">Authorized Signatory</div>
//               </div>
//             </div>
//             <div class="section" style="border-bottom: none;">
//               <div class="thank-you">Thank you for shopping with ${COMPANY_DETAILS.name}!</div>
//               <div style="text-align:center;font-size:10px;color:#999;margin-top:4px;">
//                 This is a system generated invoice and does not require a physical signature.
//               </div>
//             </div>
//           </div>
//         </body>
//       </html>
//     `;

//     printWindow.document.write(htmlContent);
//     printWindow.document.close();
//   };

//   // ===================== CANCEL ORDER FUNCTIONS =====================

//   const handleCancelOrder = () => {
//     if (!isHydrated) return;
//     setShowCancelModal(true);
//   };

//   const handleCancelOrderSubmit = async () => {
//     if (!cancelReason) {
//       alert('Please select a reason for cancellation');
//       return;
//     }

//     setIsCancelling(true);

//     try {
//       const token = localStorage.getItem('auth_token');
//       const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
//       const orderIdNum = orderId.replace('ORD', '');

//       const response = await fetch(`${API_URL}/orders/${orderIdNum}/cancel`, {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//           reason: cancelReason,
//           note: cancelNote
//         })
//       });

//       const data = await response.json();

//       if (response.ok && data.success) {
//         setShowCancelModal(false);
//         setCancelReason('');
//         setCancelNote('');

//         const refundMessage = data.refundInitiated
//           ? 'Refund will be initiated within 3-5 business days and credited to your original payment method.'
//           : 'No refund needed as this was a COD order.';

//         setShowSuccessMessage({
//           type: 'cancel',
//           message: `Order cancelled successfully! ${refundMessage}`
//         });

//         setTimeout(() => {
//           window.location.reload();
//         }, 3000);
//       } else {
//         throw new Error(data.message || 'Failed to cancel order');
//       }
//     } catch (error: any) {
//       console.error('❌ Cancel error:', error);
//       alert(error.message || 'Failed to cancel order. Please try again or contact support.');
//     } finally {
//       setIsCancelling(false);
//     }
//   };

//   // ===================== REPORT ISSUE FUNCTIONS =====================

//   const handleReportIssue = () => {
//     if (!isHydrated) return;
//     setShowReportModal(true);
//   };

//   const handleReportSubmit = async () => {
//     if (!reportReason) {
//       alert('Please select the type of issue');
//       return;
//     }
//     if (!reportDescription || reportDescription.length < 10) {
//       alert('Please provide a detailed description (minimum 10 characters)');
//       return;
//     }

//     setIsSubmittingReport(true);

//     try {
//       const token = localStorage.getItem('auth_token');
//       const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
//       const orderIdNum = orderId.replace('ORD', '');

//       const formData = new FormData();
//       formData.append('reason', reportReason);
//       formData.append('description', reportDescription);
//       if (reportFile) {
//         formData.append('file', reportFile);
//       }

//       const response = await fetch(`${API_URL}/orders/${orderIdNum}/report`, {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${token}`,
//         },
//         body: formData
//       });

//       const data = await response.json();

//       if (response.ok && data.success) {
//         setShowReportModal(false);
//         setReportReason('');
//         setReportDescription('');
//         setReportFile(null);

//         setShowSuccessMessage({
//           type: 'report',
//           message: 'Issue reported successfully! Our support team will contact you within 24 hours.'
//         });
//       } else {
//         throw new Error(data.message || 'Failed to report issue');
//       }
//     } catch (error: any) {
//       console.error('❌ Report error:', error);
//       alert(error.message || 'Failed to submit report. Please try again or contact support.');
//     } finally {
//       setIsSubmittingReport(false);
//     }
//   };

//   // ===================== RETURN FUNCTIONS =====================

//   const handleInitiateReturn = () => {
//     if (!isHydrated) return;
//     alert('Return process initiated. Our team will contact you within 24 hours.');
//   };

//   // ===================== RENDER =====================

//   if (!isHydrated) {
//     return (
//       <div className="rounded-lg bg-card p-6 shadow-elevation-2">
//         <h2 className="mb-4 font-heading text-xl font-semibold text-foreground">Order Actions</h2>
//         <div className="grid gap-3 sm:grid-cols-2">
//           <button className="flex items-center justify-center space-x-2 rounded-md bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-smooth" disabled>
//             <Icon name="DocumentArrowDownIcon" size={18} />
//             <span>Download Invoice</span>
//           </button>
//           <button className="flex items-center justify-center space-x-2 rounded-md border border-border bg-background px-4 py-3 text-sm font-medium text-foreground transition-smooth" disabled>
//             <Icon name="ExclamationTriangleIcon" size={18} />
//             <span>Report Issue</span>
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // ✅ If order is cancelled, show cancelled state
//   if (orderStatus === 'cancelled') {
//     return (
//       <div className="rounded-lg bg-card p-6 shadow-elevation-2 border border-red-200 bg-red-50/30">
//         <div className="flex items-center gap-3">
//           <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
//             <Icon name="XCircleIcon" size={20} className="text-red-600" />
//           </div>
//           <div>
//             <h3 className="font-semibold text-red-800">Order Cancelled</h3>
//             <p className="text-sm text-red-600">This order has been cancelled</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <>
//       <div className="rounded-lg bg-card p-6 shadow-elevation-2">
//         <h2 className="mb-4 font-heading text-xl font-semibold text-foreground">Order Actions</h2>

//         <div className="grid gap-3 sm:grid-cols-2">
//           <button
//             onClick={handleDownloadInvoice}
//             disabled={isGeneratingInvoice}
//             className="flex items-center justify-center space-x-2 rounded-md bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-smooth hover:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {isGeneratingInvoice ? (
//               <><span className="animate-spin">⟳</span><span>Generating...</span></>
//             ) : (
//               <><Icon name="DocumentArrowDownIcon" size={18} /><span>Download Invoice</span></>
//             )}
//           </button>

//           <button
//             onClick={handleReportIssue}
//             className="flex items-center justify-center space-x-2 rounded-md border border-border bg-background px-4 py-3 text-sm font-medium text-foreground transition-smooth hover:bg-muted"
//           >
//             <Icon name="ExclamationTriangleIcon" size={18} />
//             <span>Report Issue</span>
//           </button>

//           {canCancel && (
//             <button
//               onClick={handleCancelOrder}
//               className="flex items-center justify-center space-x-2 rounded-md border border-red-300 bg-white px-4 py-3 text-sm font-medium text-red-600 transition-smooth hover:bg-red-50 hover:border-red-400"
//             >
//               <Icon name="XCircleIcon" size={18} />
//               <span>Cancel Order</span>
//             </button>
//           )}

//           {canReturn && (
//             <button
//               onClick={handleInitiateReturn}
//               className="flex items-center justify-center space-x-2 rounded-md border border-border bg-background px-4 py-3 text-sm font-medium text-foreground transition-smooth hover:bg-muted"
//             >
//               <Icon name="ArrowUturnLeftIcon" size={18} />
//               <span>Initiate Return</span>
//             </button>
//           )}
//         </div>

//         {showSuccessMessage && (
//           <div className={`mt-4 p-4 rounded-lg ${showSuccessMessage.type === 'cancel'
//             ? 'bg-green-50 border border-green-200'
//             : 'bg-blue-50 border border-blue-200'
//             }`}>
//             <div className="flex items-start gap-3">
//               <Icon name="CheckCircleIcon" size={20} className={showSuccessMessage.type === 'cancel' ? 'text-green-500' : 'text-blue-500'} />
//               <div>
//                 <p className={`font-medium ${showSuccessMessage.type === 'cancel' ? 'text-green-800' : 'text-blue-800'}`}>
//                   {showSuccessMessage.type === 'cancel' ? 'Order Cancelled' : 'Report Submitted'}
//                 </p>
//                 <p className="text-sm text-gray-600">{showSuccessMessage.message}</p>
//               </div>
//               <button onClick={() => setShowSuccessMessage(null)} className="ml-auto text-gray-400 hover:text-gray-600">
//                 <Icon name="XMarkIcon" size={16} />
//               </button>
//             </div>
//           </div>
//         )}

//         <div className="mt-4 rounded-md bg-muted p-4">
//           <div className="flex items-start space-x-3">
//             <Icon name="InformationCircleIcon" size={20} className="mt-0.5 flex-shrink-0 text-primary" />
//             <div>
//               <p className="text-sm font-medium text-foreground">Need Help?</p>
//               <p className="caption mt-1 text-muted-foreground">
//                 Contact our customer support team for any queries or assistance with your order.
//               </p>
//               <button className="mt-2 text-sm font-medium text-primary transition-smooth hover:underline">
//                 Contact Support
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ==================== CANCEL ORDER MODAL - CLEAN E-COMMERCE STYLE ==================== */}
//       {showCancelModal && (
//         <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
//           <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
//             {/* Modal Header */}
//             <div className="border-b px-6 py-4 flex items-center justify-between">
//               <div>
//                 <h3 className="text-lg font-semibold text-gray-900">Cancel Order</h3>
//                 <p className="text-sm text-gray-500">Order #{orderId}</p>
//               </div>
//               <button
//                 onClick={() => setShowCancelModal(false)}
//                 className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-full"
//               >
//                 <Icon name="XMarkIcon" size={24} />
//               </button>
//             </div>

//             {/* Modal Body */}
//             <div className="p-6 space-y-5">
//               {/* Order Summary Card */}
//               <div className="bg-gray-50 rounded-xl p-4 space-y-2">
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-500">Order Total</span>
//                   <span className="font-semibold text-gray-900">₹{totalAmount.toFixed(2)}</span>
//                 </div>
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-500">Payment Method</span>
//                   <span className="font-medium capitalize text-gray-700">{paymentMethod}</span>
//                 </div>
//                 {paymentMethod === 'Prepaid' && (
//                   <div className="mt-2 text-xs text-blue-600 bg-blue-50 p-2.5 rounded-lg flex items-center gap-2">
//                     <span>💳</span>
//                     <span>Refund will be credited to your original payment method</span>
//                   </div>
//                 )}
//               </div>

//               {/* Reason Selection */}
//               <div>
//                 <label className="text-sm font-medium text-gray-700 block mb-1.5">
//                   Why are you cancelling? <span className="text-red-500">*</span>
//                 </label>
//                 <select
//                   value={cancelReason}
//                   onChange={(e) => setCancelReason(e.target.value)}
//                   className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white"
//                 >
//                   <option value="">Select a reason</option>
//                   {CANCEL_REASONS.map((reason) => (
//                     <option key={reason.id} value={reason.id}>
//                       {reason.icon} {reason.label}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* Additional Note */}
//               <div>
//                 <label className="text-sm font-medium text-gray-700 block mb-1.5">
//                   Additional Note <span className="text-gray-400">(Optional)</span>
//                 </label>
//                 <textarea
//                   value={cancelNote}
//                   onChange={(e) => setCancelNote(e.target.value)}
//                   placeholder="Any additional details..."
//                   rows={2}
//                   className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none bg-white"
//                 />
//               </div>

//               {/* Refund Timeline */}
//               {paymentMethod === 'Prepaid' && (
//                 <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
//                   <div className="flex items-start gap-3">
//                     <span className="text-blue-500 text-lg">⏰</span>
//                     <div>
//                       <p className="text-sm font-medium text-blue-800">Refund Timeline</p>
//                       <ul className="text-xs text-blue-700 space-y-0.5 mt-1">
//                         <li>• Refund initiated within 3-5 business days</li>
//                         <li>• Amount credited to original payment method</li>
//                         <li>• You'll receive confirmation via email</li>
//                       </ul>
//                     </div>
//                   </div>
//                 </div>
//               )}

//               {paymentMethod === 'COD' && (
//                 <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
//                   <p className="text-sm text-gray-600 flex items-center gap-2">
//                     <span>ℹ️</span>
//                     No payment was made for this order as it's Cash on Delivery.
//                   </p>
//                 </div>
//               )}

//               {/* Warning */}
//               <div className="bg-red-50 border border-red-200 rounded-xl p-3">
//                 <p className="text-xs text-red-600 flex items-start gap-2">
//                   <span className="text-red-500 text-lg">⚠️</span>
//                   <span>This action cannot be undone. Once cancelled, you cannot modify this order.</span>
//                 </p>
//               </div>
//             </div>

//             {/* Modal Footer */}
//             <div className="border-t px-6 py-4 flex gap-3 justify-end bg-gray-50">
//               <button
//                 onClick={() => setShowCancelModal(false)}
//                 className="px-5 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition-all"
//               >
//                 Keep Order
//               </button>
//               <button
//                 onClick={handleCancelOrderSubmit}
//                 disabled={!cancelReason || isCancelling}
//                 className="px-6 py-2.5 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all"
//               >
//                 {isCancelling ? (
//                   <><span className="animate-spin">⟳</span><span>Cancelling...</span></>
//                 ) : (
//                   <><Icon name="XCircleIcon" size={18} /><span>Confirm Cancellation</span></>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ==================== REPORT ISSUE MODAL ==================== */}
//       {showReportModal && (
//         <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
//           <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-y-auto max-h-[90vh] animate-in fade-in zoom-in duration-200">
//             <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
//               <div>
//                 <h3 className="text-lg font-semibold text-gray-900">Report Issue</h3>
//                 <p className="text-sm text-gray-500">Order #{orderId}</p>
//               </div>
//               <button
//                 onClick={() => setShowReportModal(false)}
//                 className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-full"
//               >
//                 <Icon name="XMarkIcon" size={24} />
//               </button>
//             </div>

//             <div className="p-6 space-y-5">
//               {/* Issue Type */}
//               <div>
//                 <label className="text-sm font-medium text-gray-700 block mb-1.5">
//                   What's the issue? <span className="text-red-500">*</span>
//                 </label>
//                 <select
//                   value={reportReason}
//                   onChange={(e) => setReportReason(e.target.value)}
//                   className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white"
//                 >
//                   <option value="">Select issue type</option>
//                   {REPORT_REASONS.map((reason) => (
//                     <option key={reason.id} value={reason.id}>
//                       {reason.icon} {reason.label}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* Description */}
//               <div>
//                 <label className="text-sm font-medium text-gray-700 block mb-1.5">
//                   Description <span className="text-red-500">*</span>
//                 </label>
//                 <textarea
//                   value={reportDescription}
//                   onChange={(e) => setReportDescription(e.target.value)}
//                   placeholder="Please describe the issue in detail..."
//                   rows={4}
//                   className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none bg-white"
//                 />
//                 <p className={`text-xs mt-1 ${reportDescription.length >= 10 ? 'text-green-600' : 'text-gray-400'}`}>
//                   {reportDescription.length < 10 ? `Minimum 10 characters (${reportDescription.length}/10)` : '✓ Good description'}
//                 </p>
//               </div>

//               {/* Photo Upload */}
//               <div>
//                 <FileUpload
//                   onFileSelect={setReportFile}
//                   accept="image/*"
//                   maxSize={5}
//                   label="Upload Photo (Optional)"
//                 />
//                 <p className="text-xs text-gray-400 mt-1">
//                   Supported formats: JPG, PNG, JPEG (Max 5MB)
//                 </p>
//               </div>

//               {/* Help Text */}
//               <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
//                 <p className="text-xs text-blue-700 flex items-start gap-2">
//                   <span className="text-blue-500 text-lg">💬</span>
//                   <span>Our support team will review your issue and get back to you within 24 hours.</span>
//                 </p>
//               </div>
//             </div>

//             <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex items-center justify-end gap-3">
//               <button
//                 onClick={() => setShowReportModal(false)}
//                 className="px-5 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition-all"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleReportSubmit}
//                 disabled={!reportReason || reportDescription.length < 10 || isSubmittingReport}
//                 className="px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all"
//               >
//                 {isSubmittingReport ? (
//                   <><span className="animate-spin">⟳</span><span>Submitting...</span></>
//                 ) : (
//                   <><Icon name="PaperAirplaneIcon" size={18} /><span>Submit Report</span></>
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default OrderActions;


















'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import FileUpload from '@/components/ui/FileUpload';

interface OrderActionsProps {
  orderId: string;
  canCancel: boolean;
  canReturn: boolean;
  invoiceUrl: string;
  orderTotal?: number | string;
  paymentMethod?: string;
  orderStatus?: string;
}

// Company Details
const COMPANY_DETAILS = {
  name: 'DECOR VAULT',
  
  address: 'H No. 9/149, Shyam Block, Kailash Nagar, Gandhi Nagar, New Delhi - 110031',
  email: 'support@decorvault.online',
  phone: '++91 95827 91995',
  gstin: '27AABCZ1234D1ZP',
  cin: 'U74999MH2020PTC345678',
  logoUrl: '/assets/images/logo.png',
};

// Cancel Reasons
const CANCEL_REASONS = [
  { id: 'changed_mind', label: 'Changed my mind', icon: '🔄' },
  { id: 'found_cheaper', label: 'Found cheaper elsewhere', icon: '💰' },
  { id: 'delivery_time', label: 'Delivery time is too long', icon: '⏰' },
  { id: 'wrong_address', label: 'Wrong address entered', icon: '📍' },
  { id: 'duplicate_order', label: 'Duplicate order', icon: '📋' },
  { id: 'payment_issue', label: 'Payment issue', icon: '💳' },
  { id: 'other', label: 'Other reason', icon: '📝' },
];

// Report Issue Reasons
const REPORT_REASONS = [
  { id: 'damaged', label: 'Product is damaged', icon: '💔' },
  { id: 'wrong_item', label: 'Wrong item received', icon: '📦' },
  { id: 'missing_items', label: 'Missing items', icon: '❓' },
  { id: 'delayed_delivery', label: 'Delayed delivery', icon: '🚚' },
  { id: 'quality_issue', label: 'Quality issue', icon: '⭐' },
  { id: 'size_issue', label: 'Size/Fit issue', icon: '📐' },
  { id: 'other', label: 'Other issue', icon: '📝' },
];

const OrderActions = ({
  orderId,
  canCancel,
  canReturn,
  orderTotal = 0,
  paymentMethod = 'UPI',
  orderStatus = 'pending'
}: OrderActionsProps) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [isGeneratingInvoice, setIsGeneratingInvoice] = useState(false);

  // Cancel Order State
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelNote, setCancelNote] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);

  // Report Issue State
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [reportFile, setReportFile] = useState<File | null>(null);
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);

  // Show success/confirmation messages
  const [showSuccessMessage, setShowSuccessMessage] = useState<{ type: 'cancel' | 'report'; message: string } | null>(null);

  const totalAmount = typeof orderTotal === 'string' ? parseFloat(orderTotal) : Number(orderTotal) || 0;

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!showSuccessMessage) return;

    const timer = setTimeout(() => {
      setShowSuccessMessage(null);
    }, 5000);
    return () => clearTimeout(timer);
  }, [showSuccessMessage]);

  // ===================== INVOICE FUNCTIONS =====================

  const getAmountInWords = (amount: number): string => {
    if (amount === 0) return 'Zero';

    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
      'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
      'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    const numToWords = (n: number): string => {
      if (n < 20) return ones[n];
      if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
      if (n < 1000) return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + numToWords(n % 100) : '');
      if (n < 100000) return numToWords(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 ? ' ' + numToWords(n % 1000) : '');
      if (n < 10000000) return numToWords(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 ? ' ' + numToWords(n % 100000) : '');
      return numToWords(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 ? ' ' + numToWords(n % 10000000) : '');
    };

    const rupees = Math.floor(amount);
    const paise = Math.round((amount - rupees) * 100);

    let words = numToWords(rupees) + ' Rupees';
    if (paise > 0) {
      words += ' and ' + numToWords(paise) + ' Paise';
    }
    return words + ' Only';
  };

  const handleDownloadInvoice = async () => {
    if (!isHydrated || isGeneratingInvoice) return;

    setIsGeneratingInvoice(true);
    const orderIdNum = orderId.replace('ORD', '');
    const token = localStorage.getItem('auth_token');
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

    try {
      const response = await fetch(`${API_URL}/orders/${orderIdNum}/invoice`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.invoice) {
        generateInvoiceHTML(data.invoice, orderIdNum);
      } else {
        throw new Error('Invalid invoice data received');
      }
    } catch (error) {
      console.error('Invoice generation error:', error);
      alert('Failed to generate invoice. Please try again or contact support.');
    } finally {
      setIsGeneratingInvoice(false);
    }
  };

  const generateInvoiceHTML = (invoice: any, orderIdNum: string) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow pop-ups to view the invoice.');
      return;
    }

    const rupee = '&#8377;';
    const formatCurrency = (value: number) => (Number.isFinite(value) ? value.toFixed(2) : '0.00');
    const safe = (value: any) => (value === null || value === undefined ? '' : String(value));

    const address = invoice.address || {};
    const addressLine1 = address.addressLine1 || address.address_line1 || '';
    const addressLine2 = address.addressLine2 || address.address_line2 || '';
    const city = address.city || '';
    const state = address.state || '';
    const pincode = address.pincode || '';

    const addressPrimary = [addressLine1, addressLine2].filter(Boolean).join(', ');
    const addressSecondary = [city, state].filter(Boolean).join(', ');
    const addressFull = [addressPrimary, addressSecondary].filter(Boolean).join(', ');
    const addressWithPin = addressFull ? `${addressFull}${pincode ? ` - ${pincode}` : ''}` : (pincode || 'N/A');

    const items = Array.isArray(invoice.items) ? invoice.items : [];
    const subtotal = Number(invoice.subtotal || 0);
    const gst = Number(invoice.gst || 0);
    const deliveryCharges = Number(invoice.deliveryCharges || 0);
    const discount = Number(invoice.discount || 0);
    const total = Number(invoice.total || 0);
    const orderDate = invoice.orderDate || new Date().toLocaleDateString('en-GB');

    const fallbackRow = '<tr><td class="table-cell" colspan="4" style="text-align:center;">No items found</td></tr>';
    const itemRows = items.length > 0 ? items.map((item: any, index: number) => {
      const qty = Number(item.quantity || 0);
      const price = Number(item.price || 0);
      const lineTotal = Number(item.total || qty * price || 0);
      return `
        <tr>
          <td class="table-cell">
            <div class="item-name">${safe(item.name) || 'Product'}</div>
          </td>
          <td class="table-cell" style="text-align:center;">${qty}</td>
          <td class="table-cell" style="text-align:right;">${rupee}${formatCurrency(price)}</td>
          <td class="table-cell" style="text-align:right;">${rupee}${formatCurrency(lineTotal)}</td>
        </tr>
      `;
    }).join('') : fallbackRow;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <title>Invoice - ${safe(invoice.orderNumber)}</title>
          <style>
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body { font-family: Arial, Helvetica, sans-serif; font-size: 12px; line-height: 1.4; margin: 0; background: #f0f0f0; color: #1a1a1a; }
            .toolbar { display: flex; justify-content: flex-end; gap: 10px; padding: 12px 20px; background: #fff; border-bottom: 1px solid #ddd; position: sticky; top: 0; z-index: 100; }
            .btn { padding: 8px 16px; border: 1px solid #333; background: #fff; cursor: pointer; font-size: 12px; border-radius: 4px; transition: all 0.2s; }
            .btn:hover { background: #f5f5f5; }
            .btn.primary { background: #1a1a2e; color: #fff; }
            .btn.primary:hover { background: #333; }
            .page { width: 210mm; min-height: 297mm; margin: 20px auto; background: #fff; border: 1px solid #ddd; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .section { border-bottom: 1px solid #e8e4e0; padding: 12px 20px; }
            .section:last-child { border-bottom: none; }
            .invoice-header { display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; border-bottom: 3px solid #1a1a2e; background: #fafafa; }
            .header-left { display: flex; align-items: center; gap: 16px; }
            .company-logo { width: 70px; height: 70px; object-fit: contain; border: 1px solid #e8e4e0; padding: 4px; border-radius: 4px; }
            .company-name { font-size: 24px; font-weight: 700; color: #1a1a2e; letter-spacing: 1px; }
            .company-tagline { font-size: 11px; color: #666; margin-top: 2px; }
            .header-right { text-align: right; }
            .invoice-title { font-size: 20px; font-weight: 700; color: #1a1a2e; letter-spacing: 2px; }
            .flex { display: flex; justify-content: space-between; align-items: flex-start; gap: 20px; }
            .muted { color: #666; font-size: 11px; }
            .right { text-align: right; }
            .company-details { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 11px; color: #444; padding: 8px 0; }
            .company-details-item { display: flex; gap: 4px; }
            .company-details-item strong { font-weight: 600; color: #1a1a2e; min-width: 60px; }
            .address-grid { display: grid; grid-template-columns: 1fr 1fr; border-top: 1px solid #e8e4e0; }
            .address-block { padding: 12px 20px; border-right: 1px solid #e8e4e0; }
            .address-block:last-child { border-right: none; }
            .address-title { font-weight: 700; margin-bottom: 6px; font-size: 13px; color: #1a1a2e; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px 10px; vertical-align: middle; }
            th { background: #f5f5f5; text-align: left; font-weight: 600; font-size: 11px; color: #1a1a2e; }
            .table-cell { font-size: 11px; }
            .text-right { text-align: right; }
            .text-center { text-align: center; }
            .item-name { font-weight: 600; color: #1a1a2e; }
            .summary { max-width: 320px; margin-left: auto; padding: 4px 0; }
            .summary-row { display: flex; justify-content: space-between; padding: 5px 0; font-size: 12px; }
            .summary-row.total { font-weight: 700; border-top: 2px solid #1a1a2e; padding-top: 8px; margin-top: 5px; font-size: 14px; color: #1a1a2e; }
            .footer { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; font-size: 11px; }
            .signature { text-align: right; }
            .signature-line { border-top: 1px solid #1a1a2e; margin-top: 30px; padding-top: 4px; font-weight: 600; }
            .thank-you { text-align: center; font-size: 14px; font-weight: 600; color: #1a1a2e; padding: 12px 0 4px 0; letter-spacing: 1px; }
            .bill-header { text-align: center; font-size: 16px; font-weight: 700; color: #1a1a2e; padding: 8px 0; border-bottom: 2px dashed #1a1a2e; margin-bottom: 12px; }
            .bill-footer { text-align: center; font-size: 10px; color: #666; padding-top: 8px; border-top: 2px dashed #1a1a2e; margin-top: 12px; }
            @media print { body { background: #fff; } .toolbar { display: none; } .page { margin: 0; border: none; width: auto; min-height: auto; box-shadow: none; } }
          </style>
        </head>
        <body>
          <div class="toolbar">
            <button class="btn" onclick="window.close()">Close</button>
            <button class="btn primary" onclick="window.print()">Print / Download</button>
          </div>
          <div class="page">
            <div class="invoice-header">
              <div class="header-left">
                <img class="company-logo" src="${COMPANY_DETAILS.logoUrl}" alt="${COMPANY_DETAILS.name}" onerror="this.style.display='none'" />
                <div>
                  <div class="company-name">${COMPANY_DETAILS.name}</div>
                  <div class="company-tagline">Premium Home Decor & Furniture</div>
                </div>
              </div>
              <div class="header-right">
                <div class="invoice-title">TAX INVOICE</div>
                <div style="font-size:10px;color:#666;margin-top:4px;">GST Invoice</div>
              </div>
            </div>
            <div class="section" style="background:#fafafa;border-bottom:2px solid #e8e4e0;">
              <div class="company-details">
                <div class="company-details-item"><strong>Address:</strong><span>${COMPANY_DETAILS.address}</span></div>
                <div class="company-details-item"><strong>Email:</strong><span>${COMPANY_DETAILS.email}</span></div>
                <div class="company-details-item"><strong>Phone:</strong><span>${COMPANY_DETAILS.phone}</span></div>
                <div class="company-details-item"><strong>GSTIN:</strong><span>${COMPANY_DETAILS.gstin}</span></div>
              </div>
            </div>
            <div class="section flex">
              <div>
                <div><strong>Order Number:</strong> ${safe(invoice.orderNumber)}</div>
                <div><strong>Order Date:</strong> ${orderDate}</div>
                <div><strong>Payment Method:</strong> ${safe(invoice.paymentMethod) || 'N/A'}</div>
                <div><strong>Order Status:</strong> ${safe(invoice.status) || 'N/A'}</div>
                <div style="margin-top:4px;font-size:10px;color:#666;"><strong>Invoice Date:</strong> ${orderDate}</div>
              </div>
            </div>
            <div class="address-grid">
              <div class="address-block">
                <div class="address-title">Billed To</div>
                <div>${safe(invoice.customerName) || 'Customer'}</div>
                <div class="muted">${addressWithPin}</div>
                <div class="muted">Email: ${safe(invoice.customerEmail) || 'N/A'}</div>
                <div class="muted">Phone: ${safe(invoice.customerPhone) || 'N/A'}</div>
              </div>
              <div class="address-block">
                <div class="address-title">Shipped To</div>
                <div>${safe(invoice.customerName) || 'Customer'}</div>
                <div class="muted">${addressWithPin}</div>
                <div class="muted">Phone: ${safe(invoice.customerPhone) || 'N/A'}</div>
              </div>
            </div>
            <div class="section" style="padding: 0;">
              <div class="bill-header">ORDER ITEMS</div>
              <table>
                <thead>
                  <tr>
                    <th style="width:45%;">Item</th>
                    <th style="width:15%;text-align:center;">Qty</th>
                    <th style="width:20%;text-align:right;">Price</th>
                    <th style="width:20%;text-align:right;">Total</th>
                  </tr>
                </thead>
                <tbody>${itemRows}</tbody>
              </table>
              <div class="bill-footer">Thank you for your purchase!</div>
            </div>
            <div class="section">
              <div class="summary">
                <div class="summary-row"><span>Subtotal</span><span>${rupee}${formatCurrency(subtotal)}</span></div>
                <div class="summary-row"><span>GST (18%)</span><span>${rupee}${formatCurrency(gst)}</span></div>
                <div class="summary-row"><span>Delivery Charges</span><span>${rupee}${formatCurrency(deliveryCharges)}</span></div>
                ${discount > 0 ? `<div class="summary-row"><span>Discount</span><span>-${rupee}${formatCurrency(discount)}</span></div>` : ''}
                <div class="summary-row total"><span>Grand Total</span><span>${rupee}${formatCurrency(total)}</span></div>
              </div>
              <div style="text-align:right;margin-top:8px;font-size:10px;color:#666;">
                Amount in Words: ${getAmountInWords(total)}
              </div>
            </div>
            <div class="section footer">
              <div>
                <div><strong>Returns Policy:</strong> Returns accepted within 7 days of delivery with original packaging and invoice.</div>
                <div class="muted" style="margin-top:4px;">For warranty and support, please retain this invoice.</div>
              </div>
              <div class="signature">
                <div><strong>FOR ${COMPANY_DETAILS.name}</strong></div>
                <div class="signature-line">Authorized Signatory</div>
              </div>
            </div>
            <div class="section" style="border-bottom: none;">
              <div class="thank-you">Thank you for shopping with ${COMPANY_DETAILS.name}!</div>
              <div style="text-align:center;font-size:10px;color:#999;margin-top:4px;">
                This is a system generated invoice and does not require a physical signature.
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  // ===================== CANCEL ORDER FUNCTIONS =====================

  const handleCancelOrder = () => {
    if (!isHydrated) return;
    setShowCancelModal(true);
  };

  const handleCancelOrderSubmit = async () => {
    if (!cancelReason) {
      alert('Please select a reason for cancellation');
      return;
    }

    setIsCancelling(true);

    try {
      const token = localStorage.getItem('auth_token');
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const orderIdNum = orderId.replace('ORD', '');

      const response = await fetch(`${API_URL}/orders/${orderIdNum}/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          reason: cancelReason,
          note: cancelNote
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setShowCancelModal(false);
        setCancelReason('');
        setCancelNote('');

        const refundMessage = data.refundInitiated
          ? 'Refund will be initiated within 3-5 business days and credited to your original payment method.'
          : 'No refund needed as this was a COD order.';

        setShowSuccessMessage({
          type: 'cancel',
          message: `Order cancelled successfully! ${refundMessage}`
        });

        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } else {
        throw new Error(data.message || 'Failed to cancel order');
      }
    } catch (error: any) {
      console.error('❌ Cancel error:', error);
      alert(error.message || 'Failed to cancel order. Please try again or contact support.');
    } finally {
      setIsCancelling(false);
    }
  };

  // ===================== REPORT ISSUE FUNCTIONS =====================

  const handleReportIssue = () => {
    if (!isHydrated) return;
    setShowReportModal(true);
  };

  const handleReportSubmit = async () => {
    if (!reportReason) {
      alert('Please select the type of issue');
      return;
    }
    if (!reportDescription || reportDescription.length < 10) {
      alert('Please provide a detailed description (minimum 10 characters)');
      return;
    }

    setIsSubmittingReport(true);

    try {
      const token = localStorage.getItem('auth_token');
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const orderIdNum = orderId.replace('ORD', '');

      const formData = new FormData();
      formData.append('reason', reportReason);
      formData.append('description', reportDescription);
      if (reportFile) {
        formData.append('file', reportFile);
      }

      const response = await fetch(`${API_URL}/orders/${orderIdNum}/report`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setShowReportModal(false);
        setReportReason('');
        setReportDescription('');
        setReportFile(null);

        setShowSuccessMessage({
          type: 'report',
          message: 'Issue reported successfully! Our support team will contact you within 24 hours.'
        });
      } else {
        throw new Error(data.message || 'Failed to report issue');
      }
    } catch (error: any) {
      console.error('❌ Report error:', error);
      alert(error.message || 'Failed to submit report. Please try again or contact support.');
    } finally {
      setIsSubmittingReport(false);
    }
  };

  // ===================== RETURN FUNCTIONS =====================

  const handleInitiateReturn = () => {
    if (!isHydrated) return;
    alert('Return process initiated. Our team will contact you within 24 hours.');
  };

  // ===================== RENDER =====================

  if (!isHydrated) {
    return (
      <div className="rounded-lg bg-card p-6 shadow-elevation-2">
        <h2 className="mb-4 font-heading text-xl font-semibold text-foreground">Order Actions</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <button className="flex items-center justify-center space-x-2 rounded-md bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-smooth" disabled>
            <Icon name="DocumentArrowDownIcon" size={18} />
            <span>Download Invoice</span>
          </button>
          <button className="flex items-center justify-center space-x-2 rounded-md border border-border bg-background px-4 py-3 text-sm font-medium text-foreground transition-smooth" disabled>
            <Icon name="ExclamationTriangleIcon" size={18} />
            <span>Report Issue</span>
          </button>
        </div>
      </div>
    );
  }

  // ✅ If order is cancelled, show cancelled state
  if (orderStatus === 'cancelled') {
    return (
      <div className="rounded-lg bg-card p-6 shadow-elevation-2 border border-red-200 bg-red-50/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
            <Icon name="XCircleIcon" size={20} className="text-red-600" />
          </div>
          <div>
            <h3 className="font-semibold text-red-800">Order Cancelled</h3>
            <p className="text-sm text-red-600">This order has been cancelled</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-lg bg-card p-6 shadow-elevation-2">
        <h2 className="mb-4 font-heading text-xl font-semibold text-foreground">Order Actions</h2>

        <div className="grid gap-3 sm:grid-cols-2">
          <button
            onClick={handleDownloadInvoice}
            disabled={isGeneratingInvoice}
            className="flex items-center justify-center space-x-2 rounded-md bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-smooth hover:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGeneratingInvoice ? (
              <><span className="animate-spin">⟳</span><span>Generating...</span></>
            ) : (
              <><Icon name="DocumentArrowDownIcon" size={18} /><span>Download Invoice</span></>
            )}
          </button>

          <button
            onClick={handleReportIssue}
            className="flex items-center justify-center space-x-2 rounded-md border border-border bg-background px-4 py-3 text-sm font-medium text-foreground transition-smooth hover:bg-muted"
          >
            <Icon name="ExclamationTriangleIcon" size={18} />
            <span>Report Issue</span>
          </button>

          {canCancel && (
            <button
              onClick={handleCancelOrder}
              className="flex items-center justify-center space-x-2 rounded-md border border-red-300 bg-white px-4 py-3 text-sm font-medium text-red-600 transition-smooth hover:bg-red-50 hover:border-red-400"
            >
              <Icon name="XCircleIcon" size={18} />
              <span>Cancel Order</span>
            </button>
          )}

          {canReturn && (
            <button
              onClick={handleInitiateReturn}
              className="flex items-center justify-center space-x-2 rounded-md border border-border bg-background px-4 py-3 text-sm font-medium text-foreground transition-smooth hover:bg-muted"
            >
              <Icon name="ArrowUturnLeftIcon" size={18} />
              <span>Initiate Return</span>
            </button>
          )}
        </div>

        {showSuccessMessage && (
          <div className={`mt-4 p-4 rounded-lg ${showSuccessMessage.type === 'cancel'
            ? 'bg-green-50 border border-green-200'
            : 'bg-blue-50 border border-blue-200'
            }`}>
            <div className="flex items-start gap-3">
              <Icon name="CheckCircleIcon" size={20} className={showSuccessMessage.type === 'cancel' ? 'text-green-500' : 'text-blue-500'} />
              <div>
                <p className={`font-medium ${showSuccessMessage.type === 'cancel' ? 'text-green-800' : 'text-blue-800'}`}>
                  {showSuccessMessage.type === 'cancel' ? 'Order Cancelled' : 'Report Submitted'}
                </p>
                <p className="text-sm text-gray-600">{showSuccessMessage.message}</p>
              </div>
              <button onClick={() => setShowSuccessMessage(null)} className="ml-auto text-gray-400 hover:text-gray-600">
                <Icon name="XMarkIcon" size={16} />
              </button>
            </div>
          </div>
        )}

        <div className="mt-4 rounded-md bg-muted p-4">
          <div className="flex items-start space-x-3">
            <Icon name="InformationCircleIcon" size={20} className="mt-0.5 flex-shrink-0 text-primary" />
            <div>
              <p className="text-sm font-medium text-foreground">Need Help?</p>
              <p className="caption mt-1 text-muted-foreground">
                Contact our customer support team for any queries or assistance with your order.
              </p>
              <button className="mt-2 text-sm font-medium text-primary transition-smooth hover:underline">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ==================== CANCEL ORDER MODAL - CLEAN E-COMMERCE STYLE ==================== */}
      {showCancelModal && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="border-b px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Cancel Order</h3>
                <p className="text-sm text-gray-500">Order #{orderId}</p>
              </div>
              <button
                onClick={() => setShowCancelModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-full"
              >
                <Icon name="XMarkIcon" size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              {/* Order Summary Card */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Order Total</span>
                  <span className="font-semibold text-gray-900">₹{totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Payment Method</span>
                  <span className="font-medium capitalize text-gray-700">{paymentMethod}</span>
                </div>
                {paymentMethod === 'Prepaid' && (
                  <div className="mt-2 text-xs text-blue-600 bg-blue-50 p-2.5 rounded-lg flex items-center gap-2">
                    <span>💳</span>
                    <span>Refund will be credited to your original payment method</span>
                  </div>
                )}
              </div>

              {/* Reason Selection */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">
                  Why are you cancelling? <span className="text-red-500">*</span>
                </label>
                <select
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white"
                >
                  <option value="">Select a reason</option>
                  {CANCEL_REASONS.map((reason) => (
                    <option key={reason.id} value={reason.id}>
                      {reason.icon} {reason.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Additional Note */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">
                  Additional Note <span className="text-gray-400">(Optional)</span>
                </label>
                <textarea
                  value={cancelNote}
                  onChange={(e) => setCancelNote(e.target.value)}
                  placeholder="Any additional details..."
                  rows={2}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none bg-white"
                />
              </div>

              {/* Refund Timeline */}
              {paymentMethod === 'Prepaid' && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-blue-500 text-lg">⏰</span>
                    <div>
                      <p className="text-sm font-medium text-blue-800">Refund Timeline</p>
                      <ul className="text-xs text-blue-700 space-y-0.5 mt-1">
                        <li>• Refund initiated within 3-5 business days</li>
                        <li>• Amount credited to original payment method</li>
                        <li>• You'll receive confirmation via email</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'COD' && (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <span>ℹ️</span>
                    No payment was made for this order as it's Cash on Delivery.
                  </p>
                </div>
              )}

              {/* Warning */}
              <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                <p className="text-xs text-red-600 flex items-start gap-2">
                  <span className="text-red-500 text-lg">⚠️</span>
                  <span>This action cannot be undone. Once cancelled, you cannot modify this order.</span>
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t px-6 py-4 flex gap-3 justify-end bg-gray-50">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-5 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition-all"
              >
                Keep Order
              </button>
              <button
                onClick={handleCancelOrderSubmit}
                disabled={!cancelReason || isCancelling}
                className="px-6 py-2.5 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all"
              >
                {isCancelling ? (
                  <><span className="animate-spin">⟳</span><span>Cancelling...</span></>
                ) : (
                  <><Icon name="XCircleIcon" size={18} /><span>Confirm Cancellation</span></>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== REPORT ISSUE MODAL ==================== */}
      {showReportModal && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-y-auto max-h-[90vh] animate-in fade-in zoom-in duration-200">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Report Issue</h3>
                <p className="text-sm text-gray-500">Order #{orderId}</p>
              </div>
              <button
                onClick={() => setShowReportModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-full"
              >
                <Icon name="XMarkIcon" size={24} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Issue Type */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">
                  What's the issue? <span className="text-red-500">*</span>
                </label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white"
                >
                  <option value="">Select issue type</option>
                  {REPORT_REASONS.map((reason) => (
                    <option key={reason.id} value={reason.id}>
                      {reason.icon} {reason.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1.5">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={reportDescription}
                  onChange={(e) => setReportDescription(e.target.value)}
                  placeholder="Please describe the issue in detail..."
                  rows={4}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none bg-white"
                />
                <p className={`text-xs mt-1 ${reportDescription.length >= 10 ? 'text-green-600' : 'text-gray-400'}`}>
                  {reportDescription.length < 10 ? `Minimum 10 characters (${reportDescription.length}/10)` : '✓ Good description'}
                </p>
              </div>

              {/* Photo Upload */}
              <div>
                <FileUpload
                  onFileSelect={setReportFile}
                  accept="image/*"
                  maxSize={5}
                  label="Upload Photo (Optional)"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Supported formats: JPG, PNG, JPEG (Max 5MB)
                </p>
              </div>

              {/* Help Text */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-xs text-blue-700 flex items-start gap-2">
                  <span className="text-blue-500 text-lg">💬</span>
                  <span>Our support team will review your issue and get back to you within 24 hours.</span>
                </p>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowReportModal(false)}
                className="px-5 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleReportSubmit}
                disabled={!reportReason || reportDescription.length < 10 || isSubmittingReport}
                className="px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all"
              >
                {isSubmittingReport ? (
                  <><span className="animate-spin">⟳</span><span>Submitting...</span></>
                ) : (
                  <><Icon name="PaperAirplaneIcon" size={18} /><span>Submit Report</span></>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderActions;