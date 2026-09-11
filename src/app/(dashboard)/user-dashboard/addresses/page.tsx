'use client'

import { useGetUserAddressesQuery } from '@/store/api/addressesApi'

export default function AddressesPage() {
  const { data, isLoading, error } = useGetUserAddressesQuery()

  return (
    <div>
      <h1 className="text-2xl font-bold text-espresso font-heading mb-4">Manage Addresses</h1>
      <div className="bg-white p-6 rounded-2xl shadow-elevation-1 border border-border">
        {isLoading && <p className="text-mocha-grey">Loading...</p>}
        {error && <p className="text-red-600">Error loading addresses</p>}
        {data?.addresses && data.addresses.length === 0 && (
          <p className="text-mocha-grey">No addresses found.</p>
        )}
        {data?.addresses && data.addresses.length > 0 && (
          <div className="grid gap-4">
            {data.addresses.map((address) => (
              <div key={address.id} className="border rounded-lg p-4 relative">
                {address.is_default && (
                  <span className="absolute top-2 right-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Default</span>
                )}
                <h3 className="font-semibold text-lg">{address.name}</h3>
                <p className="text-mocha-grey">{address.phone}</p>
                <p className="mt-2">{address.address_line1}</p>
                {address.address_line2 && <p>{address.address_line2}</p>}
                <p>{address.city}, {address.state} - {address.pincode}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
