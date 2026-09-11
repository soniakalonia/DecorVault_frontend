'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Breadcrumb from '@/components/common/Breadcrumb';
// ❌ REMOVED: import AdminSidebar from '../components/AdminSidebar';
import { config } from '@/config/env';

interface Brand {
  id: number;
  name: string;
  slug: string;
  image: string;
  status: 'active' | 'inactive';
  created_at: string;
}

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', image: null as File | null, status: 'active' });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchBrands = useCallback(async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${config.apiUrl}/admin/brands`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) setBrands(data.brands);
    } catch (error) {
      console.error('Error fetching brands:', error);
    }
  }, []);

  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        alert('No authentication token found. Please login again.');
        return;
      }

      const url = editingId
        ? `${config.apiUrl}/admin/brand/${editingId}`
        : `${config.apiUrl}/admin/brand`;

      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('status', formData.status);
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      const response = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      if (response.ok) {
        fetchBrands();
        resetForm();
      }
    } catch (error) {
      console.error('Error saving brand:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (brand: Brand) => {
    setFormData({ name: brand.name, image: null, status: brand.status });
    setEditingId(brand.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this brand?')) return;

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${config.apiUrl}/admin/brand/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) fetchBrands();
    } catch (error) {
      console.error('Error deleting brand:', error);
    }
  };

  const resetForm = () => {
    setFormData({ name: '', image: null, status: 'active' });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="flex-1 p-6">
      <Breadcrumb />
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-espresso">Brands</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-espresso text-white px-4 py-2 rounded-lg hover:bg-opacity-90"
          >
            {showForm ? 'Cancel' : 'Add Brand'}
          </button>
        </div>

        {showForm && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-border">
            <h2 className="text-xl font-semibold mb-4">
              {editingId ? 'Edit Brand' : 'Add New Brand'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-espresso"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFormData({ ...formData, image: e.target.files?.[0] || null })}
                  className="w-full p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-espresso"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                  className="w-full p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-espresso"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-espresso text-white px-6 py-2 rounded-lg hover:bg-opacity-90 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : editingId ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-opacity-90"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-border ">
          <div className="p-6 border-b border-border">
            <h2 className="text-xl font-semibold">All Brands</h2>
          </div>
          <div className="overflow-x-auto sm:overflow-visible">
            <table className="min-w-[800px] sm:min-w-full w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {brands.map((brand) => (
                  <tr key={brand.id}>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">{brand.name}</td>
                    <td className="px-6 py-4">
                      {brand.image && brand.image.trim() ? (
                        <Image
                          src={brand.image.startsWith('http') ? brand.image : `${config.apiUrl.replace('/api', '')}${brand.image}`}
                          alt={brand.name}
                          width={48}
                          height={48}
                          className="w-12 h-12 object-cover rounded"
                        />
                      ) : (
                        <span className="text-gray-400">No image</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${brand.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                        {brand.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      {new Date(brand.created_at).toLocaleDateString('en-GB')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap space-x-2">
                      <button
                        onClick={() => handleEdit(brand)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(brand.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {brands.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No brands found. Create your first brand!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}