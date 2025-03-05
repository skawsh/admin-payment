
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Banknote, 
  ShoppingBag, 
  Clock, 
  Users, 
  Building, 
  BarChart2, 
  PieChart, 
  TrendingUp, 
  UserCheck, 
  Truck, 
  Package, 
  ArrowRight, 
  ShoppingCart 
} from 'lucide-react';
import AdminLayout from '../components/layout/AdminLayout';
import PageHeader from '../components/ui/PageHeader';
import StatsCard from '../components/ui/StatsCard';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/card';
import { Button } from '@/components/ui/button';
import { mockStudios } from '@/data/mockServiceData';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const stats = [
    {
      title: 'Total Studios',
      value: '42',
      icon: <Building className="h-5 w-5" />,
      change: { value: '+4', trend: 'up' as const }
    },
    {
      title: 'Total Orders',
      value: '1,284',
      icon: <ShoppingBag className="h-5 w-5" />,
      change: { value: '+17%', trend: 'up' as const }
    },
    {
      title: 'Total Revenue',
      value: '$24,563',
      icon: <Banknote className="h-5 w-5" />,
      change: { value: '+8%', trend: 'up' as const }
    },
    {
      title: 'Avg. Turnaround Time',
      value: '2.4 hrs',
      icon: <Clock className="h-5 w-5" />,
      change: { value: '-15%', trend: 'up' as const }
    },
    {
      title: 'Active Customers',
      value: '862',
      icon: <Users className="h-5 w-5" />,
      change: { value: '+12%', trend: 'up' as const }
    }
  ];

  const analyticsCards = [
    {
      title: 'Studio Analytics',
      description: 'Performance metrics for all studios',
      icon: <Building className="h-6 w-6" />,
      color: 'bg-blue-500',
      path: '/studios/overall-analytics'
    },
    {
      title: 'User Analytics',
      description: 'Customer engagement and behavior',
      icon: <UserCheck className="h-6 w-6" />,
      color: 'bg-green-500',
      path: '/user-analytics'
    },
    {
      title: 'Services Analytics',
      description: 'Service utilization and popularity',
      icon: <PieChart className="h-6 w-6" />,
      color: 'bg-purple-500',
      path: '/services-analytics'
    },
    {
      title: 'Revenue Analytics',
      description: 'Financial performance and growth',
      icon: <TrendingUp className="h-6 w-6" />,
      color: 'bg-amber-500',
      path: '/revenue'
    },
    {
      title: 'Delivery Analytics',
      description: 'Delivery efficiency and performance',
      icon: <Truck className="h-6 w-6" />,
      color: 'bg-indigo-500',
      path: '/delivery-analytics'
    }
  ];

  return (
    <AdminLayout>
      <PageHeader 
        title="Dashboard" 
        subtitle="Overview of your laundry platform's performance"
      />
      
      {/* Welcome Section from Index.tsx */}
      <div className="p-6 bg-white rounded-lg shadow-subtle mb-8">
        <div className="flex flex-col space-y-4">
          <h2 className="text-2xl font-bold">Welcome to Skawsh Admin</h2>
          <p className="text-lg text-gray-600">Manage your laundry service platform</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="mr-2 h-5 w-5 text-admin-primary" />
                  Studios
                </CardTitle>
                <CardDescription>
                  Manage laundry studios
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{mockStudios.length}</p>
                <p className="text-sm text-gray-500">Total studios</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" onClick={() => navigate('/studios')} className="w-full">
                  View Studios
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-5 w-5 text-blue-500" />
                  Users
                </CardTitle>
                <CardDescription>
                  Manage platform users
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">2,854</p>
                <p className="text-sm text-gray-500">Active users</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" onClick={() => navigate('/users')} className="w-full">
                  View Users
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShoppingCart className="mr-2 h-5 w-5 text-green-500" />
                  Orders
                </CardTitle>
                <CardDescription>
                  Manage customer orders
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">1,284</p>
                <p className="text-sm text-gray-500">Total orders</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" onClick={() => navigate('/orders')} className="w-full">
                  View Orders
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart4 className="mr-2 h-5 w-5 text-purple-500" />
                  Analytics
                </CardTitle>
                <CardDescription>
                  View platform analytics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">₹458K</p>
                <p className="text-sm text-gray-500">Monthly revenue</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" onClick={() => navigate('/revenue')} className="w-full">
                  View Analytics
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        {stats.map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            change={stat.change}
          />
        ))}
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Analytics Sections</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {analyticsCards.map((card, index) => (
            <Card 
              key={index}
              className="overflow-hidden transition-all duration-300 hover:shadow-md cursor-pointer border-t-4 hover:-translate-y-1"
              style={{ borderTopColor: card.color.replace('bg-', '') }}
              onClick={() => navigate(card.path)}
            >
              <CardHeader className={`${card.color} text-white p-4 flex flex-row items-center justify-between space-y-0`}>
                <CardTitle className="text-md font-semibold">
                  {card.title}
                </CardTitle>
                {card.icon}
              </CardHeader>
              <CardContent className="p-4">
                <p className="text-sm text-gray-600">{card.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-subtle p-5">
          <h2 className="text-lg font-medium mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((_, index) => (
              <div key={index} className="flex items-start space-x-3 pb-4 border-b border-gray-100 last:border-0">
                <div className="bg-gray-100 rounded-full h-10 w-10 flex items-center justify-center text-gray-500">
                  {index % 2 === 0 ? <ShoppingBag className="h-5 w-5" /> : <Building className="h-5 w-5" />}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    {index % 2 === 0 
                      ? 'New order #ORD-2547 from Customer' 
                      : 'Studio "Clean Laundry" updated their profile'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {index === 0 ? 'Just now' : `${index * 12} minutes ago`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-subtle p-5">
          <h2 className="text-lg font-medium mb-4">Platform Performance</h2>
          <div className="h-64 flex items-center justify-center border border-dashed border-gray-200 rounded-lg">
            <p className="text-sm text-gray-500">Chart placeholder - Performance metrics</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
