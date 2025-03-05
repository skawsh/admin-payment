
import React from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { mockStudios } from '@/data/mockServiceData';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Package, User, ShoppingCart, BarChart4 } from 'lucide-react';

const Index: React.FC = () => {
  const navigate = useNavigate();

  const navigateToStudios = () => {
    navigate('/studios');
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex flex-col space-y-6">
          <h1 className="text-3xl font-bold">Welcome to Skawsh Admin</h1>
          <p className="text-lg text-gray-600">Manage your laundry service platform</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
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
                <Button variant="outline" onClick={navigateToStudios} className="w-full">
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
    </AdminLayout>
  );
};

export default Index;
