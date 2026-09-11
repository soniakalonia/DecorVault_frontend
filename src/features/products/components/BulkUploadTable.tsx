'use client';

import { BulkProductWithValidation } from '@/types/bulkUpload';
import Icon from '@/components/ui/AppIcon';

interface BulkUploadTableProps {
  products: BulkProductWithValidation[];
  onRemove: (index: number) => void;
  onEdit: (index: number) => void;
}

export const BulkUploadTable = ({ products, onRemove, onEdit }: BulkUploadTableProps) => {
  if (products.length === 0) {
    return (
      <div className="text-center py-8 bg-soft-linen/30 rounded-lg border border-border">
        <Icon name="InboxIcon" size={32} className="text-mocha-grey/40 mx-auto mb-2" />
        <p className="text-mocha-grey text-sm">No products added yet</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-soft-linen/50">
            <th className="px-3 py-2 text-left text-xs font-semibold text-mocha-grey">#</th>
            <th className="px-3 py-2 text-left text-xs font-semibold text-mocha-grey">Images</th>
            <th className="px-3 py-2 text-left text-xs font-semibold text-mocha-grey">Name</th>
            <th className="px-3 py-2 text-left text-xs font-semibold text-mocha-grey">Category</th>
            <th className="px-3 py-2 text-left text-xs font-semibold text-mocha-grey">Brand</th>
            <th className="px-3 py-2 text-left text-xs font-semibold text-mocha-grey">Price</th>
            <th className="px-3 py-2 text-left text-xs font-semibold text-mocha-grey">Discount</th>
            <th className="px-3 py-2 text-left text-xs font-semibold text-mocha-grey">Stock</th>
            <th className="px-3 py-2 text-left text-xs font-semibold text-mocha-grey">Weight</th>
            <th className="px-3 py-2 text-left text-xs font-semibold text-mocha-grey">Materials</th>
            <th className="px-3 py-2 text-left text-xs font-semibold text-mocha-grey">Warranty</th>
            <th className="px-3 py-2 text-left text-xs font-semibold text-mocha-grey">Colors</th>
            <th className="px-3 py-2 text-left text-xs font-semibold text-mocha-grey">Sizes</th>
            <th className="px-3 py-2 text-left text-xs font-semibold text-mocha-grey">Status</th>
            <th className="px-3 py-2 text-center text-xs font-semibold text-mocha-grey">Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => {
            const isValid = product._validation?.isValid ?? true;
            const errors = product._validation?.errors ?? [];

            return (
              <tr key={index} className="border-b border-border hover:bg-soft-linen/30 transition-colors">
                <td className="px-3 py-2 text-mocha-grey text-xs">{index + 1}</td>
                <td className="px-3 py-2">
                  {product.product_images && product.product_images.length > 0 ? (
                    <div className="flex items-center gap-1">
                      <div className="flex -space-x-1">
                        {product.product_images.slice(0, 3).map((img, idx) => (
                          <img
                            key={idx}
                            src={img}
                            alt=""
                            className="w-7 h-7 rounded border border-border object-cover"
                          />
                        ))}
                      </div>
                      {product.product_images.length > 3 && (
                        <span className="text-xs text-mocha-grey ml-1">
                          +{product.product_images.length - 3}
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-xs text-mocha-grey/50">No image</span>
                  )}
                </td>
                <td className="px-3 py-2 font-medium text-espresso text-sm max-w-xs truncate">
                  {product.name || '-'}
                  {!isValid && (
                    <span className="ml-2 text-error" title={errors.join(', ')}>
                      <Icon name="ExclamationCircleIcon" size={14} />
                    </span>
                  )}
                </td>
                <td className="px-3 py-2 text-mocha-grey">{product.category || '-'}</td>
                <td className="px-3 py-2 text-mocha-grey">{product.brand || '-'}</td>
                <td className="px-3 py-2 text-espresso">₹{product.price || 0}</td>
                <td className="px-3 py-2 text-success">₹{product.discount_price || 0}</td>
                <td className="px-3 py-2 text-mocha-grey">{product.stock_quantity || 0}</td>
                <td className="px-3 py-2 text-mocha-grey">{product.weight || 0}kg</td>
                <td className="px-3 py-2 text-mocha-grey max-w-xs truncate">{product.materials || '-'}</td>
                <td className="px-3 py-2 text-mocha-grey">{product.warranty || '-'}</td>
                <td className="px-3 py-2">
                  {product.colors && product.colors.length > 0 ? (
                    <div className="flex gap-1">
                      {product.colors.slice(0, 3).map((color, idx) => (
                        <div
                          key={idx}
                          className="w-4 h-4 rounded-full border"
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                      {product.colors.length > 3 && (
                        <span className="text-xs text-mocha-grey">+{product.colors.length - 3}</span>
                      )}
                    </div>
                  ) : (
                    <span className="text-xs text-mocha-grey/50">-</span>
                  )}
                </td>
                <td className="px-3 py-2 text-mocha-grey">
                  {product.sizes && product.sizes.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {product.sizes.slice(0, 3).map((size, idx) => (
                        <span key={idx} className="text-xs px-1 py-0.5 bg-soft-linen rounded">
                          {size}
                        </span>
                      ))}
                      {product.sizes.length > 3 && (
                        <span className="text-xs text-mocha-grey">+{product.sizes.length - 3}</span>
                      )}
                    </div>
                  ) : (
                    <span className="text-xs text-mocha-grey/50">-</span>
                  )}
                </td>
                <td className="px-3 py-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${product.status === 'active' ? 'bg-success/20 text-success' :
                    product.status === 'inactive' ? 'bg-error/20 text-error' :
                      'bg-muted text-mocha-grey'
                    }`}>
                    {product.status || 'draft'}
                  </span>
                </td>
                <td className="px-3 py-2 text-center">
                  <div className="flex items-center justify-center gap-1">
                    {/* Edit Button */}
                    <button
                      onClick={() => {
                        onEdit(index);
                      }}

                      className="text-primary hover:text-primary/80 transition-colors p-1 hover:bg-primary/10 rounded"
                      title="Edit Product"
                    >
                      <Icon name="PencilSquareIcon" size={16} />
                    </button>
                    {/* Delete Button */}
                    <button
                      onClick={() => onRemove(index)}
                      className="text-error hover:text-error/80 transition-colors p-1 hover:bg-error/10 rounded"
                      title="Delete Product"
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
  );
};