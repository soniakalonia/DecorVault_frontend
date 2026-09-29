'use client';

import { useState } from 'react';
import Breadcrumb from '@/components/common/Breadcrumb';
import { toast } from 'react-toastify';
import {
  Plus,
  Edit,
  Trash2,
  Percent,
  DollarSign,
  Truck,
  Gift,
  X,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import {
  useGetCouponsQuery,
  useGetCouponStatsQuery,
  useCreateCouponMutation,
  useUpdateCouponMutation,
  useDeleteCouponMutation,
  type Coupon,
  type CouponFormData,
  type CouponType,
  type CouponStatus,
} from '@/store/api/couponApi';

/* ---------------------------- Form Defaults ---------------------------- */

const emptyForm: CouponFormData = {
  code: '',
  name: '',
  description: '',
  type: 'percentage',
  value: 0,
  minimum_amount: 0,
  maximum_discount: 0,
  usage_limit: 0,
  user_limit: 1,
  applicable_to: 'all',
  applicable_ids: [],
  start_date: '',
  end_date: '',
  status: 'active',
};

/* -------------------------------- Page -------------------------------- */

export default function CouponsPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [deletingCoupon, setDeletingCoupon] = useState<Coupon | null>(null);
  const [formData, setFormData] = useState<CouponFormData>(emptyForm);

  const {
    data: couponsRes,
    isLoading: couponsLoading,
    isFetching: couponsFetching,
    isError: couponsError,
    refetch: refetchCoupons,
  } = useGetCouponsQuery({ limit: 200 });

  const { data: statsRes, isLoading: statsLoading } = useGetCouponStatsQuery();

  const [createCoupon, { isLoading: creating }] = useCreateCouponMutation();
  const [updateCoupon, { isLoading: updating }] = useUpdateCouponMutation();
  const [deleteCoupon, { isLoading: deleting }] = useDeleteCouponMutation();

  const coupons = couponsRes?.data ?? [];
  const stats = statsRes?.data ?? {
    totalCoupons: 0,
    activeCoupons: 0,
    expiredCoupons: 0,
    totalUsage: 0,
    totalDiscountGiven: 0,
  };

  const saving = creating || updating;

  /* ------------------------------ Helpers ----------------------------- */

  const resetForm = () => {
    setFormData(emptyForm);
    setEditingCoupon(null);
    setShowForm(false);
  };

  const handleEdit = (coupon: Coupon) => {
    setFormData({
      code: coupon.code,
      name: coupon.name,
      description: coupon.description || '',
      type: coupon.type,
      value: coupon.value,
      minimum_amount: coupon.minimum_amount ?? 0,
      maximum_discount: coupon.maximum_discount ?? 0,
      usage_limit: coupon.usage_limit ?? 0,
      user_limit: coupon.user_limit ?? 1,
      applicable_to: coupon.applicable_to ?? 'all',
      applicable_ids: coupon.applicable_ids ?? [],
      start_date: coupon.start_date ? coupon.start_date.split('T')[0] : '',
      end_date: coupon.end_date ? coupon.end_date.split('T')[0] : '',
      status: coupon.status,
    });
    setEditingCoupon(coupon);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.code.trim() || !formData.name.trim()) {
      toast.error('Code and name are required');
      return;
    }
    if (!formData.start_date || !formData.end_date) {
      toast.error('Start and end dates are required');
      return;
    }
    if (new Date(formData.start_date) > new Date(formData.end_date)) {
      toast.error('Start date cannot be after end date');
      return;
    }

    try {
      const payload: CouponFormData = {
        ...formData,
        code: formData.code.toUpperCase().trim(),
        maximum_discount: formData.maximum_discount || 0,
        usage_limit: formData.usage_limit || 0,
      };

      if (editingCoupon) {
        await updateCoupon({ id: editingCoupon.id, data: payload }).unwrap();
        toast.success('Coupon updated successfully');
      } else {
        await createCoupon(payload).unwrap();
        toast.success('Coupon created successfully');
      }
      resetForm();
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to save coupon');
    }
  };

  const handleDelete = async () => {
    if (!deletingCoupon) return;
    try {
      await deleteCoupon(deletingCoupon.id).unwrap();
      toast.success('Coupon deleted successfully');
      setDeletingCoupon(null);
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to delete coupon');
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'percentage':
        return <Percent className="w-4 h-4" />;
      case 'fixed':
        return <DollarSign className="w-4 h-4" />;
      case 'free_shipping':
        return <Truck className="w-4 h-4" />;
      case 'buy_x_get_y':
        return <Gift className="w-4 h-4" />;
      default:
        return <Percent className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatValue = (c: Coupon) => {
    if (c.type === 'percentage') return `${c.value}%`;
    if (c.type === 'free_shipping') return 'Free';
    return `₹${c.value}`;
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
    });

  /* ------------------------------ Render ------------------------------ */

  return (
    <div className="flex-1 min-w-0 p-6">
      <Breadcrumb />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-primary">Coupons Management</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => refetchCoupons()}
              disabled={couponsFetching}
              className="p-2 border border-border rounded-lg hover:bg-muted disabled:opacity-50"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${couponsFetching ? 'animate-spin' : ''}`} />
            </button>
            <button
              type="button"
              onClick={() => {
                setEditingCoupon(null);
                setFormData(emptyForm);
                setShowForm(true);
              }}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 flex items-center gap-2 font-medium shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Add Coupon
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            { label: 'Total Coupons', value: stats.totalCoupons, color: 'text-primary' },
            { label: 'Active', value: stats.activeCoupons, color: 'text-green-600' },
            { label: 'Expired', value: stats.expiredCoupons, color: 'text-red-600' },
            { label: 'Total Usage', value: stats.totalUsage, color: 'text-blue-600' },
            {
              label: 'Total Discount',
              value: `₹${stats.totalDiscountGiven}`,
              color: 'text-secondary',
            },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-card text-card-foreground p-4 rounded-lg shadow-elevation-1 border border-border"
            >
              <h3 className="text-sm font-medium text-muted-foreground">{s.label}</h3>
              <p className={`text-2xl font-bold ${s.color}`}>
                {statsLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : s.value}
              </p>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-card text-card-foreground rounded-lg shadow-elevation-1 border border-border overflow-hidden">
          {couponsLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : couponsError ? (
            <div className="text-center py-12 text-error">
              Failed to load coupons. Please login again or try refresh.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-[1000px] w-full">
                <thead className="bg-muted">
                  <tr>
                    {[
                      'Code',
                      'Type',
                      'Value',
                      'Min Order',
                      'Usage',
                      'Status',
                      'Valid Until',
                      'Action',
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left text-sm font-medium text-muted-foreground"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {coupons.map((c) => {
                    const isExpired = new Date(c.end_date) < new Date();
                    const currentStatus = isExpired ? 'expired' : c.status;
                    return (
                      <tr key={c.id} className="hover:bg-muted/40">
                        <td className="px-4 py-3 font-mono text-sm font-medium">{c.code}</td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex items-center gap-2">
                            {getTypeIcon(c.type)}
                            <span className="capitalize">{c.type.replace('_', ' ')}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">{formatValue(c)}</td>
                        <td className="px-4 py-3 text-sm">
                          {c.minimum_amount ? `₹${c.minimum_amount}` : '—'}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {c.used_count}/{c.usage_limit ?? '∞'}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              currentStatus
                            )}`}
                          >
                            {currentStatus}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">{formatDate(c.end_date)}</td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleEdit(c)}
                              className="text-blue-600 hover:text-blue-800"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeletingCoupon(c)}
                              className="text-red-600 hover:text-red-800"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          {!couponsLoading && !couponsError && coupons.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No coupons yet. Click <strong>Add Coupon</strong> to create your first one.
            </div>
          )}
        </div>
      </div>

      {/* -------------------------- Form Modal -------------------------- */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card text-card-foreground rounded-lg w-full max-w-lg max-h-[90vh] flex flex-col">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h2 className="text-lg font-bold">
                {editingCoupon ? 'Edit Coupon' : 'Add New Coupon'}
              </h2>
              <button
                onClick={resetForm}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto p-4 flex-1">
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Code *</label>
                    <input
                      type="text"
                      value={formData.code}
                      onChange={(e) =>
                        setFormData({ ...formData, code: e.target.value.toUpperCase() })
                      }
                      className="w-full p-2 border border-border rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-secondary"
                      required
                      placeholder="SUMMER25"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full p-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                      required
                      placeholder="Summer Sale 25%"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full p-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Type *</label>
                    <select
                      value={formData.type}
                      onChange={(e) =>
                        setFormData({ ...formData, type: e.target.value as CouponType })
                      }
                      className="w-full p-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                    >
                      <option value="percentage">Percentage</option>
                      <option value="fixed">Fixed Amount</option>
                      <option value="free_shipping">Free Shipping</option>
                      <option value="buy_x_get_y">Buy X Get Y</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Value * {formData.type === 'percentage' ? '(%)' : '(₹)'}
                    </label>
                    <input
                      type="number"
                      value={formData.value}
                      onChange={(e) =>
                        setFormData({ ...formData, value: parseFloat(e.target.value) || 0 })
                      }
                      className="w-full p-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                      required
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Min Order (₹)</label>
                    <input
                      type="number"
                      value={formData.minimum_amount}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          minimum_amount: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full p-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Max Discount (₹)</label>
                    <input
                      type="number"
                      value={formData.maximum_discount}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          maximum_discount: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full p-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Usage Limit</label>
                    <input
                      type="number"
                      value={formData.usage_limit}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          usage_limit: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full p-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                      min="0"
                      placeholder="0 = unlimited"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">User Limit</label>
                    <input
                      type="number"
                      value={formData.user_limit}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          user_limit: parseInt(e.target.value) || 1,
                        })
                      }
                      className="w-full p-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                      min="1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Start Date *</label>
                    <input
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                      className="w-full p-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">End Date *</label>
                    <input
                      type="date"
                      value={formData.end_date}
                      onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                      className="w-full p-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                      required
                    />
                  </div>
                </div>

                {editingCoupon && (
                  <div>
                    <label className="block text-sm font-medium mb-1">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value as CouponStatus })
                      }
                      className="w-full p-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-3 border-t border-border">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-3 py-1.5 border border-border rounded-lg hover:bg-muted text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-1.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 text-sm disabled:opacity-50 flex items-center gap-2"
                  >
                    {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                    {editingCoupon ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------- Delete Modal -------------------------- */}
      {deletingCoupon && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card text-card-foreground rounded-lg w-full max-w-sm p-6">
            <h2 className="text-lg font-bold mb-2">Delete Coupon?</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Are you sure you want to delete{' '}
              <span className="font-mono font-semibold">{deletingCoupon.code}</span>? This action
              cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeletingCoupon(null)}
                className="px-3 py-1.5 border border-border rounded-lg hover:bg-muted text-sm"
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-1.5 bg-error text-error-foreground rounded-lg hover:bg-error/90 text-sm disabled:opacity-50 flex items-center gap-2"
              >
                {deleting && <Loader2 className="w-4 h-4 animate-spin" />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}