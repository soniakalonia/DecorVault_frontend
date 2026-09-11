"use client";

import { useState, useEffect } from 'react';
import { 
  useGetInventoryQuery, 
  useUpdateStockMutation, 
  useGetLowStockProductsQuery, 
  useGetInventoryStatsQuery 
} from '@/store/api/productsApi';
// ❌ REMOVED: import AdminSidebar from '../components/AdminSidebar';
import Breadcrumb from '@/components/common/Breadcrumb';
import Icon from '@/components/ui/AppIcon';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function InventoryPage() {
  const [mounted, setMounted] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [stockAction, setStockAction] = useState<'set' | 'add' | 'subtract'>('set');
  const [stockQuantity, setStockQuantity] = useState('');
  const [lowStockThreshold, setLowStockThreshold] = useState(10);
  const [activeTab, setActiveTab] = useState<'all' | 'low-stock'>('all');

  const { data: inventoryData, isLoading: inventoryLoading } = useGetInventoryQuery();
  const { data: lowStockData, isLoading: lowStockLoading } = useGetLowStockProductsQuery({ threshold: lowStockThreshold });
  const { data: statsData, isLoading: statsLoading } = useGetInventoryStatsQuery();
  const [updateStock] = useUpdateStockMutation();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleStockUpdate = async () => {
    if (!selectedProduct || !stockQuantity) {
      toast.error('Please select a product and enter stock quantity');
      return;
    }

    try {
      await updateStock({
        id: selectedProduct.id,
        stock_quantity: parseInt(stockQuantity),
        action: stockAction
      }).unwrap();
      
      toast.success('Stock updated successfully');
      setSelectedProduct(null);
      setStockQuantity('');
    } catch (err: any) {
      toast.error(err.data?.message || 'Failed to update stock');
    }
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: 'Out of Stock', color: 'bg-red-100 text-red-800' };
    if (stock <= lowStockThreshold) return { label: 'Low Stock', color: 'bg-yellow-100 text-yellow-800' };
    return { label: 'In Stock', color: 'bg-green-100 text-green-800' };
  };

  const inventory = inventoryData?.data || [];
  const lowStock = lowStockData?.data || [];
  const stats = statsData?.data || {};

  if (!mounted) return <div className="p-6">Loading...</div>;

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="flex-1 p-6 min-w-0 h-[calc(100vh-64px)] overflow-y-auto">
        <Breadcrumb />
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-espresso">Inventory Management</h1>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Products</p>
                  <p className="text-2xl font-bold text-gray-900">{statsLoading ? '...' : stats.totalProducts || 0}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Icon name="CubeIcon" size={24} className="text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Low Stock Items</p>
                  <p className="text-2xl font-bold text-yellow-600">{statsLoading ? '...' : stats.lowStockProducts || 0}</p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <Icon name="ExclamationTriangleIcon" size={24} className="text-yellow-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Out of Stock</p>
                  <p className="text-2xl font-bold text-red-600">{statsLoading ? '...' : stats.outOfStockProducts || 0}</p>
                </div>
                <div className="p-3 bg-red-100 rounded-full">
                  <Icon name="XCircleIcon" size={24} className="text-red-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Value</p>
                  <p className="text-2xl font-bold text-green-600">₹{statsLoading ? '...' : (stats.totalInventoryValue || 0).toLocaleString()}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <Icon name="CurrencyRupeeIcon" size={24} className="text-green-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-2xl shadow-sm border border-border">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'all'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  All Inventory ({inventory.length})
                </button>
                <button
                  onClick={() => setActiveTab('low-stock')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'low-stock'
                      ? 'border-yellow-500 text-yellow-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Low Stock ({lowStock.length})
                </button>
              </nav>
            </div>

            {/* Low Stock Threshold Setting */}
            {activeTab === 'low-stock' && (
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center space-x-4">
                  <label className="text-sm font-medium text-gray-700">Low Stock Threshold:</label>
                  <input
                    type="number"
                    value={lowStockThreshold}
                    onChange={(e) => setLowStockThreshold(parseInt(e.target.value) || 10)}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm w-20"
                    min="1"
                  />
                  <span className="text-sm text-gray-500">items or less</span>
                </div>
              </div>
            )}

            {/* Inventory Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Brand</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {(activeTab === 'all' ? inventory : lowStock).map((product: any) => {
                    const stockStatus = getStockStatus(product.stock_quantity);
                    let images = [];
                    try {
                      images = JSON.parse(product.product_images || '[]');
                    } catch (e) {
                      console.warn('Failed to parse product images:', e);
                      images = [];
                    }
                    
                    return (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              {images[0] ? (
                                <img
                                  src={images[0]}
                                  alt={product.name}
                                  className="h-10 w-10 rounded-lg object-cover"
                                />
                              ) : (
                                <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center">
                                  <Icon name="CubeIcon" size={20} className="text-gray-500" />
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{product.name}</div>
                              <div className="text-sm text-gray-500">{product.slug}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{product.category}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{product.brand || 'N/A'}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">₹{product.price}</td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{product.stock_quantity}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-1 text-xs rounded-full ${stockStatus.color}`}>
                            {stockStatus.label}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => setSelectedProduct(product)}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            Update Stock
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {(activeTab === 'all' ? inventoryLoading : lowStockLoading) && (
              <div className="text-center py-12">
                <p className="text-gray-500">Loading inventory...</p>
              </div>
            )}

            {(activeTab === 'all' ? inventory : lowStock).length === 0 && !(activeTab === 'all' ? inventoryLoading : lowStockLoading) && (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  {activeTab === 'all' ? 'No products found' : 'No low stock products'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stock Update Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Update Stock</h3>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <Icon name="XMarkIcon" size={20} />
                </button>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600">Product: <span className="font-medium">{selectedProduct.name}</span></p>
                <p className="text-sm text-gray-600">Current Stock: <span className="font-medium">{selectedProduct.stock_quantity}</span></p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Action</label>
                  <select
                    value={stockAction}
                    onChange={(e) => setStockAction(e.target.value as 'set' | 'add' | 'subtract')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="set">Set Stock To</option>
                    <option value="add">Add Stock</option>
                    <option value="subtract">Subtract Stock</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                  <input
                    type="number"
                    value={stockQuantity}
                    onChange={(e) => setStockQuantity(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter quantity"
                    min="0"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStockUpdate}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Update Stock
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}