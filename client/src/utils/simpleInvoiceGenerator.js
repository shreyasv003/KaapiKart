import { jsPDF } from 'jspdf';

export const generateSimpleInvoice = (order, user) => {
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
  
  // Add items table header
  const startY = 150;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Item', 20, startY);
  doc.text('Qty', 80, startY);
  doc.text('Price', 110, startY);
  doc.text('Total', 140, startY);
  
  // Add items
  let currentY = startY + 10;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  order.items.forEach((item, index) => {
    if (currentY > 250) {
      doc.addPage();
      currentY = 20;
    }
    
    const price = parseFloat(item.price) || 0;
    const quantity = parseInt(item.quantity) || 0;
    const itemTotal = price * quantity;
    
    doc.text(item.product.name, 20, currentY);
    doc.text(quantity.toString(), 80, currentY);
    doc.text(`₹${price.toFixed(2)}`, 110, currentY);
    doc.text(`₹${itemTotal.toFixed(2)}`, 140, currentY);
    
    currentY += 8;
  });
  
  // Add total
  currentY += 5;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Total:', 110, currentY);
  const grandTotal = parseFloat(order.total) || 0;
  doc.text(`₹${grandTotal.toFixed(2)}`, 140, currentY);
  
  // Add order summary
  currentY += 15;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Order Summary:', 20, currentY);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Total Items: ${order.items.reduce((sum, item) => sum + (parseInt(item.quantity) || 0), 0)}`, 20, currentY + 15);
  doc.text(`Grand Total: ₹${grandTotal.toFixed(2)}`, 20, currentY + 25);
  
  // Add footer
  currentY += 35;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Thank you for your order!', 20, currentY);
  doc.text('Visit us again at KaapiKart', 20, currentY + 10);
  
  // Add payment status
  currentY += 20;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(`Payment Status: ${order.isPaid ? 'PAID' : 'PENDING'}`, 20, currentY);
  
  if (order.isPaid && order.paidAt) {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const paidDate = new Date(order.paidAt);
    const formattedPaidDate = isNaN(paidDate.getTime()) ? 'N/A' : paidDate.toLocaleDateString();
    doc.text(`Paid on: ${formattedPaidDate}`, 20, currentY + 10);
  }
  
  return doc;
};

export const downloadSimpleInvoice = (order, user) => {
  const doc = generateSimpleInvoice(order, user);
  const orderDate = new Date(order.createdAt);
  const fileName = `invoice-${order._id.slice(-8)}-${orderDate.getFullYear()}-${String(orderDate.getMonth() + 1).padStart(2, '0')}-${String(orderDate.getDate()).padStart(2, '0')}.pdf`;
  doc.save(fileName);
}; 