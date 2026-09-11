"use client";

import { useState, useEffect } from 'react';
import { useGetAdminProductsQuery, useDeleteAdminProductMutation } from '@/store/api/productsApi';
import Breadcrumb from '@/components/common/Breadcrumb';
import Icon from '@/components/ui/AppIcon';
import Image from 'next/image';
import { toast, ToastContainer } from 'react-toastify';

export default function ProductsPage() {
  const [mounted, setMounted] = useState(false);
  const { data: productsData, isLoading, error } = useGetAdminProductsQuery();
  const [deleteProduct] = useDeleteAdminProductMutation();

  const formatProductId = (rawId: unknown) => {
    const numericId = Number(rawId);
    if (!Number.isFinite(numericId)) {
      return rawId ? String(rawId) : '';
    }
    return `PRD-${numericId.toString().padStart(3, '0')}`;
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id).unwrap();
        toast.success('Product deleted successfully');
      } catch (err: any) {
        toast.error(err.data?.message || 'Failed to delete product');
      }
    }
  };

  const products = productsData?.data || [];

  if (!mounted) return null;
  if (isLoading) return <div className="p-6">Loading products...</div>;
  if (error) return <div className="p-6 text-red-500">Error loading products</div>;

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="flex-1 p-6 min-w-0 h-[calc(100vh-64px)] overflow-y-auto">
        <Breadcrumb />
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-espresso">Products ({products.length})</h1>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
            <div className="overflow-x-auto w-full">
              <table className="w-full text-sm min-w-[2500px]">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-28">ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Brand</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Discount</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Weight</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Materials</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Warranty</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Colors</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sizes</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Features</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tags</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Delivery</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Featured</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">New</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Admin</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {products.map((product: any) => {
                    let images = [];
                    let colors = [];
                    let sizes = [];
                    let features = [];
                    let tags = [];
                    
                    try {
                      // Handle both JSON strings and plain strings
                      images = typeof product.product_images === 'string' 
                        ? (product.product_images.startsWith('[') || product.product_images.startsWith('{') 
                            ? JSON.parse(product.product_images) 
                            : [product.product_images])
                        : (product.product_images || []);
                      
                      colors = typeof product.colors === 'string'
                        ? (product.colors.startsWith('[') ? JSON.parse(product.colors) : [product.colors])
                        : (product.colors || []);
                      
                      sizes = typeof product.sizes === 'string'
                        ? (product.sizes.startsWith('[') ? JSON.parse(product.sizes) : [product.sizes])
                        : (product.sizes || []);
                      
                      features = typeof product.features === 'string'
                        ? (product.features.startsWith('[') ? JSON.parse(product.features) : [product.features])
                        : (product.features || []);
                      
                      tags = typeof product.tags === 'string'
                        ? (product.tags.startsWith('[') ? JSON.parse(product.tags) : [product.tags])
                        : (product.tags || []);
                    } catch (e) {
                      console.warn('Failed to parse product JSON fields:', e);
                    }

                    return (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-mono text-xs whitespace-nowrap min-w-[100px]">
                          {formatProductId(product.id)}
                        </td>
                        <td className="px-4 py-3">
                          <Image
                            src={images[0] || '/placeholder.jpg'}
                            alt={product.name}
                            width={40}
                            height={40}
                            className="object-cover rounded"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-medium text-gray-900">{product.name}</div>
                          <div className="text-xs text-gray-500">{product.slug}</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-xs text-gray-700">{product.description}</div>
                        </td>
                        <td className="px-4 py-3 text-xs">{product.category}</td>
                        <td className="px-4 py-3 text-xs">{product.brand}</td>
                        <td className="px-4 py-3 text-xs">₹{product.price}</td>
                        <td className="px-4 py-3 text-xs font-medium text-green-600">₹{product.discount_price}</td>
                        <td className="px-4 py-3 text-xs">{product.stock_quantity}</td>
                        <td className="px-4 py-3 text-xs">{product.weight}kg</td>
                        <td className="px-4 py-3 text-xs">{product.materials}</td>
                        <td className="px-4 py-3 text-xs">{product.warranty}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1">
                            {colors.slice(0, 3).map((color: string, idx: number) => (
                              <div
                                key={idx}
                                className="w-4 h-4 rounded-full border"
                                style={{ backgroundColor: color }}
                                title={color}
                              />
                            ))}
                            {colors.length > 3 && <span className="text-xs">+{colors.length - 3}</span>}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs">
                          {sizes.slice(0, 2).join(', ')}
                          {sizes.length > 2 && ` +${sizes.length - 2}`}
                        </td>
                        <td className="px-4 py-3 text-xs">
                          {features.slice(0, 2).join(', ')}
                          {features.length > 2 && ` +${features.length - 2}`}
                        </td>
                        <td className="px-4 py-3 text-xs">
                          {tags.slice(0, 2).join(', ')}
                          {tags.length > 2 && ` +${tags.length - 2}`}
                        </td>
                        <td className="px-4 py-3 text-xs">₹{product.default_delivery_charge}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex px-2 py-1 text-xs rounded-full ${product.is_featured ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-600'
                            }`}>
                            {product.is_featured ? 'Yes' : 'No'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex px-2 py-1 text-xs rounded-full ${product.is_new_arrival ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'
                            }`}>
                            {product.is_new_arrival ? 'Yes' : 'No'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex px-2 py-1 text-xs rounded-full ${product.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                            }`}>
                            {product.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs">
                          <div>{product.admin_name}</div>
                          <div className="text-gray-500">{product.admin_email}</div>
                        </td>
                        <td className="px-4 py-3 text-xs">
                          {new Date(product.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center space-x-2">
                            <button
                              className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all active:scale-95"
                              title="View"
                              onClick={() => window.open(`/product-details/${product.slug}`, '_blank')}
                            >
                              <Icon name="EyeIcon" size={16} />
                            </button>
                            <button
                              className="p-1.5 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-all active:scale-95"
                              title="Edit"
                              onClick={() => window.location.href = `/admin-dashboard/addProduct?edit=${product.id}`}
                            >
                              <Icon name="PencilSquareIcon" size={16} />
                            </button>
                            <button
                              className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-all active:scale-95"
                              title="Delete"
                              onClick={() => handleDelete(product.id)}
                            >
                              <Icon name="TrashIcon" size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {products.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No products found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}