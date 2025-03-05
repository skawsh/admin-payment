
import React, { useState, useEffect } from 'react';
import { Service, Subservice } from '@/types/serviceTypes';
import { ChevronRight, Edit, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';

interface ServiceListProps {
  services: Service[];
  searchTerm: string;
  onAddItem: (serviceId: string, subserviceId: string, item: any) => void;
  onToggleService: (serviceId: string) => void;
  onToggleSubservice: (serviceId: string, subserviceId: string) => void;
}

const ServiceList: React.FC<ServiceListProps> = ({
  services,
  searchTerm,
  onAddItem,
  onToggleService,
  onToggleSubservice
}) => {
  const [filteredServices, setFilteredServices] = useState<Service[]>(services);
  const { toast } = useToast();

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
        <div key={service.id} className="bg-white rounded-lg shadow-sm border border-gray.8 overflow-hidden">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center flex-1">
              <ChevronRight className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <h3 className="font-medium">{service.name}</h3>
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
        </div>
      ))}
    </div>
  );
};

export default ServiceList;
