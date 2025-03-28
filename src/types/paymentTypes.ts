
export interface UnpaidOrder {
  id: string;
  studioId: number;
  studioName: string;
  date: string;
  amount: number;
  isPaid: boolean;
  washType: 'express' | 'standard' | 'combined';
  customerName: string;
  deliveredDate: string; // Changed from optional to required
  status: string; // Added status field
  selected?: boolean; // For multi-selection
  expressDelivery?: boolean; // Added express delivery indicator
}

export interface PaymentRecord {
  id: string;
  studioId: number;
  studioName: string;
  orderId: string;
  amount: number;
  paymentDate: string;
  referenceNumber: string;
  washType: 'express' | 'standard' | 'combined';
  deliveredDate: string;
  customerName: string; // Added missing field
  paymentMethod: string; // Added missing field
  status: string; // Added missing field
  expressDelivery?: boolean; // Added express delivery indicator
}

export type DateFilterOption = 'all' | 'today' | 'yesterday' | 'this_week' | 'this_month' | 'custom';

// New interface for service pricing
export interface ServicePricing {
  standardPrice: number;
  expressPrice: number;
}
