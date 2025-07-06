import { jsPDF } from 'jspdf';

export const generateImprovedInvoice = (order, user) => {
  const doc = new jsPDF();
  
  // Set initial position
  let y = 20;
  
  // Company Header
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('KaapiKart', 20, y);
  
  y += 8;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Coffee Shop & Cafe', 20, y);
  
  y += 6;
  doc.text('123 Coffee Street, Brew City', 20, y);
  
  y += 6;
  doc.text('Phone: +91 98765 43210 | Email: info@kaapikart.com', 20, y);
  
  // Invoice Title
  y += 20;
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('INVOICE', 20, y);
  
  // Invoice Details (Left side)
  y += 15;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Invoice #: ${order._id.slice(-8).toUpperCase()}`, 20, y);
  
  y += 6;
  const orderDate = new Date(order.createdAt);
  const formattedDate = isNaN(orderDate.getTime()) ? 'N/A' : orderDate.toLocaleDateString();
  doc.text(`Date: ${formattedDate}`, 20, y);
  
  y += 6;
  doc.text(`Order ID: ${order._id}`, 20, y);
  
  // Customer Details (Right side)
  y = 75;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Bill To:', 120, y);
  
  y += 8;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(user.name || 'N/A', 120, y);
  
  y += 6;
  doc.text(user.email || 'N/A', 120, y);
  
  if (user.phone) {
    y += 6;
    doc.text(user.phone, 120, y);
  }
  
  if (user.address) {
    y += 6;
    doc.text(user.address, 120, y);
  }
  
  // Items Table Header
  y = 140;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  
  // Draw table header manually for better control
  doc.rect(20, y - 5, 170, 8); // Header background
  doc.setFillColor(76, 175, 80);
  doc.rect(20, y - 5, 170, 8, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.text('Item', 25, y);
  doc.text('Qty', 100, y);
  doc.text('Price', 130, y);
  doc.text('Total', 160, y);
  
  // Reset text color
  doc.setTextColor(0, 0, 0);
  
  // Items
  y += 10;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  let totalItems = 0;
  let grandTotal = 0;
  
  order.items.forEach((item, index) => {
    if (y > 250) {
      doc.addPage();
      y = 20;
    }
    
    const price = parseFloat(item.price) || 0;
    const quantity = parseInt(item.quantity) || 0;
    const itemTotal = price * quantity;
    
    totalItems += quantity;
    grandTotal += itemTotal;
    
    // Draw row background
    doc.setFillColor(248, 249, 250);
    doc.rect(20, y - 3, 170, 6, 'F');
    
    // Item details
    doc.text(item.product.name || 'Unknown Product', 25, y);
    doc.text(quantity.toString(), 100, y);
    doc.text(`₹${price.toFixed(2)}`, 130, y);
    doc.text(`₹${itemTotal.toFixed(2)}`, 160, y);
    
    y += 8;
  });
  
  // Total row
  y += 5;
  doc.setFillColor(240, 248, 255);
  doc.rect(20, y - 3, 170, 8, 'F');
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('TOTAL:', 100, y + 2);
  doc.text(`₹${grandTotal.toFixed(2)}`, 160, y + 2);
  
  // Order Summary
  y += 20;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Order Summary', 20, y);
  
  y += 10;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Total Items: ${totalItems}`, 20, y);
  
  y += 6;
  doc.text(`Grand Total: ₹${grandTotal.toFixed(2)}`, 20, y);
  
  // Payment Status
  y += 10;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(`Payment Status: ${order.isPaid ? 'PAID' : 'PENDING'}`, 20, y);
  
  if (order.isPaid && order.paidAt) {
    y += 6;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const paidDate = new Date(order.paidAt);
    const formattedPaidDate = isNaN(paidDate.getTime()) ? 'N/A' : paidDate.toLocaleDateString();
    doc.text(`Paid on: ${formattedPaidDate}`, 20, y);
  }
  
  // Footer
  y += 20;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Thank you for your order!', 20, y);
  
  y += 6;
  doc.text('Visit us again at KaapiKart', 20, y);
  
  return doc;
};

export const downloadImprovedInvoice = (order, user) => {
  const doc = generateImprovedInvoice(order, user);
  const orderDate = new Date(order.createdAt);
  const fileName = `invoice-${order._id.slice(-8)}-${orderDate.getFullYear()}-${String(orderDate.getMonth() + 1).padStart(2, '0')}-${String(orderDate.getDate()).padStart(2, '0')}.pdf`;
  doc.save(fileName);
}; 