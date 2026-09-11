'use client';

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import {
    useGetUserAddressesQuery,
    useAddAddressMutation,
    useSetDefaultAddressMutation,
} from '@/store/api/orderApi';
import Icon from '@/components/ui/AppIcon';
import { toast } from 'react-toastify';

interface Address {
    id: string;
    name: string;
    phone: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    pincode: string;
    isDefault: boolean;
}

interface DeliveryAddressFormProps {
    onAddressSelect: (address: Address) => void;
    selectedAddressId: string | null;
}

const DeliveryAddressForm: React.FC<DeliveryAddressFormProps> = ({
    onAddressSelect,
    selectedAddressId,
}) => {
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);
    const [showNewAddressForm, setShowNewAddressForm] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(selectedAddressId);

    const { data: addressesData, isLoading, refetch } = useGetUserAddressesQuery(undefined, {
        skip: !isAuthenticated,
    });

    const [addAddress, { isLoading: isAdding }] = useAddAddressMutation();
    const [setDefaultAddress] = useSetDefaultAddressMutation();

    const [newAddress, setNewAddress] = useState({
        name: '',
        phone: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        pincode: '',
        isDefault: false,
    });

    const addresses = addressesData?.addresses || [];

    useEffect(() => {
        if (addresses.length > 0 && !selectedId) {
            const defaultAddress = addresses.find((a: Address) => a.isDefault);
            if (defaultAddress) {
                setSelectedId(defaultAddress.id);
                onAddressSelect(defaultAddress);
            } else {
                setSelectedId(addresses[0].id);
                onAddressSelect(addresses[0]);
            }
        }
    }, [addresses, selectedId, onAddressSelect]);

    const handleAddressSelect = (address: Address) => {
        setSelectedId(address.id);
        onAddressSelect(address);
    };

    const handleAddAddress = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const result = await addAddress(newAddress).unwrap();
            if (result.success) {
                toast.success('Address added successfully');
                setShowNewAddressForm(false);
                setNewAddress({
                    name: '',
                    phone: '',
                    addressLine1: '',
                    addressLine2: '',
                    city: '',
                    state: '',
                    pincode: '',
                    isDefault: false,
                });
                refetch();
            }
        } catch (error: any) {
            toast.error(error?.data?.message || 'Failed to add address');
        }
    };

    const handleSetDefault = async (addressId: string) => {
        try {
            await setDefaultAddress(addressId).unwrap();
            toast.success('Default address updated');
            refetch();
        } catch (error: any) {
            toast.error(error?.data?.message || 'Failed to set default address');
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center py-8">
                <Icon name="ArrowPathIcon" size={24} className="animate-spin text-[#FF6B8A]" />
            </div>
        );
    }

    return (
        <div>
            <h3 className="mb-4 font-heading text-lg font-semibold text-[#1A2A3A]">
                Delivery Address
            </h3>

            {addresses.length === 0 && !showNewAddressForm ? (
                <div className="text-center py-6">
                    <p className="text-[#6B7280]">No saved addresses</p>
                    <button
                        onClick={() => setShowNewAddressForm(true)}
                        className="mt-3 text-sm font-medium text-[#FF6B8A] transition-colors hover:text-[#e85a7a]"
                    >
                        + Add New Address
                    </button>
                </div>
            ) : (
                <div className="space-y-3">
                    {addresses.map((address: Address) => (
                        <div
                            key={address.id}
                            className={`rounded-lg border-2 p-4 cursor-pointer transition-all duration-200 ${selectedId === address.id
                                    ? 'border-[#FF6B8A] bg-[#FFE0E8]'
                                    : 'border-gray-200 hover:border-[#FF6B8A] hover:bg-[#FFF5F7]'
                                }`}
                            onClick={() => handleAddressSelect(address)}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <p className="font-medium text-[#1A2A3A]">{address.name}</p>
                                        {address.isDefault && (
                                            <span className="rounded-full bg-[#FF6B8A] px-2 py-0.5 text-xs text-white">
                                                Default
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-[#6B7280]">{address.phone}</p>
                                    <p className="text-sm text-[#1A2A3A]">
                                        {address.addressLine1}
                                        {address.addressLine2 && `, ${address.addressLine2}`}
                                    </p>
                                    <p className="text-sm text-[#1A2A3A]">
                                        {address.city}, {address.state} - {address.pincode}
                                    </p>
                                </div>
                                {selectedId === address.id && (
                                    <Icon name="CheckCircleIcon" size={24} className="text-[#FF6B8A]" />
                                )}
                            </div>
                            {!address.isDefault && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleSetDefault(address.id);
                                    }}
                                    className="mt-2 text-xs text-[#6B7280] transition-colors hover:text-[#FF6B8A]"
                                >
                                    Set as Default
                                </button>
                            )}
                        </div>
                    ))}

                    <button
                        onClick={() => setShowNewAddressForm(true)}
                        className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 py-3 text-sm text-[#6B7280] transition-all hover:border-[#FF6B8A] hover:text-[#FF6B8A]"
                    >
                        <Icon name="PlusIcon" size={16} />
                        Add New Address
                    </button>
                </div>
            )}

            {/* New Address Form */}
            {showNewAddressForm && (
                <div className="mt-4 rounded-lg border border-gray-200 p-4">
                    <h4 className="mb-3 font-medium text-[#1A2A3A]">Add New Address</h4>
                    <form onSubmit={handleAddAddress} className="space-y-3">
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <input
                                type="text"
                                placeholder="Full Name"
                                value={newAddress.name}
                                onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                                className="rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-[#FF6B8A] focus:outline-none focus:ring-1 focus:ring-[#FF6B8A]"
                                required
                            />
                            <input
                                type="tel"
                                placeholder="Phone Number"
                                value={newAddress.phone}
                                onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                                className="rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-[#FF6B8A] focus:outline-none focus:ring-1 focus:ring-[#FF6B8A]"
                                required
                            />
                        </div>
                        <input
                            type="text"
                            placeholder="Address Line 1"
                            value={newAddress.addressLine1}
                            onChange={(e) => setNewAddress({ ...newAddress, addressLine1: e.target.value })}
                            className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-[#FF6B8A] focus:outline-none focus:ring-1 focus:ring-[#FF6B8A]"
                            required
                        />
                        <input
                            type="text"
                            placeholder="Address Line 2 (Optional)"
                            value={newAddress.addressLine2}
                            onChange={(e) => setNewAddress({ ...newAddress, addressLine2: e.target.value })}
                            className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-[#FF6B8A] focus:outline-none focus:ring-1 focus:ring-[#FF6B8A]"
                        />
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                            <input
                                type="text"
                                placeholder="City"
                                value={newAddress.city}
                                onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                                className="rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-[#FF6B8A] focus:outline-none focus:ring-1 focus:ring-[#FF6B8A]"
                                required
                            />
                            <input
                                type="text"
                                placeholder="State"
                                value={newAddress.state}
                                onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                                className="rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-[#FF6B8A] focus:outline-none focus:ring-1 focus:ring-[#FF6B8A]"
                                required
                            />
                            <input
                                type="text"
                                placeholder="Pincode"
                                value={newAddress.pincode}
                                onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                                className="rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-[#FF6B8A] focus:outline-none focus:ring-1 focus:ring-[#FF6B8A]"
                                required
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="isDefault"
                                checked={newAddress.isDefault}
                                onChange={(e) => setNewAddress({ ...newAddress, isDefault: e.target.checked })}
                                className="h-4 w-4 rounded border-gray-300 text-[#FF6B8A] focus:ring-[#FF6B8A]"
                            />
                            <label htmlFor="isDefault" className="text-sm text-[#1A2A3A]">
                                Set as default address
                            </label>
                        </div>
                        <div className="flex gap-3">
                            <button
                                type="submit"
                                disabled={isAdding}
                                className="rounded-md bg-[#FF6B8A] px-4 py-2 text-sm text-white transition-all hover:scale-[0.98] disabled:opacity-50"
                            >
                                {isAdding ? 'Adding...' : 'Add Address'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowNewAddressForm(false)}
                                className="rounded-md border border-gray-300 px-4 py-2 text-sm text-[#6B7280] transition-all hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default DeliveryAddressForm;