
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CheckCircle, Download } from 'lucide-react';
import AdminLayout from '../components/layout/AdminLayout';
import PageHeader from '../components/ui/PageHeader';
import DataTable from '../components/ui/DataTable';
import StatsCard from '../components/ui/StatsCard';
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Payment data types
interface UnpaidOrder {
  id: string;
  studioId: number;
  studioName: string;
  date: string;
  amount: number;
  isPaid: boolean;
  washType: 'express' | 'standard' | 'combined';
  customerName: string;
}

interface PaymentRecord {
  id: string;
  studioId: number;
  studioName: string;
  orderId: string;
  amount: number;
  paymentDate: string;
  referenceNumber: string;
  washType: 'express' | 'standard' | 'combined';
}

// Sample data with combined wash type added
const initialUnpaidOrders: UnpaidOrder[] = [
  { id: 'ORD-1001', studioId: 1, studioName: 'Saiteja Laundry', date: '2023-06-10', amount: 45000, isPaid: false, washType: 'standard', customerName: 'John Doe' },
  { id: 'ORD-1002', studioId: 1, studioName: 'Saiteja Laundry', date: '2023-06-12', amount: 32000, isPaid: false, washType: 'express', customerName: 'Jane Smith' },
  { id: 'ORD-1003', studioId: 2, studioName: 'Sparkle Clean Laundry', date: '2023-06-15', amount: 55000, isPaid: false, washType: 'standard', customerName: 'Robert Johnson' },
  { id: 'ORD-1004', studioId: 3, studioName: 'Fresh Fold Services', date: '2023-06-16', amount: 40000, isPaid: false, washType: 'express', customerName: 'Emily Wilson' },
  { id: 'ORD-1005', studioId: 2, studioName: 'Sparkle Clean Laundry', date: '2023-06-18', amount: 28000, isPaid: false, washType: 'standard', customerName: 'Michael Brown' },
  { id: 'ORD-1006', studioId: 1, studioName: 'Saiteja Laundry', date: '2023-06-20', amount: 38000, isPaid: false, washType: 'standard', customerName: 'Sarah Davis' },
  { id: 'ORD-1007', studioId: 1, studioName: 'Saiteja Laundry', date: '2023-06-22', amount: 29000, isPaid: false, washType: 'express', customerName: 'Thomas Miller' },
  { id: 'ORD-1008', studioId: 3, studioName: 'Fresh Fold Services', date: '2023-06-25', amount: 65000, isPaid: false, washType: 'combined', customerName: 'Laura Wilson' },
  { id: 'ORD-1009', studioId: 2, studioName: 'Sparkle Clean Laundry', date: '2023-06-26', amount: 52000, isPaid: false, washType: 'combined', customerName: 'Alex Johnson' },
  { id: 'ORD-1010', studioId: 1, studioName: 'Saiteja Laundry', date: '2023-06-28', amount: 47000, isPaid: false, washType: 'combined', customerName: 'Maya Patel' },
];

const initialPaymentHistory: PaymentRecord[] = [
  { id: 'PMT-2001', studioId: 1, studioName: 'Saiteja Laundry', orderId: 'ORD-1000', amount: 52000, paymentDate: '2023-06-05', referenceNumber: 'UTR12345678', washType: 'standard' },
  { id: 'PMT-2002', studioId: 2, studioName: 'Sparkle Clean Laundry', orderId: 'ORD-995', amount: 42000, paymentDate: '2023-06-04', referenceNumber: 'UTR87654321', washType: 'express' },
  { id: 'PMT-2003', studioId: 1, studioName: 'Saiteja Laundry', orderId: 'ORD-990', amount: 35000, paymentDate: '2023-06-02', referenceNumber: 'UTR23456789', washType: 'standard' },
  { id: 'PMT-2004', studioId: 3, studioName: 'Fresh Fold Services', orderId: 'ORD-985', amount: 60000, paymentDate: '2023-05-30', referenceNumber: 'UTR98765432', washType: 'express' },
  { id: 'PMT-2005', studioId: 4, studioName: 'Royal Wash', orderId: 'ORD-980', amount: 48000, paymentDate: '2023-05-28', referenceNumber: 'UTR34567890', washType: 'standard' },
  { id: 'PMT-2006', studioId: 1, studioName: 'Saiteja Laundry', orderId: 'ORD-975', amount: 41000, paymentDate: '2023-05-25', referenceNumber: 'UTR45678901', washType: 'express' },
  { id: 'PMT-2007', studioId: 3, studioName: 'Fresh Fold Services', orderId: 'ORD-970', amount: 58000, paymentDate: '2023-05-22', referenceNumber: 'UTR56789012', washType: 'combined' },
  { id: 'PMT-2008', studioId: 2, studioName: 'Sparkle Clean Laundry', orderId: 'ORD-965', amount: 49000, paymentDate: '2023-05-20', referenceNumber: 'UTR67890123', washType: 'combined' },
];

