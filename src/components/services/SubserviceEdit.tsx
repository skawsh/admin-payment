
import React from 'react';
import { Subservice } from '@/types/serviceTypes';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ServiceModal } from './ServiceModals';

interface SubserviceEditProps {
  subservice?: Subservice;
  isOpen: boolean;
  onClose: () => void;
  onSave: (subservice: Partial<Subservice>) => void;
}

const SubserviceEdit: React.FC<SubserviceEditProps> = ({
  subservice,
  isOpen,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = React.useState<Partial<Subservice>>({
    name: subservice?.name || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <ServiceModal
      isOpen={isOpen}
      onClose={onClose}
      onSave={handleSave}
      title={subservice ? 'Edit Subservice' : 'Add New Subservice'}
      description="Configure subservice details"
    >
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Subservice Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Wash & Fold"
          />
        </div>
      </div>
    </ServiceModal>
  );
};

export default SubserviceEdit;
