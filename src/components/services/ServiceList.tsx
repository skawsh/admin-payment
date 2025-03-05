
import React, { useState, useEffect } from 'react';
import { Service, Subservice } from '@/types/serviceTypes';
import { ChevronRight, Edit, Trash, ChevronDown, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ServiceListProps {
  services: Service[];
  searchTerm: string;
  onAddItem: (serviceId: string, subserviceId: string, item: any) => void;
  onToggleService: (serviceId: string) => void;
  onToggleSubservice: (serviceId: string, subserviceId: string) => void;
  onAddSubservice?: (serviceId: string, subservice: Omit<Subservice, "id">) => void;
  onEditSubservice?: (serviceId: string, subserviceId: string, updatedSubservice: Partial<Subservice>) => void;
  onDeleteSubservice?: (serviceId: string, subserviceId: string) => void;
}

const ServiceList: React.FC<ServiceListProps> = ({
  services,
  searchTerm,
  onAddItem,
  onToggleService,
  onToggleSubservice,
  onAddSubservice,
  onEditSubservice,
  onDeleteSubservice
}) => {
  const [filteredServices, setFilteredServices] = useState<Service[]>(services);
  const [expandedServices, setExpandedServices] = useState<Record<string, boolean>>({});
  const { toast } = useToast();
  
  // State for subservice operations
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [currentServiceId, setCurrentServiceId] = useState<string>('');
  const [currentSubserviceId, setCurrentSubserviceId] = useState<string>('');
  const [subserviceName, setSubserviceName] = useState('');

  useEffect(() => {
    if (!searchTerm) {
      setFilteredServices(services);
      return;
    }

    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    
    const filtered = services.map(service => {
      const serviceMatches = service.name.toLowerCase().includes(lowerCaseSearchTerm);
      
      const matchedSubservices = service.subservices.filter(subservice => {
        return subservice.name.toLowerCase().includes(lowerCaseSearchTerm);
      });
      
      if (serviceMatches || matchedSubservices.length > 0) {
        return {
          ...service,
          subservices: serviceMatches ? service.subservices : matchedSubservices
        };
      }
      
      return null;
    }).filter(Boolean) as Service[];
    
    setFilteredServices(filtered);
  }, [searchTerm, services]);

  const handleEditService = (serviceId: string) => {
    toast({
      title: "Coming Soon",
      description: "Edit service functionality will be implemented soon.",
      duration: 3000,
    });
  };

  const handleDeleteService = (serviceId: string) => {
    toast({
      title: "Coming Soon",
      description: "Delete service functionality will be implemented soon.",
      duration: 3000,
    });
  };

  const toggleServiceExpand = (serviceId: string) => {
    setExpandedServices(prev => ({
      ...prev,
      [serviceId]: !prev[serviceId]
    }));
  };

  // Handlers for subservice operations
  const openEditSubserviceDialog = (e: React.MouseEvent, serviceId: string, subserviceId: string, name: string) => {
    e.stopPropagation();
    setCurrentServiceId(serviceId);
    setCurrentSubserviceId(subserviceId);
    setSubserviceName(name);
    setEditDialogOpen(true);
  };

  const openDeleteSubserviceDialog = (e: React.MouseEvent, serviceId: string, subserviceId: string) => {
    e.stopPropagation();
    setCurrentServiceId(serviceId);
    setCurrentSubserviceId(subserviceId);
    setDeleteDialogOpen(true);
  };

  const openAddSubserviceDialog = (serviceId: string) => {
    setCurrentServiceId(serviceId);
    setSubserviceName('');
    setAddDialogOpen(true);
  };

  const handleEditSubserviceSubmit = () => {
    if (!subserviceName.trim()) {
      toast({
        title: "Error",
        description: "Subservice name cannot be empty",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    if (onEditSubservice) {
      onEditSubservice(currentServiceId, currentSubserviceId, { name: subserviceName });
      toast({
        title: "Success",
        description: "Subservice updated successfully",
        duration: 3000,
      });
    }
    setEditDialogOpen(false);
  };

  const handleDeleteSubserviceSubmit = () => {
    if (onDeleteSubservice) {
      onDeleteSubservice(currentServiceId, currentSubserviceId);
      toast({
        title: "Success",
        description: "Subservice deleted successfully",
        duration: 3000,
      });
    }
    setDeleteDialogOpen(false);
  };

  const handleAddSubserviceSubmit = () => {
    if (!subserviceName.trim()) {
      toast({
        title: "Error",
        description: "Subservice name cannot be empty",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    if (onAddSubservice) {
      onAddSubservice(currentServiceId, { 
        name: subserviceName, 
        enabled: true, 
        items: [] 
      });
      toast({
        title: "Success",
        description: "Subservice added successfully",
        duration: 3000,
      });
    }
    setAddDialogOpen(false);
  };

  if (filteredServices.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 text-center mt-4">
        <p className="text-gray-500">No services found. Try adjusting your search.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 mt-4">
      {filteredServices.map(service => (
        <div key={service.id} className="bg-gradient-to-r from-admin-primary/10 to-admin-primary/5 rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between p-4">
            <div 
              className="flex items-center flex-1 cursor-pointer"
              onClick={() => toggleServiceExpand(service.id)}
            >
              {expandedServices[service.id] ? 
                <ChevronDown className="h-5 w-5 text-admin-primary mr-3" /> : 
                <ChevronRight className="h-5 w-5 text-admin-primary mr-3" />
              }
              <div>
                <h3 className="font-medium text-admin-dark">{service.name}</h3>
                <p className="text-sm text-gray-500">
                  {service.subservices.length} subservices
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <span className="mr-2 text-sm text-gray-600">
                  {service.enabled ? "Enabled" : "Disabled"}
                </span>
                <Switch
                  checked={service.enabled}
                  onCheckedChange={() => onToggleService(service.id)}
                  className="data-[state=checked]:bg-emerald-500"
                />
              </div>
              
              <div className="flex items-center space-x-3">
                <Button variant="ghost" size="icon" onClick={(e) => {
                  e.stopPropagation();
                  handleEditService(service.id);
                }}>
                  <Edit className="h-5 w-5 text-gray-500" />
                </Button>
                <Button variant="ghost" size="icon" onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteService(service.id);
                }}>
                  <Trash className="h-5 w-5 text-gray-500" />
                </Button>
              </div>
            </div>
          </div>
          
          {expandedServices[service.id] && (
            <div className="border-t border-gray-100">
              {service.subservices.length > 0 ? (
                <>
                  {service.subservices.map((subservice) => (
                    <div 
                      key={subservice.id} 
                      className="p-4 pl-12 border-b border-gray-100 last:border-b-0 flex justify-between items-center bg-gradient-to-r from-admin-success/10 to-admin-success/5"
                    >
                      <div>
                        <h4 className="font-medium text-admin-dark">{subservice.name}</h4>
                      </div>
                      <div className="flex items-center space-x-6">
                        <div className="flex items-center">
                          <span className="mr-2 text-sm text-gray-600">
                            {subservice.enabled ? "Enabled" : "Disabled"}
                          </span>
                          <Switch
                            checked={subservice.enabled}
                            onCheckedChange={() => onToggleSubservice(service.id, subservice.id)}
                            className="data-[state=checked]:bg-emerald-500"
                          />
                        </div>
                        <div className="flex items-center space-x-3">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={(e) => openEditSubserviceDialog(e, service.id, subservice.id, subservice.name)}
                          >
                            <Edit className="h-5 w-5 text-admin-success" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={(e) => openDeleteSubserviceDialog(e, service.id, subservice.id)}
                          >
                            <Trash className="h-5 w-5 text-admin-success" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="p-3 pl-12 border-t border-gray-100 bg-white">
                    <Button 
                      variant="ghost" 
                      className="text-sm text-admin-success hover:text-admin-success/80 flex items-center"
                      onClick={() => openAddSubserviceDialog(service.id)}
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add Subservice
                    </Button>
                  </div>
                </>
              ) : (
                <div className="p-4 pl-12 flex flex-col items-start bg-white">
                  <p className="text-gray-500 text-sm mb-3">No subservices available</p>
                  <Button 
                    variant="ghost" 
                    className="text-sm text-admin-success hover:text-admin-success/80 flex items-center"
                    onClick={() => openAddSubserviceDialog(service.id)}
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Subservice
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      ))}

      {/* Edit Subservice Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Subservice</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="subservice-name" className="text-right">
                Name
              </Label>
              <Input
                id="subservice-name"
                value={subserviceName}
                onChange={(e) => setSubserviceName(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditSubserviceSubmit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Subservice Confirmation Dialog */}
      <ConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteSubserviceSubmit}
        title="Delete Subservice"
        description="Are you sure you want to delete this subservice? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />

      {/* Add Subservice Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Subservice</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-subservice-name" className="text-right">
                Name
              </Label>
              <Input
                id="new-subservice-name"
                value={subserviceName}
                onChange={(e) => setSubserviceName(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddSubserviceSubmit}>Add Subservice</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ServiceList;