const StudioPayments: React.FC = () => {
  const { studioId } = useParams<{ studioId?: string }>();
  const [unpaidOrders, setUnpaidOrders] = useState<UnpaidOrder[]>(initialUnpaidOrders);
  const [paymentHistory, setPaymentHistory] = useState<PaymentRecord[]>(initialPaymentHistory);
  const [viewType, setViewType] = useState<'unpaid' | 'history'>('unpaid');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<UnpaidOrder | null>(null);
  const [paymentReference, setPaymentReference] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [washTypeFilter, setWashTypeFilter] = useState<'all' | 'express' | 'standard' | 'combined'>('all');
  const { toast } = useToast();

  // Filter data based on studio ID if provided
  const filteredUnpaidOrders = studioId 
    ? unpaidOrders.filter(order => order.studioId === Number(studioId))
    : unpaidOrders;

  const filteredPaymentHistory = studioId 
    ? paymentHistory.filter(payment => payment.studioId === Number(studioId))
    : paymentHistory;

  // Further filter unpaid orders by wash type if selected
  const washTypeFilteredUnpaidOrders = washTypeFilter === 'all' 
    ? filteredUnpaidOrders 
    : filteredUnpaidOrders.filter(order => order.washType === washTypeFilter);

  // Calculate studio specific total if studio ID is provided
  const studioName = studioId && filteredUnpaidOrders.length > 0 
    ? filteredUnpaidOrders[0].studioName 
    : 'All Studios';
    
  const totalUnpaidAmount = washTypeFilteredUnpaidOrders.reduce((sum, order) => sum + order.amount, 0);

  // Get order counts by wash type
  const expressWashCount = filteredUnpaidOrders.filter(order => order.washType === 'express').length;
  const standardWashCount = filteredUnpaidOrders.filter(order => order.washType === 'standard').length;
  const combinedWashCount = filteredUnpaidOrders.filter(order => order.washType === 'combined').length;

  // Get total amounts by wash type
  const expressWashAmount = filteredUnpaidOrders
    .filter(order => order.washType === 'express')
    .reduce((sum, order) => sum + order.amount, 0);
    
  const standardWashAmount = filteredUnpaidOrders
    .filter(order => order.washType === 'standard')
    .reduce((sum, order) => sum + order.amount, 0);
    
  const combinedWashAmount = filteredUnpaidOrders
    .filter(order => order.washType === 'combined')
    .reduce((sum, order) => sum + order.amount, 0);

  // Mark order as paid
  const openPaymentModal = (order: UnpaidOrder) => {
    setSelectedOrder(order);
    setShowPaymentModal(true);
  };

  const confirmPayment = () => {
    if (!selectedOrder || !paymentReference || !paymentDate) {
      toast({
        title: "Error",
        description: "Please fill in all payment details",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    // Create new payment record
    const newPayment: PaymentRecord = {
      id: `PMT-${Math.floor(Math.random() * 10000)}`,
      studioId: selectedOrder.studioId,
      studioName: selectedOrder.studioName,
      orderId: selectedOrder.id,
      amount: selectedOrder.amount,
      paymentDate: paymentDate,
      referenceNumber: paymentReference,
      washType: selectedOrder.washType
    };

    // Update unpaid orders
    setUnpaidOrders(unpaidOrders.filter(order => order.id !== selectedOrder.id));
    
    // Add to payment history
    setPaymentHistory([newPayment, ...paymentHistory]);
    
    // Close modal and reset form
    setShowPaymentModal(false);
    setSelectedOrder(null);
    setPaymentReference('');
    setPaymentDate('');

    // Show success toast
    toast({
      title: "Payment Recorded",
      description: `Payment of ₹${(selectedOrder.amount).toLocaleString('en-IN')} for order ${selectedOrder.id} has been marked as paid.`,
      duration: 3000,
    });
  };

  // Format currency to Indian Rupees
  const formatIndianRupees = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  // Unpaid orders columns
  const unpaidColumns = [
    {
      header: 'Order ID',
      accessor: 'id' as keyof UnpaidOrder,
    },
    {
      header: 'Customer',
      accessor: 'customerName' as keyof UnpaidOrder,
    },
    {
      header: 'Order Date',
      accessor: (row: UnpaidOrder) => new Date(row.date).toLocaleDateString(),
    },
    {
      header: 'Wash Type',
      accessor: (row: UnpaidOrder) => (
        <span className={`px-2 py-1 text-xs rounded-full ${
          row.washType === 'express' ? 'bg-purple-100 text-purple-800' : 
          row.washType === 'standard' ? 'bg-blue-100 text-blue-800' : 
          'bg-green-100 text-green-800'
        }`}>
          {row.washType === 'express' ? 'Express Wash' : 
           row.washType === 'standard' ? 'Standard Wash' : 
           'Combined Wash'}
        </span>
      ),
    },
    {
      header: 'Amount',
      accessor: (row: UnpaidOrder) => formatIndianRupees(row.amount),
    },
    {
      header: 'Actions',
      accessor: (row: UnpaidOrder) => (
        <button
          onClick={() => openPaymentModal(row)}
          className="flex items-center px-3 py-1 text-sm bg-green-50 text-green-700 rounded-md hover:bg-green-100 transition-colors"
        >
          <CheckCircle className="h-4 w-4 mr-1" />
          <span>Mark as Paid</span>
        </button>
      ),
    }
  ];

  // Payment history columns
  const historyColumns = [
    {
      header: 'Payment ID',
      accessor: 'id' as keyof PaymentRecord,
    },
    {
      header: 'Order ID',
      accessor: 'orderId' as keyof PaymentRecord,
    },
    {
      header: 'Wash Type',
      accessor: (row: PaymentRecord) => (
        <span className={`px-2 py-1 text-xs rounded-full ${
          row.washType === 'express' ? 'bg-purple-100 text-purple-800' : 
          row.washType === 'standard' ? 'bg-blue-100 text-blue-800' : 
          'bg-green-100 text-green-800'
        }`}>
          {row.washType === 'express' ? 'Express Wash' : 
           row.washType === 'standard' ? 'Standard Wash' : 
           'Combined Wash'}
        </span>
      ),
    },
    {
      header: 'Amount',
      accessor: (row: PaymentRecord) => formatIndianRupees(row.amount),
    },
    {
      header: 'Payment Date',
      accessor: (row: PaymentRecord) => new Date(row.paymentDate).toLocaleDateString(),
    },
    {
      header: 'Reference No.',
      accessor: 'referenceNumber' as keyof PaymentRecord,
    }
  ];

  return (
    <AdminLayout>
      <PageHeader 
        title={studioId ? `${studioName} Payments` : "Laundry Studio Payments"} 
        subtitle={studioId ? `Manage payments for ${studioName}` : "Manage payments for all laundry studios"}
      >
        <button className="flex items-center px-4 py-2 bg-white border border-gray-200 rounded-md text-gray-700 hover:bg-gray-50 transition-colors">
          <Download className="h-4 w-4 mr-2" />
          <span>Export</span>
        </button>
      </PageHeader>
      
      {/* Payment summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        <StatsCard
          title="Total Unpaid Amount"
          value={formatIndianRupees(totalUnpaidAmount)}
          subtext={`${washTypeFilteredUnpaidOrders.length} orders pending`}
        />
        <StatsCard
          title="Express Wash Unpaid"
          value={formatIndianRupees(expressWashAmount)}
          subtext={`${expressWashCount} orders pending`}
        />
        <StatsCard
          title="Standard Wash Unpaid"
          value={formatIndianRupees(standardWashAmount)}
          subtext={`${standardWashCount} orders pending`}
        />
        <StatsCard
          title="Combined Wash Unpaid"
          value={formatIndianRupees(combinedWashAmount)}
          subtext={`${combinedWashCount} orders pending`}
        />
      </div>
      
      {/* Main Tabs - Unpaid vs History */}
      <Tabs defaultValue="unpaid" className="w-full" onValueChange={(value) => setViewType(value as 'unpaid' | 'history')}>
        <TabsList className="mb-6 bg-background border border-input">
          <TabsTrigger value="unpaid" className="flex-1">Unpaid Payments</TabsTrigger>
          <TabsTrigger value="history" className="flex-1">Payment History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="unpaid">
          {/* Wash Type Tabs for Unpaid Payments */}
          <Tabs defaultValue="all" className="w-full" onValueChange={(value) => setWashTypeFilter(value as 'all' | 'express' | 'standard' | 'combined')}>
            <TabsList className="bg-background border border-input mb-5">
              <TabsTrigger value="all">All Wash Types</TabsTrigger>
              <TabsTrigger value="express" className="text-purple-800">Express Wash</TabsTrigger>
              <TabsTrigger value="standard" className="text-blue-800">Standard Wash</TabsTrigger>
              <TabsTrigger value="combined" className="text-green-800">Combined Wash</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              <DataTable
                columns={unpaidColumns}
                data={washTypeFilteredUnpaidOrders}
                keyField="id"
                emptyMessage="No unpaid orders found"
              />
            </TabsContent>
            
            <TabsContent value="express">
              <DataTable
                columns={unpaidColumns}
                data={filteredUnpaidOrders.filter(order => order.washType === 'express')}
                keyField="id"
                emptyMessage="No unpaid express wash orders found"
              />
            </TabsContent>
            
            <TabsContent value="standard">
              <DataTable
                columns={unpaidColumns}
                data={filteredUnpaidOrders.filter(order => order.washType === 'standard')}
                keyField="id"
                emptyMessage="No unpaid standard wash orders found"
              />
            </TabsContent>
            
            <TabsContent value="combined">
              <DataTable
                columns={unpaidColumns}
                data={filteredUnpaidOrders.filter(order => order.washType === 'combined')}
                keyField="id"
                emptyMessage="No unpaid combined wash orders found"
              />
            </TabsContent>
          </Tabs>
        </TabsContent>
        
        <TabsContent value="history">
          {/* Wash Type Tabs for Payment History */}
          <Tabs defaultValue="all" className="w-full" onValueChange={(value) => setWashTypeFilter(value as 'all' | 'express' | 'standard' | 'combined')}>
            <TabsList className="bg-background border border-input mb-5">
              <TabsTrigger value="all">All Wash Types</TabsTrigger>
              <TabsTrigger value="express" className="text-purple-800">Express Wash</TabsTrigger>
              <TabsTrigger value="standard" className="text-blue-800">Standard Wash</TabsTrigger>
              <TabsTrigger value="combined" className="text-green-800">Combined Wash</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              <DataTable
                columns={historyColumns}
                data={filteredPaymentHistory}
                keyField="id"
                emptyMessage="No payment history found"
              />
            </TabsContent>
            
            <TabsContent value="express">
              <DataTable
                columns={historyColumns}
                data={filteredPaymentHistory.filter(payment => payment.washType === 'express')}
                keyField="id"
                emptyMessage="No express wash payment history found"
              />
            </TabsContent>
            
            <TabsContent value="standard">
              <DataTable
                columns={historyColumns}
                data={filteredPaymentHistory.filter(payment => payment.washType === 'standard')}
                keyField="id"
                emptyMessage="No standard wash payment history found"
              />
            </TabsContent>
            
            <TabsContent value="combined">
              <DataTable
                columns={historyColumns}
                data={filteredPaymentHistory.filter(payment => payment.washType === 'combined')}
                keyField="id"
                emptyMessage="No combined wash payment history found"
              />
            </TabsContent>
          </Tabs>
        </TabsContent>
      </Tabs>
      
      {/* Payment confirmation modal */}
      {showPaymentModal && selectedOrder && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-elevated w-full max-w-md p-6 animate-fade-in">
            <h3 className="text-lg font-semibold mb-4">Record Payment</h3>
            <p className="text-sm text-gray-500 mb-4">
              Recording payment for order <span className="font-medium">{selectedOrder.id}</span> from{' '}
              <span className="font-medium">{selectedOrder.studioName}</span>
            </p>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Amount
              </label>
              <div className="bg-gray-50 px-3 py-2 rounded-md border border-gray-200 text-gray-700">
                {formatIndianRupees(selectedOrder.amount)}
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Wash Type
              </label>
              <div className="bg-gray-50 px-3 py-2 rounded-md border border-gray-200 text-gray-700">
                {selectedOrder.washType === 'express' ? 'Express Wash' : 
                 selectedOrder.washType === 'standard' ? 'Standard Wash' : 
                 'Combined Wash'}
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bank Reference / UTR Number
              </label>
              <input
                type="text"
                value={paymentReference}
                onChange={(e) => setPaymentReference(e.target.value)}
                className="block w-full bg-white border border-gray-200 rounded-md py-2 px-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Enter reference number"
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Date
              </label>
              <input
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className="block w-full bg-white border border-gray-200 rounded-md py-2 px-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmPayment}
                className="px-4 py-2 text-sm bg-admin-primary text-white rounded-md hover:bg-opacity-90 transition-colors"
              >
                Confirm Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default StudioPayments;
