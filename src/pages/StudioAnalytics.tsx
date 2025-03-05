
import React, { useState } from 'react';
import { ChevronLeft, Calendar, Clock, Clipboard, DollarSign, Star, ShoppingBag, Users, ChevronDown } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import AdminLayout from '../components/layout/AdminLayout';
import StatsCard from '../components/ui/StatsCard';
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/ui/PageHeader";

// Studio data type
interface StudioAnalytics {
  id: number;
  name: string;
  totalOrders: number;
  totalRevenue: number;
  avgTurnaroundTime: string;
  rating: number;
  customerSatisfaction: number;
  cancellationRate: number;
  activeCustomers: number;
  monthlyStats: {
    month: string;
    orders: number;
    revenue: number;
  }[];
  popularServices: {
    service: string;
    percentage: number;
  }[];
  servicePerformance: {
    service: string;
    revenue: number;
    growth: number;
    orders: number;
  }[];
  customerDemographics: {
    ageGroup: string;
    percentage: number;
  }[];
  peakHours: {
    time: string;
    orders: number;
  }[];
  recentReviews: {
    customerName: string;
    rating: number;
    comment: string;
    date: string;
  }[];
}

// Sample data - now using string keys to match the router param format
const studioData: Record<string, StudioAnalytics> = {
  "1": {
    id: 1,
    name: "Saiteja Laundry",
    totalOrders: 325,
    totalRevenue: 12580,
    avgTurnaroundTime: "2.3 hrs",
    rating: 4.5,
    customerSatisfaction: 92,
    cancellationRate: 3.2,
    activeCustomers: 145,
    monthlyStats: [
      { month: "Jan", orders: 45, revenue: 1750 },
      { month: "Feb", orders: 52, revenue: 2050 },
      { month: "Mar", orders: 48, revenue: 1880 },
      { month: "Apr", orders: 55, revenue: 2150 },
      { month: "May", orders: 68, revenue: 2380 },
      { month: "Jun", orders: 57, revenue: 2370 }
    ],
    popularServices: [
      { service: "Wash & Fold", percentage: 45 },
      { service: "Dry Cleaning", percentage: 28 },
      { service: "Ironing", percentage: 18 },
      { service: "Others", percentage: 9 }
    ],
    servicePerformance: [
      { service: "Wash & Fold", revenue: 5661, growth: 12, orders: 146 },
      { service: "Dry Cleaning", revenue: 3522, growth: 8, orders: 91 },
      { service: "Ironing", revenue: 2264, growth: -3, orders: 59 },
      { service: "Premium Cleaning", revenue: 1133, growth: 22, orders: 29 }
    ],
    customerDemographics: [
      { ageGroup: "18-24", percentage: 18 },
      { ageGroup: "25-34", percentage: 42 },
      { ageGroup: "35-44", percentage: 25 },
      { ageGroup: "45-54", percentage: 10 },
      { ageGroup: "55+", percentage: 5 }
    ],
    peakHours: [
      { time: "8 AM - 10 AM", orders: 42 },
      { time: "10 AM - 12 PM", orders: 58 },
      { time: "12 PM - 2 PM", orders: 75 },
      { time: "2 PM - 4 PM", orders: 68 },
      { time: "4 PM - 6 PM", orders: 82 }
    ],
    recentReviews: [
      { customerName: "Priya M.", rating: 5, comment: "Excellent service! My clothes came back perfectly clean.", date: "2 days ago" },
      { customerName: "Raj K.", rating: 4, comment: "Good service, but delivery was slightly delayed.", date: "5 days ago" },
      { customerName: "Ananya S.", rating: 5, comment: "Love how they handle delicate fabrics. Will use again!", date: "1 week ago" },
      { customerName: "Vikram T.", rating: 4, comment: "Professional service and reasonable pricing.", date: "2 weeks ago" }
    ]
  },
  "2": {
    id: 2,
    name: "Sparkle Clean Laundry",
    totalOrders: 287,
    totalRevenue: 10950,
    avgTurnaroundTime: "2.5 hrs",
    rating: 4.7,
    customerSatisfaction: 95,
    cancellationRate: 2.1,
    activeCustomers: 132,
    monthlyStats: [
      { month: "Jan", orders: 42, revenue: 1650 },
      { month: "Feb", orders: 46, revenue: 1800 },
      { month: "Mar", orders: 51, revenue: 1950 },
      { month: "Apr", orders: 49, revenue: 1900 },
      { month: "May", orders: 54, revenue: 2050 },
      { month: "Jun", orders: 45, revenue: 1600 }
    ],
    popularServices: [
      { service: "Wash & Fold", percentage: 38 },
      { service: "Dry Cleaning", percentage: 32 },
      { service: "Ironing", percentage: 22 },
      { service: "Others", percentage: 8 }
    ],
    servicePerformance: [
      { service: "Wash & Fold", revenue: 4161, growth: 9, orders: 109 },
      { service: "Dry Cleaning", revenue: 3504, growth: 15, orders: 92 },
      { service: "Ironing", revenue: 2409, growth: 5, orders: 63 },
      { service: "Premium Cleaning", revenue: 876, growth: 18, orders: 23 }
    ],
    customerDemographics: [
      { ageGroup: "18-24", percentage: 15 },
      { ageGroup: "25-34", percentage: 38 },
      { ageGroup: "35-44", percentage: 28 },
      { ageGroup: "45-54", percentage: 12 },
      { ageGroup: "55+", percentage: 7 }
    ],
    peakHours: [
      { time: "8 AM - 10 AM", orders: 35 },
      { time: "10 AM - 12 PM", orders: 48 },
      { time: "12 PM - 2 PM", orders: 62 },
      { time: "2 PM - 4 PM", orders: 59 },
      { time: "4 PM - 6 PM", orders: 83 }
    ],
    recentReviews: [
      { customerName: "Arun P.", rating: 5, comment: "Best laundry service in the area! Very professional.", date: "3 days ago" },
      { customerName: "Meera S.", rating: 5, comment: "They treat my clothes with care. Very satisfied.", date: "6 days ago" },
      { customerName: "Karthik R.", rating: 4, comment: "Good service overall, just wish they had longer hours.", date: "1 week ago" },
      { customerName: "Divya N.", rating: 5, comment: "Fantastic service! My clothes look brand new.", date: "2 weeks ago" }
    ]
  },
  "3": {
    id: 3,
    name: "Fresh Fold Services",
    totalOrders: 216,
    totalRevenue: 85600,
    avgTurnaroundTime: "2.0 hrs",
    rating: 4.2,
    customerSatisfaction: 87,
    cancellationRate: 4.5,
    activeCustomers: 98,
    monthlyStats: [
      { month: "Jan", orders: 32, revenue: 12800 },
      { month: "Feb", orders: 35, revenue: 13800 },
      { month: "Mar", orders: 38, revenue: 14900 },
      { month: "Apr", orders: 36, revenue: 14200 },
      { month: "May", orders: 40, revenue: 15700 },
      { month: "Jun", orders: 35, revenue: 14200 }
    ],
    popularServices: [
      { service: "Wash & Fold", percentage: 42 },
      { service: "Dry Cleaning", percentage: 25 },
      { service: "Ironing", percentage: 24 },
      { service: "Others", percentage: 9 }
    ],
    servicePerformance: [
      { service: "Wash & Fold", revenue: 35952, growth: 6, orders: 91 },
      { service: "Dry Cleaning", revenue: 21400, growth: -2, orders: 54 },
      { service: "Ironing", revenue: 20544, growth: 8, orders: 52 },
      { service: "Premium Cleaning", revenue: 7704, growth: 14, orders: 19 }
    ],
    customerDemographics: [
      { ageGroup: "18-24", percentage: 20 },
      { ageGroup: "25-34", percentage: 35 },
      { ageGroup: "35-44", percentage: 25 },
      { ageGroup: "45-54", percentage: 12 },
      { ageGroup: "55+", percentage: 8 }
    ],
    peakHours: [
      { time: "8 AM - 10 AM", orders: 38 },
      { time: "10 AM - 12 PM", orders: 45 },
      { time: "12 PM - 2 PM", orders: 58 },
      { time: "2 PM - 4 PM", orders: 42 },
      { time: "4 PM - 6 PM", orders: 33 }
    ],
    recentReviews: [
      { customerName: "Sanjay T.", rating: 4, comment: "Good service but could be faster", date: "3 days ago" },
      { customerName: "Priti L.", rating: 5, comment: "Excellent cleaning quality", date: "1 week ago" },
      { customerName: "Rahul G.", rating: 3, comment: "Average service, delivery was late", date: "1 week ago" },
      { customerName: "Neha S.", rating: 5, comment: "Very professional staff", date: "2 weeks ago" }
    ]
  },
  "4": {
    id: 4,
    name: "Royal Wash",
    totalOrders: 298,
    totalRevenue: 118200,
    avgTurnaroundTime: "2.7 hrs",
    rating: 4.8,
    customerSatisfaction: 96,
    cancellationRate: 1.8,
    activeCustomers: 156,
    monthlyStats: [
      { month: "Jan", orders: 46, revenue: 18200 },
      { month: "Feb", orders: 48, revenue: 19100 },
      { month: "Mar", orders: 52, revenue: 20600 },
      { month: "Apr", orders: 49, revenue: 19400 },
      { month: "May", orders: 54, revenue: 21300 },
      { month: "Jun", orders: 49, revenue: 19600 }
    ],
    popularServices: [
      { service: "Wash & Fold", percentage: 40 },
      { service: "Dry Cleaning", percentage: 35 },
      { service: "Ironing", percentage: 15 },
      { service: "Others", percentage: 10 }
    ],
    servicePerformance: [
      { service: "Wash & Fold", revenue: 47280, growth: 15, orders: 119 },
      { service: "Dry Cleaning", revenue: 41370, growth: 12, orders: 104 },
      { service: "Ironing", revenue: 17730, growth: 4, orders: 45 },
      { service: "Premium Cleaning", revenue: 11820, growth: 25, orders: 30 }
    ],
    customerDemographics: [
      { ageGroup: "18-24", percentage: 10 },
      { ageGroup: "25-34", percentage: 45 },
      { ageGroup: "35-44", percentage: 30 },
      { ageGroup: "45-54", percentage: 10 },
      { ageGroup: "55+", percentage: 5 }
    ],
    peakHours: [
      { time: "8 AM - 10 AM", orders: 45 },
      { time: "10 AM - 12 PM", orders: 62 },
      { time: "12 PM - 2 PM", orders: 75 },
      { time: "2 PM - 4 PM", orders: 66 },
      { time: "4 PM - 6 PM", orders: 50 }
    ],
    recentReviews: [
      { customerName: "Vivek M.", rating: 5, comment: "Premium service! Worth every penny", date: "1 day ago" },
      { customerName: "Smita R.", rating: 5, comment: "The best laundry service in town", date: "4 days ago" },
      { customerName: "Akash P.", rating: 4, comment: "Great service, professional staff", date: "1 week ago" },
      { customerName: "Tanvi S.", rating: 5, comment: "My clothes look brand new", date: "2 weeks ago" }
    ]
  },
  "5": {
    id: 5,
    name: "Urban Laundromat",
    totalOrders: 176,
    totalRevenue: 68900,
    avgTurnaroundTime: "3.0 hrs",
    rating: 3.9,
    customerSatisfaction: 82,
    cancellationRate: 5.2,
    activeCustomers: 85,
    monthlyStats: [
      { month: "Jan", orders: 25, revenue: 9800 },
      { month: "Feb", orders: 28, revenue: 10900 },
      { month: "Mar", orders: 30, revenue: 11700 },
      { month: "Apr", orders: 31, revenue: 12100 },
      { month: "May", orders: 33, revenue: 12900 },
      { month: "Jun", orders: 29, revenue: 11500 }
    ],
    popularServices: [
      { service: "Wash & Fold", percentage: 50 },
      { service: "Dry Cleaning", percentage: 20 },
      { service: "Ironing", percentage: 20 },
      { service: "Others", percentage: 10 }
    ],
    servicePerformance: [
      { service: "Wash & Fold", revenue: 34450, growth: 3, orders: 88 },
      { service: "Dry Cleaning", revenue: 13780, growth: -5, orders: 35 },
      { service: "Ironing", revenue: 13780, growth: 0, orders: 35 },
      { service: "Premium Cleaning", revenue: 6890, growth: 10, orders: 18 }
    ],
    customerDemographics: [
      { ageGroup: "18-24", percentage: 25 },
      { ageGroup: "25-34", percentage: 30 },
      { ageGroup: "35-44", percentage: 20 },
      { ageGroup: "45-54", percentage: 15 },
      { ageGroup: "55+", percentage: 10 }
    ],
    peakHours: [
      { time: "8 AM - 10 AM", orders: 30 },
      { time: "10 AM - 12 PM", orders: 35 },
      { time: "12 PM - 2 PM", orders: 42 },
      { time: "2 PM - 4 PM", orders: 40 },
      { time: "4 PM - 6 PM", orders: 29 }
    ],
    recentReviews: [
      { customerName: "Deepak J.", rating: 3, comment: "Service is okay, nothing special", date: "2 days ago" },
      { customerName: "Kavita N.", rating: 4, comment: "Clean clothes but takes time", date: "5 days ago" },
      { customerName: "Mohan K.", rating: 4, comment: "Good service for regular clothes", date: "1 week ago" },
      { customerName: "Leela P.", rating: 3, comment: "Average service but convenient location", date: "2 weeks ago" }
    ]
  },
  "6": {
    id: 6,
    name: "Quick & Clean",
    totalOrders: 210,
    totalRevenue: 89300,
    avgTurnaroundTime: "2.0 hrs",
    rating: 4.3,
    customerSatisfaction: 89,
    cancellationRate: 3.5,
    activeCustomers: 125,
    monthlyStats: [
      { month: "Jan", orders: 32, revenue: 13600 },
      { month: "Feb", orders: 35, revenue: 14900 },
      { month: "Mar", orders: 38, revenue: 16200 },
      { month: "Apr", orders: 34, revenue: 14500 },
      { month: "May", orders: 37, revenue: 15700 },
      { month: "Jun", orders: 34, revenue: 14400 }
    ],
    popularServices: [
      { service: "Wash & Fold", percentage: 45 },
      { service: "Dry Cleaning", percentage: 25 },
      { service: "Ironing", percentage: 20 },
      { service: "Others", percentage: 10 }
    ],
    servicePerformance: [
      { service: "Wash & Fold", revenue: 40185, growth: 8, orders: 95 },
      { service: "Dry Cleaning", revenue: 22325, growth: 5, orders: 52 },
      { service: "Ironing", revenue: 17860, growth: 10, orders: 42 },
      { service: "Premium Cleaning", revenue: 8930, growth: 18, orders: 21 }
    ],
    customerDemographics: [
      { ageGroup: "18-24", percentage: 20 },
      { ageGroup: "25-34", percentage: 40 },
      { ageGroup: "35-44", percentage: 25 },
      { ageGroup: "45-54", percentage: 10 },
      { ageGroup: "55+", percentage: 5 }
    ],
    peakHours: [
      { time: "8 AM - 10 AM", orders: 35 },
      { time: "10 AM - 12 PM", orders: 45 },
      { time: "12 PM - 2 PM", orders: 55 },
      { time: "2 PM - 4 PM", orders: 48 },
      { time: "4 PM - 6 PM", orders: 27 }
    ],
    recentReviews: [
      { customerName: "Raman S.", rating: 4, comment: "Fast service as promised", date: "2 days ago" },
      { customerName: "Anita G.", rating: 5, comment: "Very efficient and professional", date: "6 days ago" },
      { customerName: "Karan M.", rating: 4, comment: "Good quality cleaning", date: "1 week ago" },
      { customerName: "Preeti D.", rating: 4, comment: "Reliable and consistent service", date: "2 weeks ago" }
    ]
  },
  "7": {
    id: 7,
    name: "Wash Masters",
    totalOrders: 265,
    totalRevenue: 103200,
    avgTurnaroundTime: "2.3 hrs",
    rating: 4.6,
    customerSatisfaction: 94,
    cancellationRate: 2.2,
    activeCustomers: 140,
    monthlyStats: [
      { month: "Jan", orders: 40, revenue: 15600 },
      { month: "Feb", orders: 43, revenue: 16800 },
      { month: "Mar", orders: 47, revenue: 18300 },
      { month: "Apr", orders: 44, revenue: 17200 },
      { month: "May", orders: 48, revenue: 18700 },
      { month: "Jun", orders: 43, revenue: 16600 }
    ],
    popularServices: [
      { service: "Wash & Fold", percentage: 35 },
      { service: "Dry Cleaning", percentage: 40 },
      { service: "Ironing", percentage: 15 },
      { service: "Others", percentage: 10 }
    ],
    servicePerformance: [
      { service: "Wash & Fold", revenue: 36120, growth: 12, orders: 93 },
      { service: "Dry Cleaning", revenue: 41280, growth: 15, orders: 106 },
      { service: "Ironing", revenue: 15480, growth: 5, orders: 40 },
      { service: "Premium Cleaning", revenue: 10320, growth: 20, orders: 26 }
    ],
    customerDemographics: [
      { ageGroup: "18-24", percentage: 15 },
      { ageGroup: "25-34", percentage: 40 },
      { ageGroup: "35-44", percentage: 30 },
      { ageGroup: "45-54", percentage: 10 },
      { ageGroup: "55+", percentage: 5 }
    ],
    peakHours: [
      { time: "8 AM - 10 AM", orders: 40 },
      { time: "10 AM - 12 PM", orders: 55 },
      { time: "12 PM - 2 PM", orders: 65 },
      { time: "2 PM - 4 PM", orders: 60 },
      { time: "4 PM - 6 PM", orders: 45 }
    ],
    recentReviews: [
      { customerName: "Anil T.", rating: 5, comment: "Top notch service, very professional", date: "3 days ago" },
      { customerName: "Shweta K.", rating: 4, comment: "Great service, minor delay in delivery", date: "5 days ago" },
      { customerName: "Pramod R.", rating: 5, comment: "Excellent cleaning quality", date: "1 week ago" },
      { customerName: "Sunita P.", rating: 5, comment: "Very satisfied with the service", date: "2 weeks ago" }
    ]
  },
  "8": {
    id: 8,
    name: "Pristine Garments",
    totalOrders: 154,
    totalRevenue: 61800,
    avgTurnaroundTime: "3.5 hrs",
    rating: 4.0,
    customerSatisfaction: 84,
    cancellationRate: 4.8,
    activeCustomers: 75,
    monthlyStats: [
      { month: "Jan", orders: 22, revenue: 8800 },
      { month: "Feb", orders: 24, revenue: 9600 },
      { month: "Mar", orders: 26, revenue: 10400 },
      { month: "Apr", orders: 28, revenue: 11200 },
      { month: "May", orders: 30, revenue: 12000 },
      { month: "Jun", orders: 24, revenue: 9800 }
    ],
    popularServices: [
      { service: "Wash & Fold", percentage: 30 },
      { service: "Dry Cleaning", percentage: 45 },
      { service: "Ironing", percentage: 15 },
      { service: "Others", percentage: 10 }
    ],
    servicePerformance: [
      { service: "Wash & Fold", revenue: 18540, growth: 2, orders: 46 },
      { service: "Dry Cleaning", revenue: 27810, growth: 8, orders: 69 },
      { service: "Ironing", revenue: 9270, growth: -2, orders: 23 },
      { service: "Premium Cleaning", revenue: 6180, growth: 12, orders: 16 }
    ],
    customerDemographics: [
      { ageGroup: "18-24", percentage: 10 },
      { ageGroup: "25-34", percentage: 30 },
      { ageGroup: "35-44", percentage: 35 },
      { ageGroup: "45-54", percentage: 15 },
      { ageGroup: "55+", percentage: 10 }
    ],
    peakHours: [
      { time: "8 AM - 10 AM", orders: 25 },
      { time: "10 AM - 12 PM", orders: 30 },
      { time: "12 PM - 2 PM", orders: 40 },
      { time: "2 PM - 4 PM", orders: 35 },
      { time: "4 PM - 6 PM", orders: 24 }
    ],
    recentReviews: [
      { customerName: "Girish M.", rating: 4, comment: "Good for premium clothes", date: "4 days ago" },
      { customerName: "Renuka S.", rating: 3, comment: "Decent service but takes too long", date: "1 week ago" },
      { customerName: "Jai P.", rating: 5, comment: "Excellent dry cleaning service", date: "10 days ago" },
      { customerName: "Maya L.", rating: 4, comment: "Good quality cleaning", date: "2 weeks ago" }
    ]
  }
};

