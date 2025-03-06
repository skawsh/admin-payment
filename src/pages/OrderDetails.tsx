import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../components/layout/AdminLayout';
import PageHeader from '../components/ui/PageHeader';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Info, Truck, User, DollarSign } from "lucide-react";
import { formatIndianRupees } from '@/utils/dateUtils';
import { initialUnpaidOrders, initialPaymentHistory } from '@/data/mockPaymentData';
import { UnpaidOrder, PaymentRecord } from '@/types/paymentTypes';
import { ScrollArea } from '@/components/ui/scroll-area';

const clothingItemsByOrderId: Record<string, {
  standard: {name: string, quantity: number}[],
  express: {name: string, quantity: number}[]
}> = {
  'ORD-1001': {
    standard: [
      {name: 'Shirt', quantity: 1},
      {name: 'Pant', quantity: 1},
    ],
    express: [
      {name: 'T-shirt', quantity: 1},
      {name: 'Shorts', quantity: 2},
    ]
  },
  'ORD-1002': {
    standard: [
      {name: 'Saree', quantity: 1},
    ],
    express: [
      {name: 'Blouse', quantity: 2},
      {name: 'Dress', quantity: 1},
    ]
  },
  'ORD-1003': {
    standard: [
      {name: 'Suit', quantity: 1},
      {name: 'Formal Shirt', quantity: 1},
    ],
    express: [
      {name: 'Tie', quantity: 2},
      {name: 'Formal Shirt', quantity: 2},
    ]
  },
  'ORD-1004': {
    standard: [
      {name: 'Jeans', quantity: 1},
      {name: 'Jacket', quantity: 1},
    ],
    express: [
      {name: 'T-shirt', quantity: 3},
      {name: 'Jeans', quantity: 1},
    ]
  },
  'ORD-1005': {
    standard: [
      {name: 'Kurta', quantity: 1},
      {name: 'Pajama', quantity: 1},
    ],
    express: [
      {name: 'Shawl', quantity: 1},
    ]
  },
  'ORD-1006': {
    standard: [
      {name: 'Sweater', quantity: 1},
      {name: 'Socks', quantity: 2},
    ],
    express: [
      {name: 'Sweater', quantity: 1},
      {name: 'Socks', quantity: 2},
      {name: 'Gloves', quantity: 1},
    ]
  },
};

const deliveryInfoByOrderId: Record<string, {assignedTo: string, vehicleDetails: string, phoneNumber: string, deliveryTime: string}> = {
  'ORD-1001': {
    assignedTo: 'Deepak Bagade',
    vehicleDetails: 'Maruti WagonR TS-08 JN 9988',
    phoneNumber: '9901362590',
    deliveryTime: '4:30 PM'
  },
  'ORD-1002': {
    assignedTo: 'Rahul Sharma',
    vehicleDetails: 'Honda Activa TS-09 KL 2345',
    phoneNumber: '8756423190',
    deliveryTime: '5:15 PM'
  },
  'ORD-1003': {
    assignedTo: 'Vinod Kumar',
    vehicleDetails: 'TVS Apache TS-10 AB 7721',
    phoneNumber: '9845123670',
    deliveryTime: '6:00 PM'
  },
  'ORD-1004': {
    assignedTo: 'Priya Singh',
    vehicleDetails: 'Bajaj Chetak TS-11 CD 5643',
    phoneNumber: '7789456123',
    deliveryTime: '3:45 PM'
  },
  'ORD-1005': {
    assignedTo: 'Amit Patel',
    vehicleDetails: 'Hero Splendor TS-12 EF 3321',
    phoneNumber: '9956784321',
    deliveryTime: '2:30 PM'
  },
  'ORD-1006': {
    assignedTo: 'Neha Gupta',
    vehicleDetails: 'Ola Electric TS-13 GH 9087',
    phoneNumber: '8890123456',
    deliveryTime: '5:45 PM'
  },
};

const customerInfoByOrderId: Record<string, {name: string, phone: string, address: string}> = {
  'ORD-1001': {
    name: 'Mahesh BM',
    phone: '8197739892',
    address: '306, Vasishaya Men\'s PG, Prashant Hills, Hyderabad-500032'
  },
  'ORD-1002': {
    name: 'Priya Sharma',
    phone: '9876543210',
    address: '42, Lake View Apartments, Jubilee Hills, Hyderabad-500033'
  },
  'ORD-1003': {
    name: 'Rahul Verma',
    phone: '7788990011',
    address: '204, Sunrise Towers, Banjara Hills, Hyderabad-500034'
  },
  'ORD-1004': {
    name: 'Ananya Patel',
    phone: '9988776655',
    address: '515, Green Valley, Gachibowli, Hyderabad-500035'
  },
  'ORD-1005': {
    name: 'Vikram Singh',
    phone: '8866554433',
    address: '78, Royal Enclave, Madhapur, Hyderabad-500081'
  },
  'ORD-1006': {
    name: 'Neha Reddy',
    phone: '7755669988',
    address: '323, Cyber Towers, Hitech City, Hyderabad-500086'
  },
};

