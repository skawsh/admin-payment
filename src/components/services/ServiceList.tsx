
import React, { useState, useEffect } from 'react';
import { Service, Subservice } from '@/types/serviceTypes';
import { ChevronRight, Edit, Trash, ChevronDown } from 'lucide-react';
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
  const [expandedServices, setExpandedServices] = useState<Record<string, boolean>>({});
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

  const toggleServiceExpand = (serviceId: string) => {
    setExpandedServices(prev => ({
      ...prev,
      [serviceId]: !prev[serviceId]
    }));
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
        <div key={service.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between p-4">
            <div 
              className="flex items-center flex-1 cursor-pointer"
              onClick={() => toggleServiceExpand(service.id)}
            >
              {expandedServices[service.id] ? 
                <ChevronDown className="h-5 w-5 text-gray-400 mr-3" /> : 
                <ChevronRight className="h-5 w-5 text-gray-400 mr-3" />
              }
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
          
          {expandedServices[service.id] && (
            <div className="border-t border-gray-100">
              {service.subservices.length > 0 ? (
                service.subservices.map((subservice) => (
                  <div 
                    key={subservice.id} 
                    className="p-4 pl-12 border-b border-gray-100 last:border-b-0 flex justify-between items-center"
                  >
                    <div>
                      <h4 className="font-medium text-gray-700">{subservice.name}</h4>
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
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 pl-12 text-gray-500 text-sm">
                  No subservices available
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ServiceList;
