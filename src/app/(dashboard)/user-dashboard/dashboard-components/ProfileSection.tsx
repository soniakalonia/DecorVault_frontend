'use client';

import { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
}

interface ProfileSectionProps {
  profileData: ProfileData;
  onSave: (_data: ProfileData) => void;
}

const ProfileSection = ({ profileData, onSave }: ProfileSectionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ProfileData>(profileData);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(profileData);
    setIsEditing(false);
  };

  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow-elevation-1">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-heading text-xl font-semibold text-card-foreground">
          Profile Information
        </h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center space-x-1 text-sm text-primary transition-smooth hover:text-primary/80"
          >
            <Icon name="PencilIcon" size={16} />
            <span>Edit</span>
          </button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="mb-1 block text-sm font-medium text-card-foreground">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full rounded-md border border-border bg-background px-4 py-2 text-sm text-foreground transition-smooth focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-card-foreground">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full rounded-md border border-border bg-background px-4 py-2 text-sm text-foreground transition-smooth focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <label htmlFor="phone" className="mb-1 block text-sm font-medium text-card-foreground">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
              pattern="[0-9]{10}"
              className="w-full rounded-md border border-border bg-background px-4 py-2 text-sm text-foreground transition-smooth focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <label
              htmlFor="dateOfBirth"
              className="mb-1 block text-sm font-medium text-card-foreground"
            >
              Date of Birth
            </label>
            <input
              type="text"
              id="dateOfBirth"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              placeholder="DD/MM/YYYY"
              className="w-full rounded-md border border-border bg-background px-4 py-2 text-sm text-foreground transition-smooth focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="flex space-x-3">
            <button
              type="submit"
              className="flex-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-smooth hover:scale-[0.97]"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-smooth hover:bg-muted"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <Icon name="UserIcon" size={20} className="mt-0.5 text-muted-foreground" />
            <div>
              <p className="caption text-muted-foreground">Full Name</p>
              <p className="text-sm font-medium text-card-foreground">{profileData.name}</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Icon name="EnvelopeIcon" size={20} className="mt-0.5 text-muted-foreground" />
            <div>
              <p className="caption text-muted-foreground">Email Address</p>
              <p className="text-sm font-medium text-card-foreground">{profileData.email}</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Icon name="PhoneIcon" size={20} className="mt-0.5 text-muted-foreground" />
            <div>
              <p className="caption text-muted-foreground">Phone Number</p>
              <p className="text-sm font-medium text-card-foreground">{profileData.phone}</p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Icon name="CakeIcon" size={20} className="mt-0.5 text-muted-foreground" />
            <div>
              <p className="caption text-muted-foreground">Date of Birth</p>
              <p className="text-sm font-medium text-card-foreground">{profileData.dateOfBirth}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSection;