const StudioAnalytics: React.FC = () => {
  const { studioId } = useParams<{ studioId: string }>();
  const [timeRange, setTimeRange] = useState<string>("30days");
  const { toast } = useToast();
  
  // Make sure to find the studio using the studioId parameter
  const studio = studioId ? studioData[studioId] : undefined;
  
  if (!studio) {
    return (
      <AdminLayout>
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Studio Not Found</h3>
            <p className="text-sm text-gray-500 mb-4">The requested studio could not be found.</p>
            <Link 
              to="/studios"
              className="inline-flex items-center px-4 py-2 bg-admin-primary text-white rounded-md hover:bg-opacity-90 transition-colors"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Studios
            </Link>
          </div>
        </div>
      </AdminLayout>
    );
  }
  
  // Handle time range change
  const handleTimeRangeChange = (range: string) => {
    setTimeRange(range);
    toast({
      title: "Time Range Changed",
      description: `Analytics data now showing for: ${range}`,
      duration: 2000,
    });
  };
  
  // Render star rating
  const renderStarRating = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            size={14} 
            className={i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : 
                      i < rating ? "fill-yellow-400 text-yellow-400 opacity-50" : 
                      "fill-gray-200 text-gray-200"} 
          />
        ))}
        <span className="ml-1 text-xs text-gray-500">({rating})</span>
      </div>
    );
  };

  return (
    <AdminLayout>
      <PageHeader
        title={studio.name}
        subtitle="Analytics Dashboard"
        backButton={
          <Link to="/studios">
            <Button size="icon" variant="back">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>
        }
      >
        <div className="flex items-center space-x-2">
          <div className="relative">
            <select
              value={timeRange}
              onChange={(e) => handleTimeRangeChange(e.target.value)}
              className="appearance-none bg-white border border-gray-200 rounded-md py-2 pl-3 pr-10 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
              <option value="6months">Last 6 Months</option>
              <option value="1year">Last Year</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </div>
          </div>
          
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            <span>Custom Range</span>
          </Button>
        </div>
      </PageHeader>
      
      {/* Key performance indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatsCard
          title="Total Orders"
          value={studio.totalOrders.toString()}
          icon={<ShoppingBag className="h-5 w-5" />}
          change={{ value: "+8%", trend: "up" }}
        />
        <StatsCard
          title="Total Revenue"
          value={`$${studio.totalRevenue.toLocaleString()}`}
          icon={<DollarSign className="h-5 w-5" />}
          change={{ value: "+12%", trend: "up" }}
        />
        <StatsCard
          title="Avg. Turnaround Time"
          value={studio.avgTurnaroundTime}
          icon={<Clock className="h-5 w-5" />}
          change={{ value: "-5%", trend: "up" }}
        />
        <StatsCard
          title="Active Customers"
          value={studio.activeCustomers.toString()}
          icon={<Users className="h-5 w-5" />}
          change={{ value: "+14%", trend: "up" }}
        />
      </div>
      
      {/* Performance metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Monthly Order & Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 border-b border-gray-100 mb-4">
              {/* In a real app, this would be a line or bar chart showing the trend */}
              <div className="h-full flex items-center justify-center border border-dashed border-gray-200 rounded-lg">
                <div className="text-center">
                  <p className="text-sm text-gray-500">Chart placeholder - Monthly trend</p>
                  <p className="text-xs text-gray-400 mt-1">Orders and revenue over time</p>
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Total Orders (Period)</p>
                <p className="text-xl font-medium">{studio.totalOrders}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Revenue (Period)</p>
                <p className="text-xl font-medium">${studio.totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Customer Satisfaction Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center mb-1">
                  <Star className="h-4 w-4 text-yellow-500 mr-1" />
                  <p className="text-sm font-medium text-gray-700">Rating</p>
                </div>
                <p className="text-2xl font-semibold">{studio.rating}<span className="text-lg">/5</span></p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center mb-1">
                  <Users className="h-4 w-4 text-blue-500 mr-1" />
                  <p className="text-sm font-medium text-gray-700">Satisfaction</p>
                </div>
                <p className="text-2xl font-semibold">{studio.customerSatisfaction}%</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <p className="text-sm text-gray-700">Cancellation Rate</p>
                  <p className="text-sm font-medium">{studio.cancellationRate}%</p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-red-400 h-2 rounded-full" 
                    style={{ width: `${studio.cancellationRate * 3}%` }} 
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <p className="text-sm text-gray-700">On-time Delivery</p>
                  <p className="text-sm font-medium">{96 - studio.cancellationRate}%</p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-400 h-2 rounded-full" 
                    style={{ width: `${96 - studio.cancellationRate}%` }} 
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Popular Services</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {studio.popularServices.map((service, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-sm text-gray-700">{service.service}</p>
                    <p className="text-sm font-medium">{service.percentage}%</p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        index === 0 ? 'bg-blue-400' : 
                        index === 1 ? 'bg-purple-400' : 
                        index === 2 ? 'bg-green-400' : 'bg-yellow-400'
                      }`} 
                      style={{ width: `${service.percentage}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((_, index) => (
                <div key={index} className="flex items-start space-x-3 pb-4 border-b border-gray-100 last:border-0">
                  <div className="bg-gray-100 rounded-full h-10 w-10 flex items-center justify-center text-gray-500">
                    <Clipboard className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">
                      Order #{Math.floor(10000 + Math.random() * 90000)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {index === 0 ? 'Today' : index === 1 ? 'Yesterday' : `${index + 1} days ago`} • 
                      ${Math.floor(20 + Math.random() * 50)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Button variant="link" className="text-admin-primary">
                View All Orders
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* New sections with additional data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Service Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full min-w-full">
                <thead>
                  <tr className="text-left border-b border-gray-200">
                    <th className="pb-2 font-medium text-xs text-gray-500">SERVICE</th>
                    <th className="pb-2 font-medium text-xs text-gray-500">REVENUE</th>
                    <th className="pb-2 font-medium text-xs text-gray-500">GROWTH</th>
                    <th className="pb-2 font-medium text-xs text-gray-500">ORDERS</th>
                  </tr>
                </thead>
                <tbody>
                  {studio.servicePerformance.map((service, idx) => (
                    <tr key={idx} className="border-b border-gray-100 last:border-0">
                      <td className="py-3 text-sm font-medium">{service.service}</td>
                      <td className="py-3 text-sm">${service.revenue}</td>
                      <td className="py-3 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          service.growth > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {service.growth > 0 ? '+' : ''}{service.growth}%
                        </span>
                      </td>
                      <td className="py-3 text-sm">{service.orders}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Customer Demographics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 border-b border-gray-100 mb-4">
              {/* In a real app, this would be a pie or donut chart */}
              <div className="h-full flex items-center justify-center border border-dashed border-gray-200 rounded-lg">
                <div className="text-center">
                  <p className="text-sm text-gray-500">Chart placeholder - Age demographics</p>
                  <p className="text-xs text-gray-400 mt-1">Customer distribution by age</p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              {studio.customerDemographics.map((group, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-sm text-gray-700">{group.ageGroup}</p>
                    <p className="text-sm font-medium">{group.percentage}%</p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-indigo-400 h-2 rounded-full" 
                      style={{ width: `${group.percentage}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Peak Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 border-b border-gray-100 mb-4">
              {/* In a real app, this would be a bar chart */}
              <div className="h-full flex items-center justify-center border border-dashed border-gray-200 rounded-lg">
                <div className="text-center">
                  <p className="text-sm text-gray-500">Chart placeholder - Order distribution</p>
                  <p className="text-xs text-gray-400 mt-1">Orders by time of day</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {studio.peakHours.map((peak, idx) => (
                <div key={idx} className="text-center">
                  <div className="h-24 bg-gray-50 rounded-md relative overflow-hidden">
                    <div 
                      className="absolute bottom-0 left-0 right-0 bg-amber-400" 
                      style={{ height: `${(peak.orders / 100) * 100}%` }} 
                    ></div>
                  </div>
                  <p className="text-xs mt-2 text-gray-500">{peak.time}</p>
                  <p className="text-sm font-medium">{peak.orders}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {studio.recentReviews.map((review, idx) => (
                <div key={idx} className="pb-4 border-b border-gray-100 last:border-0">
                  <div className="flex justify-between items-start">
                    <p className="text-sm font-medium">{review.customerName}</p>
                    <p className="text-xs text-gray-500">{review.date}</p>
                  </div>
                  <div className="mt-1 mb-2">
                    {renderStarRating(review.rating)}
                  </div>
                  <p className="text-sm text-gray-600">{review.comment}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Button variant="link" className="text-admin-primary">
                View All Reviews
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default StudioAnalytics;
