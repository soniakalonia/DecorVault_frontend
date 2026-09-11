'use client';

import { useState, useEffect } from 'react';
import Breadcrumb from '@/components/common/Breadcrumb';
import { config } from '@/config/env';
import { toast } from 'react-toastify';

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  status: 'active' | 'inactive';
  parent_id: number | null;
  display_order: number;
  meta_title: string | null;
  meta_description: string | null;
  is_featured: boolean;
  show_in_menu: boolean;
  product_count?: number;
  created_at: string;
}

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: null as File | null,
    status: 'active',
    parent_id: null as number | null,
    display_order: 0,
    meta_title: '',
    meta_description: '',
    is_featured: false,
    show_in_menu: true
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [parentCategories, setParentCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetchCategories();
    fetchParentCategories();
  }, [pagination.currentPage, searchTerm, statusFilter]);

  const fetchParentCategories = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        return;
      }

      const apiUrl = config.apiUrl || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      
      const response = await fetch(`${apiUrl}/admin/categories/list`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      if (response.ok && data.success) {
        setParentCategories(data.categories || []);
      }
    } catch (error) {
      console.error('Error fetching parent categories:', error);
    }
  };

  const fetchCategories = async () => {
    setIsFetching(true);
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        toast.error('Please login first');
        setIsFetching(false);
        return;
      }

      const apiUrl = config.apiUrl || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      
      const params = new URLSearchParams({
        page: pagination.currentPage.toString(),
        limit: pagination.itemsPerPage.toString()
      });
      
      if (searchTerm) params.append('search', searchTerm);
      if (statusFilter !== 'all') params.append('status', statusFilter);
      
      const response = await fetch(`${apiUrl}/admin/categories?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();

      if (response.ok && data.success) {
        setCategories(data.categories || []);
        setPagination({
          currentPage: data.currentPage || 1,
          totalPages: data.totalPages || 1,
          totalItems: data.totalItems || 0,
          itemsPerPage: data.itemsPerPage || 10
        });
      } else {
        console.error('Failed to fetch categories:', data.message);
        toast.error(data.message || 'Failed to fetch categories');
      }
    } catch (error: any) {
      console.error('Error fetching categories:', error);
      toast.error('Network error while fetching categories');
    } finally {
      setIsFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Category name is required');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        toast.error('Please login again');
        setLoading(false);
        return;
      }

      const apiUrl = config.apiUrl || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

      const url = editingId
        ? `${apiUrl}/admin/category/${editingId}`
        : `${apiUrl}/admin/category`;

      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name.trim());
      formDataToSend.append('description', formData.description || '');
      formDataToSend.append('status', formData.status);
      formDataToSend.append('parent_id', formData.parent_id?.toString() || '');
      formDataToSend.append('display_order', formData.display_order.toString());
      formDataToSend.append('meta_title', formData.meta_title || '');
      formDataToSend.append('meta_description', formData.meta_description || '');
      formDataToSend.append('is_featured', formData.is_featured ? '1' : '0');
      formDataToSend.append('show_in_menu', formData.show_in_menu ? '1' : '0');
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

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success(data.message || `Category ${editingId ? 'updated' : 'created'} successfully`);
        closeModal();
        fetchCategories();
        fetchParentCategories();
      } else {
        toast.error(data.message || 'Failed to save category');
      }
    } catch (error: any) {
      console.error('Error saving category:', error);
      toast.error('Network error while saving category');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (category: Category) => {
    setFormData({
      name: category.name,
      description: category.description || '',
      image: null,
      status: category.status,
      parent_id: category.parent_id,
      display_order: category.display_order || 0,
      meta_title: category.meta_title || '',
      meta_description: category.meta_description || '',
      is_featured: category.is_featured || false,
      show_in_menu: category.show_in_menu !== undefined ? category.show_in_menu : true
    });
    setEditingId(category.id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
  setIsDeleting(id);
  try {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      toast.error('Please login again');
      setIsDeleting(null);
      return;
    }

    const apiUrl = config.apiUrl || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    
    const response = await fetch(`${apiUrl}/admin/category/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (response.ok && data.success) {
      toast.success('Category deleted successfully');
      fetchCategories();
      fetchParentCategories();
    } else {
      toast.error(data.message || 'Failed to delete category');
    }
  } catch (error: any) {
    console.error('Error deleting category:', error);
    toast.error('Network error while deleting category');
  } finally {
    setIsDeleting(null);
  }
};

  const openModal = () => {
    setFormData({
      name: '',
      description: '',
      image: null,
      status: 'active',
      parent_id: null,
      display_order: 0,
      meta_title: '',
      meta_description: '',
      is_featured: false,
      show_in_menu: true
    });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({
      name: '',
      description: '',
      image: null,
      status: 'active',
      parent_id: null,
      display_order: 0,
      meta_title: '',
      meta_description: '',
      is_featured: false,
      show_in_menu: true
    });
    setEditingId(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      setFormData({ ...formData, image: file });
    }
  };

  const changePage = (page: number) => {
    if (page >= 1 && page <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, currentPage: page }));
    }
  };

  const getPageNumbers = (): (number | string)[] => {
    const total = pagination.totalPages;
    const current = pagination.currentPage;
    const delta = 2;
    const range: number[] = [];
    const rangeWithDots: (number | string)[] = [];
    let l: number | undefined;

    for (let i = 1; i <= total; i++) {
      if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
        range.push(i);
      }
    }

    for (const i of range) {
      if (l !== undefined) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  };

  return (
    <div className="flex-1 p-4 md:p-6">
      <Breadcrumb />
      
      <div className="space-y-6">
        {/* Header with Add Button - HIGHLY VISIBLE */}
        <div className="flex flex-wrap justify-between items-center gap-4 bg-gradient-to-r from-espresso/5 to-secondary/5 p-4 md:p-6 rounded-xl border-2 border-espresso/10">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-espresso">Categories</h1>
            <p className="text-sm text-mocha-grey mt-1">
              Manage your product categories ({pagination.totalItems} total)
            </p>
          </div>
          
          {/* ADD CATEGORY BUTTON - BIG, BOLD, AND VISIBLE */}
          <button
            onClick={openModal}
            className="bg-espresso hover:bg-opacity-90 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 text-base md:text-lg border-2 border-espresso/20"
            style={{ 
              minWidth: '200px', 
              justifyContent: 'center',
              backgroundColor: '#1a1a1a',
              color: '#ffffff'
            }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
             Add New Category
          </button>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl shadow-sm border border-border">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-espresso transition-all"
            />
          </div>
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full md:w-auto p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-espresso transition-all"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Categories Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
          <div className="p-4 md:p-6 border-b border-border bg-gray-50">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">All Categories</h2>
              <span className="text-sm text-mocha-grey">
                {pagination.totalItems} {pagination.totalItems === 1 ? 'category' : 'categories'}
              </span>
            </div>
          </div>

          {isFetching ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-espresso border-t-transparent"></div>
              <p className="mt-2 text-gray-500">Loading categories...</p>
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-12 px-4">
              <div className="text-6xl mb-4">📂</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Categories Found</h3>
              <p className="text-gray-500 mb-4">Create your first category to get started!</p>
              <button
                onClick={openModal}
                className="bg-espresso text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition-all shadow-md hover:shadow-lg font-medium"
              >
                 Create Your First Category
              </button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                        Slug
                      </th>
                      <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                        Created
                      </th>
                      <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {categories.map((category) => (
                      <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {category.id}
                        </td>
                        <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{category.name}</div>
                        </td>
                        <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell">
                          {category.slug}
                        </td>
                        <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            category.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {category.status}
                          </span>
                        </td>
                        <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                          {new Date(category.created_at).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </td>
                        <td className="px-4 md:px-6 py-4 whitespace-nowrap space-x-2">
                          <button
                            onClick={() => handleEdit(category)}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(category.id)}
                            disabled={isDeleting === category.id}
                            className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isDeleting === category.id ? 'Deleting...' : 'Delete'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="px-4 md:px-6 py-4 border-t border-border bg-gray-50">
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="text-sm text-gray-500">
                      Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} -{' '}
                      {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of{' '}
                      {pagination.totalItems} categories
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => changePage(pagination.currentPage - 1)}
                        disabled={pagination.currentPage === 1}
                        className="px-3 py-1 border border-border rounded-lg text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Previous
                      </button>
                      {getPageNumbers().map((page, index) => (
                        <button
                          key={index}
                          onClick={() => typeof page === 'number' ? changePage(page) : undefined}
                          className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                            page === pagination.currentPage
                              ? 'bg-espresso text-white'
                              : typeof page === 'number'
                              ? 'border border-border hover:bg-gray-100'
                              : 'cursor-default'
                          }`}
                          disabled={typeof page !== 'number'}
                        >
                          {page}
                        </button>
                      ))}
                      <button
                        onClick={() => changePage(pagination.currentPage + 1)}
                        disabled={pagination.currentPage === pagination.totalPages}
                        className="px-3 py-1 border border-border rounded-lg text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modal - Full Feature Form */}
 {/* Modal - Full Feature Form */}
{isModalOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col animate-scaleIn">
      
      {/* Header - Fixed */}
      <div className="p-6 border-b border-border bg-white rounded-t-2xl flex-shrink-0">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">
              {editingId ? 'Edit Category' : 'Add New Category'}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {editingId ? 'Update category details' : 'Create a new category'}
            </p>
          </div>
          <button
            onClick={closeModal}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider border-b pb-2">
            Basic Information
          </h3>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              Category Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter category name"
              className="w-full p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-espresso transition-all"
              required
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter category description"
              rows={3}
              className="w-full p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-espresso transition-all resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Parent Category
              </label>
              <select
                value={formData.parent_id || ''}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  parent_id: e.target.value ? parseInt(e.target.value) : null 
                })}
                className="w-full p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-espresso transition-all"
              >
                <option value="">None (Top Level)</option>
                {parentCategories
                  .filter(cat => cat.id !== editingId)
                  .map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Display Order
              </label>
              <input
                type="number"
                value={formData.display_order}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  display_order: parseInt(e.target.value) || 0 
                })}
                min="0"
                className="w-full p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-espresso transition-all"
              />
              <p className="text-xs text-gray-400 mt-1">Lower numbers appear first</p>
            </div>
          </div>
        </div>

        {/* Image */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider border-b pb-2">
            Image
          </h3>
          <div>
            <label className="block text-sm font-medium mb-2">
              Category Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-espresso transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-espresso file:text-white hover:file:bg-opacity-90"
            />
            <p className="text-xs text-mocha-grey mt-1">
              Supported formats: JPG, PNG, GIF. Max size: 5MB
            </p>
          </div>
        </div>

        {/* Status & Settings */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider border-b pb-2">
            Status & Settings
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                className="w-full p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-espresso transition-all"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Display Options
              </label>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      is_featured: e.target.checked 
                    })}
                    className="w-4 h-4 text-espresso focus:ring-espresso border-gray-300 rounded"
                  />
                  <span className="text-sm">Feature this category</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.show_in_menu}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      show_in_menu: e.target.checked 
                    })}
                    className="w-4 h-4 text-espresso focus:ring-espresso border-gray-300 rounded"
                  />
                  <span className="text-sm">Show in main menu</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* SEO Information */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider border-b pb-2">
            SEO Information
          </h3>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              Meta Title
            </label>
            <input
              type="text"
              value={formData.meta_title}
              onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
              placeholder="SEO title (max 60 characters)"
              maxLength={60}
              className="w-full p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-espresso transition-all"
            />
            <p className="text-xs text-gray-400 mt-1">
              {formData.meta_title.length}/60 characters
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Meta Description
            </label>
            <textarea
              value={formData.meta_description}
              onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
              placeholder="SEO description (max 160 characters)"
              maxLength={160}
              rows={2}
              className="w-full p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-espresso transition-all resize-none"
            />
            <p className="text-xs text-gray-400 mt-1">
              {formData.meta_description.length}/160 characters
            </p>
          </div>
        </div>
      </div>

      {/* Footer - ALWAYS VISIBLE AT BOTTOM */}
      <div className="p-6 border-t border-border bg-white rounded-b-2xl flex-shrink-0 shadow-lg" style={{ position: 'sticky', bottom: 0 }}>
        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-espresso text-white px-6 py-3 rounded-lg hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium text-base min-h-[50px]"
            style={{ backgroundColor: '#1a1a1a', color: '#ffffff' }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </span>
            ) : (
              editingId ? 'Update Category' : 'Create Category'
            )}
          </button>
          <button
            type="button"
            onClick={closeModal}
            className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-all font-medium text-base min-h-[50px]"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
)}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { 
            opacity: 0;
            transform: scale(0.9);
          }
          to { 
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}