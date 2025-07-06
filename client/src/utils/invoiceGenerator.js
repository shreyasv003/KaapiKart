import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export const generateInvoice = (order, user) => {
  const doc = new jsPDF();
  
  // Add company header
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('KaapiKart', 20, 20);
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Coffee Shop & Cafe', 20, 30);
  doc.text('123 Coffee Street, Brew City', 20, 40);
  doc.text('Phone: +91 98765 43210', 20, 50);
  doc.text('Email: info@kaapikart.com', 20, 60);
  
  // Add invoice details
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('INVOICE', 20, 80);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Invoice #: ${order._id.slice(-8).toUpperCase()}`, 20, 95);
  const orderDate = new Date(order.createdAt);
  const formattedDate = isNaN(orderDate.getTime()) ? 'N/A' : orderDate.toLocaleDateString();
  doc.text(`Date: ${formattedDate}`, 20, 105);
  doc.text(`Order ID: ${order._id}`, 20, 115);
  
  // Add customer details
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Bill To:', 120, 95);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(user.name, 120, 105);
  doc.text(user.email, 120, 115);
  if (user.phone) {
    doc.text(user.phone, 120, 125);
  }
  if (user.address) {
    doc.text(user.address, 120, 135);
  }
  
  // Add items table
  const tableY = 150;
  
  const tableData = order.items.map(item => {
    const price = parseFloat(item.price) || 0;
    const quantity = parseInt(item.quantity) || 0;
    const itemTotal = price * quantity;
    
    return [
      item.product.name,
      quantity.toString(),
      `₹${price.toFixed(2)}`,
      `₹${itemTotal.toFixed(2)}`
    ];
  });
  
  // Add total row
  const grandTotal = parseFloat(order.total) || 0;
  tableData.push(['', '', 'Total:', `₹${grandTotal.toFixed(2)}`]);
  
  doc.autoTable({
    startY: tableY,
    head: [['Item', 'Quantity', 'Price', 'Total']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [76, 175, 80],
      textColor: 255,
      fontStyle: 'bold'
    },
    styles: {
      fontSize: 10,
      cellPadding: 5
    },
    columnStyles: {
      0: { cellWidth: 70 },
      1: { cellWidth: 25, halign: 'center' },
      2: { cellWidth: 30, halign: 'right' },
      3: { cellWidth: 30, halign: 'right' }
    },
    didDrawCell: function(data) {
      // Make the total row bold
      if (data.row.index === tableData.length - 1 && data.column.index > 0) {
        doc.setFont('helvetica', 'bold');
      }
    }
  });
  
  // Add footer
  const finalY = doc.lastAutoTable.finalY + 20;
  
  // Add order summary
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Order Summary:', 20, finalY);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Total Items: ${order.items.reduce((sum, item) => sum + (parseInt(item.quantity) || 0), 0)}`, 20, finalY + 15);
  doc.text(`Grand Total: ₹${grandTotal.toFixed(2)}`, 20, finalY + 25);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Thank you for your order!', 20, finalY + 40);
  doc.text('Visit us again at KaapiKart', 20, finalY + 50);
  
  // Add payment status
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(`Payment Status: ${order.isPaid ? 'PAID' : 'PENDING'}`, 20, finalY + 65);
  
  if (order.isPaid && order.paidAt) {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const paidDate = new Date(order.paidAt);
    const formattedPaidDate = isNaN(paidDate.getTime()) ? 'N/A' : paidDate.toLocaleDateString();
    doc.text(`Paid on: ${formattedPaidDate}`, 20, finalY + 75);
  }
  
  return doc;
};

export const downloadInvoice = (order, user) => {
  const doc = generateInvoice(order, user);
  const orderDate = new Date(order.createdAt);
  const fileName = `invoice-${order._id.slice(-8)}-${orderDate.getFullYear()}-${String(orderDate.getMonth() + 1).padStart(2, '0')}-${String(orderDate.getDate()).padStart(2, '0')}.pdf`;
  doc.save(fileName);
}; 