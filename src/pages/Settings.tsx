
import React, { useState } from "react";
import { 
  Settings as SettingsIcon, 
  Bell, 
  User, 
  Lock, 
  Shield, 
} from "lucide-react";
import AdminLayout from "@/components/layout/AdminLayout";
import PageHeader from "@/components/ui/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { toast } from "@/hooks/use-toast";
import ToggleSwitch from "@/components/ui/ToggleSwitch";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

type NotificationSetting = {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
};

type SecuritySetting = {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
};

// Schema for admin user creation
const adminUserSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" }),
  confirmPassword: z.string(),
  role: z.enum(["admin", "editor", "viewer"], {
    required_error: "Please select a role",
  }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type AdminUserFormValues = z.infer<typeof adminUserSchema>;

const Settings = () => {
  // Admin user creation form
  const adminUserForm = useForm<AdminUserFormValues>({
    resolver: zodResolver(adminUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "viewer",
    }
  });

  // Notification settings
  const [notifications, setNotifications] = useState<NotificationSetting[]>([
    {
      id: "email-notifications",
      title: "Email Notifications",
      description: "Receive email notifications for important events",
      enabled: true
    },
    {
      id: "order-notifications",
      title: "Order Updates",
      description: "Get notified when an order status changes",
      enabled: true
    },
    {
      id: "payment-notifications",
      title: "Payment Alerts",
      description: "Receive alerts for new payments and refunds",
      enabled: true
    },
    {
      id: "system-notifications",
      title: "System Alerts",
      description: "Get notified about system updates and maintenance",
      enabled: false
    },
    {
      id: "marketing-notifications",
      title: "Marketing Communications",
      description: "Receive updates about new features and promotions",
      enabled: false
    }
  ]);

  // Security settings
  const [securitySettings, setSecuritySettings] = useState<SecuritySetting[]>([
    {
      id: "two-factor",
      title: "Two-Factor Authentication",
      description: "Add an extra layer of security to your account",
      enabled: false
    },
    {
      id: "session-timeout",
      title: "Session Timeout",
      description: "Automatically log out after 30 minutes of inactivity",
      enabled: true
    },
    {
      id: "login-alerts",
      title: "Login Alerts",
      description: "Get notified of suspicious login attempts",
      enabled: true
    }
  ]);

  // Toggle notification setting
  const toggleNotification = (id: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === id 
        ? { ...notification, enabled: !notification.enabled } 
        : notification
    ));
  };

  // Toggle security setting
  const toggleSecurity = (id: string) => {
    setSecuritySettings(securitySettings.map(setting => 
      setting.id === id 
        ? { ...setting, enabled: !setting.enabled } 
        : setting
    ));
  };

  const onAdminUserSubmit = (data: AdminUserFormValues) => {
    console.log("Creating admin user:", data);
    toast({
      title: "Admin User Created",
      description: `${data.name} has been added as a ${data.role}`,
    });
    adminUserForm.reset();
  };

  return (
    <AdminLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <PageHeader 
          title="Settings" 
          subtitle="Manage your account settings and preferences"
          icon={<SettingsIcon className="h-6 w-6 text-muted-foreground" />}
        />

        <Tabs defaultValue="account" className="space-y-4">
          <TabsList className="grid grid-cols-1 md:grid-cols-3 w-full h-auto gap-2">
            <TabsTrigger value="account" className="flex gap-2 items-center">
              <User className="h-4 w-4" />
              <span>Account Creation</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex gap-2 items-center">
              <Bell className="h-4 w-4" />
              <span>Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex gap-2 items-center">
              <Lock className="h-4 w-4" />
              <span>Security</span>
            </TabsTrigger>
          </TabsList>

          {/* Account Creation Section */}
          <TabsContent value="account" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Create Admin User</CardTitle>
                <CardDescription>
                  Create a new user account that can access the admin panel
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Form {...adminUserForm}>
                  <form onSubmit={adminUserForm.handleSubmit(onAdminUserSubmit)} className="space-y-4">
                    <FormField
                      control={adminUserForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={adminUserForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="name@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={adminUserForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={adminUserForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={adminUserForm.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>User Role</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a role" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="admin">Admin</SelectItem>
                              <SelectItem value="editor">Editor</SelectItem>
                              <SelectItem value="viewer">Viewer</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Admin: Full access. Editor: Can edit but not delete. Viewer: Read-only access.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex justify-end">
                      <Button type="submit">Create User</Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Section */}
          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Control which notifications you receive and how they're delivered
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {notifications.map((notification) => (
                  <div key={notification.id} className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <h3 className="text-sm font-medium">{notification.title}</h3>
                      <p className="text-xs text-muted-foreground">{notification.description}</p>
                    </div>
                    <ToggleSwitch 
                      isEnabled={notification.enabled} 
                      onChange={() => toggleNotification(notification.id)} 
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Section */}
          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Manage your account security and authentication methods
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {securitySettings.map((setting) => (
                  <div key={setting.id} className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <h3 className="text-sm font-medium">{setting.title}</h3>
                      <p className="text-xs text-muted-foreground">{setting.description}</p>
                    </div>
                    <ToggleSwitch 
                      isEnabled={setting.enabled} 
                      onChange={() => toggleSecurity(setting.id)} 
                    />
                  </div>
                ))}

                <Separator className="my-4" />

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Change Password</h3>
                    <div className="space-y-3">
                      <Input type="password" placeholder="Current password" />
                      <Input type="password" placeholder="New password" />
                      <Input type="password" placeholder="Confirm new password" />
                    </div>
                    <div className="mt-4 flex justify-end">
                      <Button>Update Password</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default Settings;
