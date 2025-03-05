import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/layout/AdminLayout';
import { 
  Search, User, Package, Clock, Info, MoreHorizontal,
  Phone, Calendar, Truck, UserCog, XCircle, Filter,
  Users, CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import StatsCard from '@/components/ui/StatsCard';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import DataTable from '@/components/ui/DataTable';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import ToggleSwitch from '@/components/ui/ToggleSwitch';
import { toast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

// Interface for mock order type
interface MockOrder {
  id: string;
  driver: string;
  status: string;
  customer: string;
  address: string;
}

const Drivers = () => {
  const navigate = useNavigate();
  const [orderDetailsOpen, setOrderDetailsOpen] = useState(false);
  const [driverProfileOpen, setDriverProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: {
      active: true,
      inactive: true
    },
    orders: {
      any: true,
      none: true,
      multiple: true
    }
  });
  const [selectedDriver, setSelectedDriver] = useState<null | {
    name: string;
    totalOrders: number;
    currentTask: string;
    currentOrder: string;
    location: string;
    assignedOrders: string[];
    phone?: string;
    rating?: number;
    joinDate?: string;
    status?: string;
    email?: string;
    address?: string;
    emergencyContact?: string;
    vehicleInfo?: string;
    licenseNumber?: string;
  }>(null);

  const [mockDrivers, setMockDrivers] = useState([
    {
      id: 1,
      name: 'Ravi Kumar',
      status: 'active',
      assignedOrders: ['ORD-1234', 'ORD-5678', 'ORD-9012'],
      currentOrder: 'ORD-1234',
      currentTask: 'pickup',
      location: 'Banjara Hills, Hyderabad',
      phone: '+91 9876543210',
      totalOrders: 205,
      rating: 4.8,
      lastActive: '2 minutes ago',
      joinDate: 'Jan 15, 2023',
      email: 'ravi.kumar@example.com',
      address: 'Flat 301, Sunshine Apartments, Banjara Hills, Hyderabad',
      emergencyContact: '+91 9876543211',
      vehicleInfo: 'Maruti Swift (2020), White, License: TS09AB1234',
      licenseNumber: 'DLAP20221234567'
    },
    {
      id: 2,
      name: 'Priya Reddy',
      status: 'active',
      assignedOrders: ['ORD-3456', 'ORD-7890'],
      currentOrder: 'ORD-3456',
      currentTask: 'delivery',
      location: 'HITEC City, Hyderabad',
      phone: '+91 9876543212',
      totalOrders: 178,
      rating: 4.7,
      lastActive: '5 minutes ago',
      joinDate: 'Feb 3, 2023',
      email: 'priya.reddy@example.com',
      address: 'Apartment 502, Cyber Gateway, Madhapur, Hyderabad',
      emergencyContact: '+91 9876543213',
      vehicleInfo: 'Honda Activa (2021), Blue, License: TS08CD5678',
      licenseNumber: 'DLAP20221234568'
    },
    {
      id: 3,
      name: 'Venkat Rao',
      status: 'active',
      assignedOrders: ['ORD-2345', 'ORD-6789', 'ORD-0123', 'ORD-4567'],
      currentOrder: 'ORD-2345',
      currentTask: 'pickup',
      location: 'Gachibowli, Hyderabad',
      phone: '+91 9876543214',
      totalOrders: 245,
      rating: 4.9,
      lastActive: '10 minutes ago',
      joinDate: 'Dec 5, 2022',
      email: 'venkat.rao@example.com',
      address: 'Villa 25, Nallagandla, Serilingampally, Hyderabad',
      emergencyContact: '+91 9876543215',
      vehicleInfo: 'Bajaj Pulsar (2019), Black, License: TS10EF9012',
      licenseNumber: 'DLAP20221234569'
    },
    {
      id: 4,
      name: 'Sravani Devi',
      status: 'active',
      assignedOrders: ['ORD-8765', 'ORD-4321'],
      currentOrder: 'ORD-8765',
      currentTask: 'delivery',
      location: 'LB Nagar, Hyderabad',
      phone: '+91 9876543216',
      totalOrders: 132,
      rating: 4.6,
      lastActive: '15 minutes ago',
      joinDate: 'Mar 10, 2023',
      email: 'sravani.devi@example.com',
      address: 'House 75, Karmanghat, Hyderabad',
      emergencyContact: '+91 9876543217',
      vehicleInfo: 'TVS Jupiter (2022), Red, License: TS11GH3456',
      licenseNumber: 'DLAP20221234570'
    },
    {
      id: 5,
      name: 'Kiran Naidu',
      status: 'active',
      assignedOrders: ['ORD-7654', 'ORD-3210', 'ORD-9876'],
      currentOrder: 'ORD-7654',
      currentTask: 'pickup',
      location: 'Secunderabad, Hyderabad',
      phone: '+91 9876543218',
      totalOrders: 189,
      rating: 4.7,
      lastActive: '20 minutes ago',
      joinDate: 'Feb 25, 2023',
      email: 'kiran.naidu@example.com',
      address: 'Plot 56, Paradise Circle, Secunderabad, Hyderabad',
      emergencyContact: '+91 9876543219',
      vehicleInfo: 'Royal Enfield Classic 350 (2020), Green, License: TS12IJ7890',
      licenseNumber: 'DLAP20221234571'
    },
    {
      id: 6,
      name: 'Suresh Babu',
      status: 'inactive',
      assignedOrders: ['ORD-5432', 'ORD-1098', 'ORD-7654'],
      currentOrder: 'ORD-5432',
      currentTask: 'delivery',
      location: 'Miyapur, Hyderabad',
      phone: '+91 9876543220',
      totalOrders: 156,
      rating: 4.5,
      lastActive: '1 day ago',
      joinDate: 'Apr 15, 2023',
      email: 'suresh.babu@example.com',
      address: 'Flat 201, Sri Sai Enclave, Miyapur, Hyderabad',
      emergencyContact: '+91 9876543221',
      vehicleInfo: 'Hero Splendor (2021), Silver, License: TS13KL2345',
      licenseNumber: 'DLAP20221234572'
    },
    {
      id: 7,
      name: 'Ananya Reddy',
      status: 'active',
      assignedOrders: ['ORD-2109', 'ORD-8765'],
      currentOrder: 'ORD-2109',
      currentTask: 'pickup',
      location: 'Malakpet, Hyderabad',
      phone: '+91 9876543222',
      totalOrders: 113,
      rating: 4.6,
      lastActive: '30 minutes ago',
      joinDate: 'May 5, 2023',
      email: 'ananya.reddy@example.com',
      address: 'House 34, New Malakpet, Hyderabad',
      emergencyContact: '+91 9876543223',
      vehicleInfo: 'Suzuki Access 125 (2022), White, License: TS14MN6789',
      licenseNumber: 'DLAP20221234573'
    },
    {
      id: 8,
      name: 'Mohan Chowdary',
      status: 'inactive',
      assignedOrders: ['ORD-3456'],
      currentOrder: 'ORD-3456',
      currentTask: 'delivery',
      location: 'Gachibowli, Hyderabad',
      phone: '+91 9876543224',
      totalOrders: 87,
      rating: 4.4,
      lastActive: '2 days ago',
      joinDate: 'Jun 20, 2023',
      email: 'mohan.chowdary@example.com',
      address: 'Flat 701, Hill County, Financial District, Hyderabad',
      emergencyContact: '+91 9876543225',
      vehicleInfo: 'Yamaha FZ (2019), Blue, License: TS15OP0123',
      licenseNumber: 'DLAP20221234574'
    },
    {
      id: 9,
      name: 'Divya Lakshmi',
      status: 'active',
      assignedOrders: ['ORD-6543', 'ORD-2109', 'ORD-7890'],
      currentOrder: 'ORD-6543',
      currentTask: 'pickup',
      location: 'Jubilee Hills, Hyderabad',
      phone: '+91 9876543226',
      totalOrders: 162,
      rating: 4.8,
      lastActive: '40 minutes ago',
      joinDate: 'Mar 18, 2023',
      email: 'divya.lakshmi@example.com',
      address: 'Villa 45, Road No. 10, Jubilee Hills, Hyderabad',
      emergencyContact: '+91 9876543227',
      vehicleInfo: 'Ather 450X (2023), Green, License: TS16QR4567',
      licenseNumber: 'DLAP20221234575'
    },
    {
      id: 10,
      name: 'Aravind Kumar',
      status: 'active',
      assignedOrders: ['ORD-9876', 'ORD-5432'],
      currentOrder: 'ORD-9876',
      currentTask: 'delivery',
      location: 'Financial District, Hyderabad',
      phone: '+91 9876543228',
      totalOrders: 142,
      rating: 4.7,
      lastActive: '1 hour ago',
      joinDate: 'Jan 30, 2023',
      email: 'aravind.kumar@example.com',
      address: 'Apartment 603, My Home Bhooja, Gachibowli, Hyderabad',
      emergencyContact: '+91 9876543229',
      vehicleInfo: 'KTM Duke 125 (2022), Orange, License: TS17ST8901',
      licenseNumber: 'DLAP20221234576'
    }
  ]);

  const mockOrders: MockOrder[] = useMemo(() => [
    { id: 'ORD-1234', driver: 'Ravi Kumar', status: 'in_delivery', customer: 'Arjun Reddy', address: 'Flat 301, Sunshine Apartments, Banjara Hills, Hyderabad' },
    { id: 'ORD-5678', driver: 'Ravi Kumar', status: 'picked_up', customer: 'Sneha Sharma', address: 'Villa 45, Jubilee Hills, Hyderabad' },
    { id: 'ORD-9012', driver: 'Ravi Kumar', status: 'in_delivery', customer: 'Vikram Desai', address: '123 Ameerpet Main Road, Hyderabad' },
    { id: 'ORD-3456', driver: 'Priya Reddy', status: 'in_delivery', customer: 'Meena Nair', address: 'Apartment 7B, Cyber Towers, HITEC City, Hyderabad' },
    { id: 'ORD-7890', driver: 'Priya Reddy', status: 'picked_up', customer: 'Rajesh Kumar', address: '456 Madhapur, Hyderabad' },
    { id: 'ORD-2345', driver: 'Venkat Rao', status: 'in_delivery', customer: 'Sunita Patel', address: 'Plot 78, Gachibowli, Hyderabad' },
    { id: 'ORD-6789', driver: 'Venkat Rao', status: 'picked_up', customer: 'Kiran Sharma', address: 'House 12, Kondapur Main Road, Hyderabad' },
    { id: 'ORD-0123', driver: 'Venkat Rao', status: 'in_delivery', customer: 'Ananya Reddy', address: 'Flat 503, Sri Sai Enclave, Kukatpally, Hyderabad' },
    { id: 'ORD-4567', driver: 'Venkat Rao', status: 'picked_up', customer: 'Praveen Verma', address: '789 KPHB Colony, Hyderabad' },
    { id: 'ORD-8765', driver: 'Sravani Devi', status: 'in_delivery', customer: 'Divya Mehta', address: 'Villa 23, LB Nagar, Hyderabad' },
    { id: 'ORD-4321', driver: 'Sravani Devi', status: 'picked_up', customer: 'Suresh Babu', address: '234 Dilsukhnagar, Hyderabad' },
    { id: 'ORD-7654', driver: 'Kiran Naidu', status: 'in_delivery', customer: 'Kavita Rao', address: 'Apartment 12C, Paradise Circle, Secunderabad, Hyderabad' },
    { id: 'ORD-3210', driver: 'Kiran Naidu', status: 'picked_up', customer: 'Rahul Sharma', address: '567 Begumpet, Hyderabad' },
    { id: 'ORD-9876', driver: 'Kiran Naidu', status: 'in_delivery', customer: 'Nandini Reddy', address: 'House 89, Bowenpally, Secunderabad, Hyderabad' },
    { id: 'ORD-5432', driver: 'Suresh Babu', status: 'in_delivery', customer: 'Sandeep Kumar', address: 'Flat 405, Sri Krishna Apartments, Miyapur, Hyderabad' },
    { id: 'ORD-1098', driver: 'Suresh Babu', status: 'picked_up', customer: 'Lakshmi Prasad', address: '678 ECIL, Hyderabad' },
    { id: 'ORD-7654', driver: 'Suresh Babu', status: 'in_delivery', customer: 'Rohit Sharma', address: 'Plot 56, Uppal, Hyderabad' },
    { id: 'ORD-2109', driver: 'Ananya Reddy', status: 'in_delivery', customer: 'Priya Singh', address: 'House 34, Malakpet, Hyderabad' },
    { id: 'ORD-8765', driver: 'Ananya Reddy', status: 'picked_up', customer: 'Vikram Reddy', address: '890 Tarnaka, Hyderabad' },
    { id: 'ORD-3456', driver: 'Mohan Chowdary', status: 'in_delivery', customer: 'Aditya Sharma', address: 'Flat 201, Hill County, Gachibowli, Hyderabad' },
    { id: 'ORD-6543', driver: 'Divya Lakshmi', status: 'in_delivery', customer: 'Sanjay Kapoor', address: 'Villa 67, Film Nagar, Jubilee Hills, Hyderabad' },
    { id: 'ORD-2109', driver: 'Divya Lakshmi', status: 'picked_up', customer: 'Rekha Naidu', address: '345 Manikonda, Hyderabad' },
    { id: 'ORD-7890', driver: 'Divya Lakshmi', status: 'in_delivery', customer: 'Vamsi Krishna', address: 'Apartment 8D, Cyber Gateway, HITEC City, Hyderabad' },
    { id: 'ORD-9876', driver: 'Aravind Kumar', status: 'in_delivery', customer: 'Neha Reddy', address: 'Plot 23, Financial District, Gachibowli, Hyderabad' },
    { id: 'ORD-5432', driver: 'Aravind Kumar', status: 'picked_up', customer: 'Ganesh Rao', address: '567 Mehdipatnam, Hyderabad' },
    { id: 'ORD-4321', driver: 'Swati Sharma', status: 'in_delivery', customer: 'Harish Kumar', address: 'House 78, Alwal, Secunderabad, Hyderabad' },
    { id: 'ORD-8765', driver: 'Swati Sharma', status: 'picked_up', customer: 'Pooja Verma', address: '123 Ramanthapur, Hyderabad' },
    { id: 'ORD-1234', driver: 'Swati Sharma', status: 'in_delivery', customer: 'Manish Reddy', address: 'Flat 604, Vertex Sadguru, Madhapur, Hyderabad' },
    { id: 'ORD-7890', driver: 'Meenakshi Devi', status: 'in_delivery', customer: 'Ritu Sharma', address: 'Villa 12, Road No. 10, Banjara Hills, Hyderabad' },
    { id: 'ORD-2345', driver: 'Meenakshi Devi', status: 'picked_up', customer: 'Vivek Kumar', address: '456 Himayat Nagar, Hyderabad' },
    { id: 'ORD-5678', driver: 'Rajesh Verma', status: 'in_delivery', customer: 'Sonali Reddy', address: 'Apartment 9E, My Home Bhooja, Gachibowli, Hyderabad' },
    { id: 'ORD-1234', driver: 'Rajesh Verma', status: 'picked_up', customer: 'Ajay Singh', address: '789 AS Rao Nagar, Hyderabad' },
    { id: 'ORD-9012', driver: 'Rajesh Verma', status: 'in_delivery', customer: 'Geeta Naidu', address: 'House 45, Sainikpuri, Secunderabad, Hyderabad' },
    { id: 'ORD-3456', driver: 'Padma Lakshmi', status: 'in_delivery', customer: 'Raghu Sharma', address: 'Plot 67, Chandanagar, Hyderabad' }
  ], []);

  const toggleDriverStatus = (driverId: number) => {
    setMockDrivers(prevDrivers => 
      prevDrivers.map(driver => 
        driver.id === driverId 
          ? { ...driver, status: driver.status === 'active' ? 'inactive' : 'active' } 
          : driver
      )
    );
    
    const driver = mockDrivers.find(d => d.id === driverId);
    const newStatus = driver?.status === 'active' ? 'inactive' : 'active';
    toast({
      title: `Status updated`,
      description: `${driver?.name}'s status changed to ${newStatus}`,
      duration: 2000,
    });
  };

  const handleActionMenuItem = (action: string, driverId: number) => {
    const driver = mockDrivers.find(d => d.id === driverId);
    
    if (!driver) return;
    
    switch(action) {
      case 'viewProfile':
        navigate(`/driver-profile/${driverId}`);
        break;
      case 'viewOrders':
        handleOpenOrderDetails(driver);
        break;
      case 'changeStatus':
        toggleDriverStatus(driverId);
        break;
      case 'removeDriver':
        toast({
          title: "Driver removed",
          description: `${driver.name} has been removed from the system`,
          variant: "destructive",
          duration: 2000,
        });
        setMockDrivers(prevDrivers => prevDrivers.filter(d => d.id !== driverId));
        break;
      default:
        break;
    }
  };

  const filteredDrivers = useMemo(() => {
    return mockDrivers.filter(driver => {
      if (searchQuery && searchQuery.length > 0) {
        const nameMatch = driver.name.toLowerCase().includes(searchQuery.toLowerCase());
        const phoneMatch = driver.phone.toLowerCase().includes(searchQuery.toLowerCase());
        const emailMatch = driver.email.toLowerCase().includes(searchQuery.toLowerCase());
        if (!nameMatch && !phoneMatch && !emailMatch) return false;
      }
      
      if (!filters.status[driver.status as 'active' | 'inactive']) return false;
      
      if (driver.assignedOrders.length === 0 && !filters.orders.none) return false;
      if (driver.assignedOrders.length === 1 && !filters.orders.any) return false;
      if (driver.assignedOrders.length > 1 && !filters.orders.multiple) return false;
      
      return true;
    });
  }, [mockDrivers, searchQuery, filters]);

  const handleOpenOrderDetails = (driver: any) => {
    setSelectedDriver({
      name: driver.name,
      totalOrders: driver.totalOrders,
      currentTask: driver.currentTask,
      currentOrder: driver.currentOrder,
      location: driver.location,
      assignedOrders: driver.assignedOrders,
      phone: driver.phone,
      rating: driver.rating,
      joinDate: driver.joinDate,
      status: driver.status
    });
    setOrderDetailsOpen(true);
  };

  const handleOpenDriverProfile = (driver: any) => {
    setSelectedDriver(driver);
    setDriverProfileOpen(true);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const activeDriversCount = useMemo(() => {
    return mockDrivers.filter(driver => driver.status === 'active').length;
  }, [mockDrivers]);

  const inactiveDriversCount = useMemo(() => {
    return mockDrivers.filter(driver => driver.status === 'inactive').length;
  }, [mockDrivers]);
  
  const totalDriversCount = useMemo(() => {
    return activeDriversCount + inactiveDriversCount;
  }, [activeDriversCount, inactiveDriversCount]);

  const driverOrderAssignments = useMemo(() => {
    const assignments = mockDrivers.map(driver => {
      const ordersAssigned = mockOrders.filter(order => 
        order.driver === driver.name
      ).length;
      
      return {
        ...driver,
        ordersAssigned
      };
    });
    
    return assignments.sort((a, b) => b.ordersAssigned - a.ordersAssigned);
  }, [mockDrivers, mockOrders]);

  const availableDrivers = useMemo(() => {
    return mockDrivers.filter(driver => driver.status === 'active');
  }, [mockDrivers]);

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Driver Management</h1>
          <div className="flex space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search drivers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-64"
              />
              {searchQuery.length >= 2 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
                  <ul className="py-1 text-sm text-gray-700 max-h-60 overflow-auto">
                    {mockDrivers
                      .filter(driver => 
                        driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        driver.phone.includes(searchQuery) ||
                        driver.email.toLowerCase().includes(searchQuery.toLowerCase())
                      )
                      .slice(0, 5)
                      .map((driver) => (
                        <li 
                          key={driver.id}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => setSearchQuery(driver.name)}
                        >
                          <div className="flex items-center">
                            <span className="font-medium">{driver.name}</span>
                            <span className="ml-2 text-gray-500 text-xs">{driver.phone}</span>
                          </div>
                        </li>
                      ))}
                  </ul>
                </div>
              )}
            </div>
            <Popover open={filtersOpen} onOpenChange={setFiltersOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filters
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4">
                  <h3 className="font-medium">Filter Drivers</h3>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Status</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="status-active" 
                          checked={filters.status.active}
                          onCheckedChange={(checked) => 
                            setFilters(prev => ({
                              ...prev, 
                              status: {...prev.status, active: Boolean(checked)}
                            }))
                          }
                        />
                        <label htmlFor="status-active" className="text-sm">
                          Active
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="status-inactive" 
                          checked={filters.status.inactive}
                          onCheckedChange={(checked) => 
                            setFilters(prev => ({
                              ...prev, 
                              status: {...prev.status, inactive: Boolean(checked)}
                            }))
                          }
                        />
                        <label htmlFor="status-inactive" className="text-sm">
                          Inactive
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Assigned Orders</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="orders-any" 
                          checked={filters.orders.any}
                          onCheckedChange={(checked) => 
                            setFilters(prev => ({
                              ...prev, 
                              orders: {...prev.orders, any: Boolean(checked)}
                            }))
                          }
                        />
                        <label htmlFor="orders-any" className="text-sm">
                          With any orders
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="orders-multiple" 
                          checked={filters.orders.multiple}
                          onCheckedChange={(checked) => 
                            setFilters(prev => ({
                              ...prev, 
                              orders: {...prev.orders, multiple: Boolean(checked)}
                            }))
                          }
                        />
                        <label htmlFor="orders-multiple" className="text-sm">
                          With multiple orders
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="orders-none" 
                          checked={filters.orders.none}
                          onCheckedChange={(checked) => 
                            setFilters(prev => ({
                              ...prev, 
                              orders: {...prev.orders, none: Boolean(checked)}
                            }))
                          }
                        />
                        <label htmlFor="orders-none" className="text-sm">
                          No orders
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <Button 
                      variant="outline"
                      onClick={() => setFilters({
                        status: { active: true, inactive: true },
                        orders: { any: true, none: true, multiple: true }
                      })}
                    >
                      Reset
                    </Button>
                    <Button onClick={() => setFiltersOpen(false)}>
                      Apply Filters
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            <Button>Add Driver</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <StatsCard 
            title="Total Drivers"
            value={totalDriversCount.toString()}
            icon={<User className="h-5 w-5" />}
            change={{ value: "+3", trend: "up" }}
          />
          <StatsCard 
            title="Active Drivers"
            value={activeDriversCount.toString()}
            icon={<User className="h-5 w-5" />}
            change={{ value: "+5", trend: "up" }}
          />
          <StatsCard 
            title="Inactive Drivers"
            value={inactiveDriversCount.toString()}
            icon={<Clock className="h-5 w-5" />}
            change={{ value: "-3", trend: "up" }}
          />
        </div>

        <Tabs defaultValue="drivers" className="mb-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="drivers" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Drivers List
            </TabsTrigger>
            <TabsTrigger value="assignments" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Order Assignments
            </TabsTrigger>
            <TabsTrigger value="available" className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Available Drivers
            </TabsTrigger>
          </TabsList>

          <TabsContent value="drivers">
            <div className="bg-white rounded-lg shadow-subtle overflow-hidden mb-6">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-100">
                  <thead>
                    <tr className="bg-gray-50">
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Driver
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Phone Number
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {filteredDrivers.map((driver) => (
                      <tr key={driver.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                              <User className="h-5 w-5 text-gray-500" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{driver.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <ToggleSwitch 
                            isEnabled={driver.status === 'active'}
                            onChange={() => toggleDriverStatus(driver.id)}
                            label="Active"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {driver.phone}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-full bg-gray-100">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-white">
                              <DropdownMenuItem 
                                className="flex items-center cursor-pointer"
                                onClick={() => handleActionMenuItem('viewProfile', driver.id)}
                              >
                                <User className="mr-2 h-4 w-4" />
                                <span>Driver Profile</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="flex items-center cursor-pointer"
                                onClick={() => handleActionMenuItem('viewOrders', driver.id)}
                              >
                                <Info className="mr-2 h-4 w-4" />
                                <span>Order Details</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="flex items-center cursor-pointer"
                                onClick={() => handleActionMenuItem('changeStatus', driver.id)}
                              >
                                <UserCog className="mr-2 h-4 w-4" />
                                <span>Change Status</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="flex items-center text-red-600 cursor-pointer"
                                onClick={() => handleActionMenuItem('removeDriver', driver.id)}
                              >
                                <XCircle className="mr-2 h-4 w-4" />
                                <span>Remove Driver</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="assignments">
            <div className="bg-white rounded-lg shadow-subtle overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <h3 className="text-lg font-medium text-gray-800 flex items-center gap-2">
                  <Package className="h-5 w-5 text-blue-500" />
                  Driver Order Assignments
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Overview of orders assigned to each driver
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-100">
                  <thead>
                    <tr className="bg-gray-50">
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        #
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Driver
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Assigned Orders
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Current Orders
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {driverOrderAssignments.map((driver, index) => {
                      const driverOrders = mockOrders.filter(order => order.driver === driver.name);
                      const activeOrders = driverOrders.filter(order => order.status === 'in_delivery').length;
                      
                      return (
                        <tr key={driver.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {index + 1}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                                <User className="h-5 w-5 text-gray-500" />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{driver.name}</div>
                                <div className="text-sm text-gray-500">{driver.phone}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge variant={driver.status === 'active' ? 'default' : 'secondary'}>
                              {driver.status === 'active' ? 'Active' : 'Inactive'}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div className="flex items-center">
                              <Package className="h-4 w-4 text-blue-500 mr-2" />
                              <span className="font-medium">{driverOrders.length}</span>
                              <span className="text-gray-500 ml-1">orders total</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div className="flex items-center">
                              <Truck className="h-4 w-4 text-green-500 mr-2" />
                              <span className="font-medium">{activeOrders}</span>
                              <span className="text-gray-500 ml-1">active deliveries</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleActionMenuItem('viewOrders', driver.id)}
                              className="flex items-center gap-1"
                            >
                              <Info className="h-4 w-4" />
                              View Orders
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Order Details by Driver</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {driverOrderAssignments.slice(0, 6).map((driver) => {
                  const driverOrders = mockOrders.filter(order => order.driver === driver.name);
                  if (driverOrders.length === 0) return null;
                  
                  return (
                    <Card key={driver.id}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-md flex items-center gap-2">
                          <User className="h-4 w-4 text-blue-500" />
                          {driver.name}
                        </CardTitle>
                        <CardDescription>
                          {driverOrders.length} orders assigned
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {driverOrders.slice(0, 5).map((order, index) => (
                            <div key={index} className="border rounded-md p-2 text-sm">
                              <div className="flex justify-between items-center mb-1">
                                <span className="font-medium">{order.id}</span>
                                <Badge variant="outline" className={order.status === 'in_delivery' ? 'text-green-600' : 'text-blue-600'}>
                                  {order.status === 'in_delivery' ? 'Delivering' : 'Picked up'}
                                </Badge>
                              </div>
                              <div className="text-gray-500 text-xs">
                                {order.customer}
                              </div>
                              <div className="text-gray-500 text-xs truncate">
                                {order.address}
                              </div>
                            </div>
                          ))}
                          {driverOrders.length > 5 && (
                            <Button variant="ghost" size="sm" className="w-full text-xs">
                              View all {driverOrders.length} orders
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="available">
            <div className="bg-white rounded-lg shadow-subtle overflow-hidden mb-6">
              <div className="p-4 border-b border-gray-100">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-800 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    Available Drivers
                  </h3>
                  <Badge variant="outline" className="flex items-center">
                    {availableDrivers.length} Drivers Available
                  </Badge>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Drivers currently available for new order assignments
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                {availableDrivers.map((driver) => {
                  const driverOrders = mockOrders.filter(order => order.driver === driver.name);
                  const activeOrders = driverOrders.filter(order => order.status === 'in_delivery').length;
                  
                  return (
                    <div 
                      key={driver.id} 
                      className="border rounded-lg p-4 hover:border-blue-200 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                            <User className="h-5 w-5 text-gray-500" />
                          </div>
                          <div>
                            <h4 className="text-sm font-medium">{driver.name}</h4>
                            <p className="text-xs text-gray-500">{driver.phone}</p>
                          </div>
                        </div>
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                          Available
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        <div className="bg-gray-50 rounded p-2 text-center">
                          <div className="text-lg font-semibold">{driverOrders.length}</div>
                          <div className="text-xs text-gray-500">Total Orders</div>
                        </div>
                        <div className="bg-gray-50 rounded p-2 text-center">
                          <div className="text-lg font-semibold">{activeOrders}</div>
                          <div className="text-xs text-gray-500">Active Deliveries</div>
                        </div>
                      </div>
                      
                      <div className="text-xs text-gray-500 mb-1">Current Location</div>
                      <div className="text-sm mb-3 flex items-center">
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          className="h-3 w-3 mr-1 text-gray-500"
                        >
                          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                          <circle cx="12" cy="10" r="3"/>
                        </svg>
                        {driver.location}
                      </div>
                      
                      <Button size="sm" variant="outline" className="w-full">
                        Assign Order
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <Dialog open={orderDetailsOpen} onOpenChange={setOrderDetailsOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Order Details</DialogTitle>
              <DialogDescription>
                Details for {selectedDriver?.name}'s current assignments
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 mt-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Truck className="h-4 w-4 mr-2" />
                  Current Status
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Current Order</p>
                    <p className="text-sm font-medium">{selectedDriver?.currentOrder}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Current Task</p>
                    <p className="text-sm font-medium capitalize">{selectedDriver?.currentTask}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Package className="h-4 w-4 mr-2" />
                  Assigned Orders ({selectedDriver?.assignedOrders.length})
                </h3>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {selectedDriver?.assignedOrders.map((order, index) => (
                    <div key={index} className="bg-gray-50 p-2 rounded text-sm">
                      {order}
                    </div>
                  ))}
                </div>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Total Orders</p>
                  <p className="text-sm font-medium">{selectedDriver?.totalOrders}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Active Since</p>
                  <p className="text-sm font-medium">
                    <Calendar className="h-3 w-3 inline mr-1" />
                    {selectedDriver?.joinDate}
                  </p>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={driverProfileOpen} onOpenChange={setDriverProfileOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Driver Profile</DialogTitle>
              <DialogDescription>
                Detailed information about {selectedDriver?.name}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 mt-4">
              <div className="flex items-center">
                <div className="h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                  <User className="h-8 w-8 text-gray-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{selectedDriver?.name}</h3>
                  <div className="flex items-center mt-1">
                    <Badge variant={selectedDriver?.status === 'active' ? 'default' : 'secondary'} className="mr-2">
                      {selectedDriver?.status === 'active' ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1 flex items-center">
                    <Phone className="h-3.5 w-3.5 mr-1" />
                    Phone Number
                  </h4>
                  <p className="text-sm">{selectedDriver?.phone}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1 flex items-center">
                    <Calendar className="h-3.5 w-3.5 mr-1" />
                    Joined
                  </h4>
                  <p className="text-sm">{selectedDriver?.joinDate}</p>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Email Address</h4>
                <p className="text-sm">{selectedDriver?.email}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Home Address</h4>
                <p className="text-sm">{selectedDriver?.address}</p>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Vehicle Information</h4>
                <p className="text-sm">{selectedDriver?.vehicleInfo}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">License Number</h4>
                <p className="text-sm">{selectedDriver?.licenseNumber}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Emergency Contact</h4>
                <p className="text-sm">{selectedDriver?.emergencyContact}</p>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <p className="text-sm font-medium text-gray-900">{selectedDriver?.totalOrders}</p>
                  <p className="text-xs text-gray-500">Total Orders</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg text-center">
                  <p className="text-sm font-medium text-gray-900">{selectedDriver?.assignedOrders?.length || 0}</p>
                  <p className="text-xs text-gray-500">Current Orders</p>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default Drivers;