const OrderDetails: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();

  const orderDetails = initialUnpaidOrders.find(order => order.id === orderId) || null;
  const paymentRecord = initialPaymentHistory.find(record => record.orderId === orderId) || null;

  const orderExists = orderDetails !== null || paymentRecord !== null;

  if (!orderExists) {
    return (
      <AdminLayout>
        <PageHeader 
          title="Order Not Found" 
          subtitle="The requested order could not be found"
          backButton={
            <Button
              variant="back"
              onClick={() => navigate(-1)}
              size="icon"
              className="mr-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          }
        />
        <div className="p-6 text-center">
          <p>The order you are looking for does not exist or has been removed.</p>
          <Button onClick={() => navigate(-1)} className="mt-4">Go Back</Button>
        </div>
      </AdminLayout>
    );
  }

  const orderData = orderDetails || {
    id: paymentRecord?.orderId || '',
    studioId: paymentRecord?.studioId || 0,
    studioName: paymentRecord?.studioName || '',
    date: paymentRecord?.deliveredDate || '',
    amount: paymentRecord?.amount || 0,
    isPaid: true,
    washType: paymentRecord?.washType || 'standard',
    customerName: paymentRecord?.customerName || '',
    deliveredDate: paymentRecord?.deliveredDate || '',
    status: 'completed'
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  };

  const getClothingItems = () => {
    return clothingItemsByOrderId[orderData.id] || clothingItemsByOrderId['ORD-1001'];
  };

  const getDeliveryInfo = () => {
    return deliveryInfoByOrderId[orderData.id] || deliveryInfoByOrderId['ORD-1001'];
  };

  const getCustomerInfo = () => {
    return customerInfoByOrderId[orderData.id] || customerInfoByOrderId['ORD-1001'];
  };

  const getWashTypeText = (washType: string | undefined) => {
    if (washType === 'express') return 'Express Wash';
    if (washType === 'standard') return 'Standard Wash';
    if (washType === 'combined') return 'Standard Wash & Express Wash';
    return 'Standard Wash';
  };

  const getPerKgRate = (type: 'standard' | 'express') => {
    return type === 'standard' ? 49 : 69; // Express wash is more expensive
  };

  const getTotalWeight = () => {
    return 2.5;
  };

  const calculateDeliveryDate = (orderDate: string, washType: 'express' | 'standard' | 'combined' | undefined): string => {
    if (!orderDate) return '';
    
    const date = new Date(orderDate);
    
    if (washType === 'express') {
      date.setDate(date.getDate() + 1);
    } else {
      date.setDate(date.getDate() + 4);
    }
    
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  };

  const isCombinedWash = orderData.washType === 'combined';
  const showExpressWash = orderData.washType === 'express' || isCombinedWash;
  const showStandardWash = orderData.washType === 'standard' || isCombinedWash;

  const standardAmount = showStandardWash ? getTotalWeight() * getPerKgRate('standard') : 0;
  const expressAmount = showExpressWash ? getTotalWeight() * getPerKgRate('express') : 0;
  const totalAmount = standardAmount + expressAmount;

  const isPaid = paymentRecord !== null;
  const paymentInfo = paymentRecord ? {
    paymentDate: formatDate(paymentRecord.paymentDate),
    paymentMethod: paymentRecord.paymentMethod,
    referenceNumber: paymentRecord.referenceNumber,
    status: paymentRecord.status
  } : null;

  return (
    <AdminLayout>
      <PageHeader 
        title={`Order Details: ${orderData.id}`} 
        subtitle={`View details for order ${orderData.id}`}
        backButton={
          <Button
            variant="back"
            onClick={() => navigate(-1)}
            size="icon"
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        }
      />

      <ScrollArea className="h-[calc(100vh-120px)]">
        <div className="container mx-auto p-6 space-y-6">
          <div className="space-y-6">
            <Card className="border-green-100 rounded-xl overflow-hidden shadow-sm">
              <div className="bg-green-100 py-2 px-4 flex items-center">
                <Info className="h-5 w-5 mr-2 text-green-800" />
                <h3 className="text-md font-medium text-green-800">Order Information</h3>
              </div>
              <CardContent className="p-4 text-sm space-y-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-600">Order ID - </span>
                    <span className="font-medium">{orderData.id}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Ordered Date - </span>
                    <span className="font-medium">{formatDate(orderData.date)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Order Delivered date - </span>
                    <span className="font-medium">{calculateDeliveryDate(orderData.date, orderData.washType as any)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Wash Type - </span>
                    <span className="font-medium text-red-600">{getWashTypeText(orderData.washType)}</span>
                  </div>
                  {isPaid && paymentInfo && (
                    <>
                      <div>
                        <span className="text-gray-600">Payment Status - </span>
                        <span className="font-medium text-green-600">Paid</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Payment Date - </span>
                        <span className="font-medium">{paymentInfo.paymentDate}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Payment Method - </span>
                        <span className="font-medium">{paymentInfo.paymentMethod}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Reference Number - </span>
                        <span className="font-medium">{paymentInfo.referenceNumber}</span>
                      </div>
                    </>
                  )}
                  {!isPaid && (
                    <div>
                      <span className="text-gray-600">Payment Status - </span>
                      <span className="font-medium text-yellow-600">Unpaid</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-green-100 rounded-xl overflow-hidden shadow-sm">
              <div className="bg-green-100 py-2 px-4 flex items-center">
                <User className="h-5 w-5 mr-2 text-green-800" />
                <h3 className="text-md font-medium text-green-800">Customer Information</h3>
              </div>
              <CardContent className="p-4 text-sm space-y-2">
                <div>
                  <span className="text-gray-600">Customer Name - </span>
                  <span className="font-medium">{getCustomerInfo().name}</span>
                </div>
                <div>
                  <span className="text-gray-600">Number - </span>
                  <span className="font-medium">{getCustomerInfo().phone}</span>
                </div>
                <div>
                  <span className="text-gray-600">Address - </span>
                  <span className="font-medium">{getCustomerInfo().address}</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-green-100 rounded-xl overflow-hidden shadow-sm">
              <div className="bg-green-100 py-2 px-4 flex items-center">
                <DollarSign className="h-5 w-5 mr-2 text-green-800" />
                <h3 className="text-md font-medium text-green-800">Services Information</h3>
              </div>
              <CardContent className="p-4 text-sm">
                <div className="mb-3">
                  <span className="text-gray-600">Wash Type - </span>
                  <span className="font-medium text-red-600">{getWashTypeText(orderData.washType)}</span>
                </div>
                
                {showStandardWash && (
                  <div className="border-b border-gray-200 mb-3">
                    <div className="font-medium mb-2 text-blue-700">Standard Wash</div>
                    <div className="grid grid-cols-3 gap-1 font-medium mb-2">
                      <div>Services</div>
                      <div>Quantity</div>
                      <div className="text-right">Price</div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-1 mb-2">
                      <div>1. Wash & Fold</div>
                      <div>{getTotalWeight()} X {getPerKgRate('standard')}/kg</div>
                      <div className="text-right">{formatIndianRupees(getTotalWeight() * getPerKgRate('standard'))}</div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="font-medium mb-2">Clothing Items</div>
                      <div className="flex flex-col gap-1">
                        {getClothingItems().standard.map((item, index) => (
                          <div key={index} className="ml-2">
                            {index + 1}. {item.name} ({item.quantity})
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                
                {showExpressWash && (
                  <div className="border-b border-gray-200 mb-3">
                    <div className="font-medium mb-2 text-purple-700">Express Wash</div>
                    <div className="grid grid-cols-3 gap-1 font-medium mb-2">
                      <div>Services</div>
                      <div>Quantity</div>
                      <div className="text-right">Price</div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-1 mb-2">
                      <div>1. Express Wash & Fold</div>
                      <div>{getTotalWeight()} X {getPerKgRate('express')}/kg</div>
                      <div className="text-right">{formatIndianRupees(getTotalWeight() * getPerKgRate('express'))}</div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="font-medium mb-2">Clothing Items</div>
                      <div className="flex flex-col gap-1">
                        {getClothingItems().express.map((item, index) => (
                          <div key={index} className="ml-2">
                            {index + 1}. {item.name} ({item.quantity})
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex justify-between font-medium border-t border-gray-200 pt-3 text-base">
                  <div>Total</div>
                  <div>{formatIndianRupees(totalAmount)}</div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-green-100 rounded-xl overflow-hidden shadow-sm">
              <div className="bg-green-100 py-2 px-4 flex items-center">
                <Truck className="h-5 w-5 mr-2 text-green-800" />
                <h3 className="text-md font-medium text-green-800">Delivery Information</h3>
              </div>
              <CardContent className="p-4 text-sm space-y-2">
                <div>
                  <span className="text-gray-600">Assigned to - </span>
                  <span className="font-medium">{getDeliveryInfo().assignedTo} / {getDeliveryInfo().phoneNumber}</span>
                </div>
                <div>
                  <span className="text-gray-600">Delivered date & time - </span>
                  <span className="font-medium">
                    {calculateDeliveryDate(orderData.date, orderData.washType)} at {getDeliveryInfo().deliveryTime}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Vehicle details - </span>
                  <span className="font-medium">{getDeliveryInfo().vehicleDetails}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </ScrollArea>
    </AdminLayout>
  );
};

export default OrderDetails;
