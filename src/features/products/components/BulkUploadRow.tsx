'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import Icon from '@/components/ui/AppIcon';
import { BulkProduct, BulkProductWithValidation } from '@/types/bulkUpload';
import { uploadImageToImageKit } from '@/lib/utils/imagekit';
import { HexColorPicker } from 'react-colorful';

interface BulkUploadRowProps {
  index: number;
  onAdd: (product: BulkProduct) => void;
  editingIndex?: number | null;
  products?: BulkProductWithValidation[];
  onUpdate?: (index: number, product: BulkProductWithValidation) => void;
  onCancel?: () => void;
}

// Size presets for different categories
const SIZE_PRESETS = {
  clothing: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL'],
  shoes: ['5','6', '7', '8', '9', '10'],
  sunglasses: ['One Size', 'Small', 'Medium', 'Large'],
  jewelry: ['One Size', 'S', 'M', 'L', 'Adjustable'],
  bags: ['One Size', 'Small', 'Medium', 'Large', 'XL'],
  home: ['One Size', 'Small', 'Medium', 'Large'],
  electronics: ['One Size', 'Small', 'Medium', 'Large'],
  baby: ['0-3M', '3-6M', '6-9M', '9-12M', '12-18M', '18-24M', '2T', '3T', '4T', '5T'],
  women: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  men: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'],
  kids: ['2T', '3T', '4T', '5T', '6', '7', '8', '10', '12', '14'],
};

type CategoryType = keyof typeof SIZE_PRESETS;

// Category labels without emojis
const CATEGORY_LABELS: Record<string, string> = {
  clothing: 'Clothing',
  shoes: 'Shoes',
  sunglasses: 'Sunglasses',
  jewelry: 'Jewelry',
  bags: 'Bags',
  home: 'Home & Furniture',
  electronics: 'Electronics',
  baby: 'Baby',
  women: 'Women',
  men: 'Men',
  kids: 'Kids',
};

export const BulkUploadRow = ({ 
  index, 
  onAdd, 
  editingIndex, 
  products = [], 
  onUpdate,
  onCancel 
}: BulkUploadRowProps) => {
  // ✅ Check if we're in edit mode
  const isEditing = editingIndex !== null && editingIndex !== undefined;
  const editProduct = isEditing ? products[editingIndex] : null;

  const [product, setProduct] = useState<Partial<BulkProduct>>({
    name: '',
    description: '',
    category: '',
    brand: '',
    price: 0,
    discount_price: 0,
    stock_quantity: 0,
    weight: 0,
    materials: '',
    warranty: '',
    colors: [],
    sizes: [],
    product_images: [],
    status: 'draft',
  });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [currentColor, setCurrentColor] = useState('#ff0000');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<CategoryType | ''>('');
  const [customSize, setCustomSize] = useState('');
  const [availableSizes, setAvailableSizes] = useState<string[]>([]);

  // Load edit data when in edit mode
  useEffect(() => {
    if (isEditing && editProduct) {
      setProduct({
        name: editProduct.name || '',
        description: editProduct.description || '',
        category: editProduct.category || '',
        brand: editProduct.brand || '',
        price: editProduct.price || 0,
        discount_price: editProduct.discount_price || 0,
        stock_quantity: editProduct.stock_quantity || 0,
        weight: editProduct.weight || 0,
        materials: editProduct.materials || '',
        warranty: editProduct.warranty || '',
        colors: editProduct.colors || [],
        sizes: editProduct.sizes || [],
        product_images: editProduct.product_images || [],
        status: editProduct.status || 'draft',
      });

      // Auto-detect preset from sizes
      if (editProduct.sizes && editProduct.sizes.length > 0) {
        const matchedPreset = Object.keys(SIZE_PRESETS).find(key => 
          JSON.stringify(SIZE_PRESETS[key as CategoryType]) === JSON.stringify(editProduct.sizes)
        );
        if (matchedPreset) {
          setSelectedPreset(matchedPreset as CategoryType);
        }
      }
    }
  }, [isEditing, editProduct]);

  // Update available sizes when preset changes
  useEffect(() => {
    if (selectedPreset) {
      setAvailableSizes(SIZE_PRESETS[selectedPreset]);
    } else {
      setAvailableSizes([]);
    }
  }, [selectedPreset]);

  const handleSubmit = () => {
    // Validate required fields
    if (!product.name || !product.price || !product.category) {
      toast.error('Name, Price, and Category are required');
      return;
    }

    // Prepare the product data with proper types
    const productData: BulkProduct = {
      name: product.name || '',
      price: Number(product.price) || 0,
      category: product.category || '',
      brand: product.brand || '',
      stock_quantity: Number(product.stock_quantity) || 0,
      description: product.description || '',
      discount_price: Number(product.discount_price) || 0,
      weight: Number(product.weight) || 0,
      materials: product.materials || '',
      warranty: product.warranty || '',
      colors: product.colors || [],
      sizes: product.sizes || [],
      product_images: product.product_images || [],
      status: product.status || 'draft',
    };

    // ✅ If editing, update the product
    if (isEditing && onUpdate && editingIndex !== null) {
      onUpdate(editingIndex, productData as BulkProductWithValidation);
    } else {
      // Otherwise add new product
      onAdd(productData as BulkProductWithValidation);
    }

    // Reset form (only if not in edit mode, or after update)
    if (!isEditing) {
      resetForm();
    }
  };

  const resetForm = () => {
    setProduct({
      name: '',
      description: '',
      category: '',
      brand: '',
      price: 0,
      discount_price: 0,
      stock_quantity: 0,
      weight: 0,
      materials: '',
      warranty: '',
      colors: [],
      sizes: [],
      product_images: [],
      status: 'draft',
    });
    setSelectedPreset('');
    setCustomSize('');
    setAvailableSizes([]);
  };

  const handleCancelEdit = () => {
    if (onCancel) {
      onCancel();
    }
    resetForm();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploadingImage(true);
    try {
      const uploadPromises = files.map((file) => uploadImageToImageKit(file, 'products/bulk'));
      const uploadedUrls = await Promise.all(uploadPromises);
      
      setProduct((prev) => ({
        ...prev,
        product_images: [...(prev.product_images || []), ...uploadedUrls],
      }));
      
      toast.success(`${uploadedUrls.length} image(s) uploaded!`);
    } catch (_error) {
      toast.error('Image upload failed!');
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = (indexToRemove: number) => {
    setProduct((prev) => ({
      ...prev,
      product_images: prev.product_images?.filter((_, i) => i !== indexToRemove) || [],
    }));
  };

  const addColor = () => {
    if (currentColor && !product.colors?.includes(currentColor)) {
      setProduct((prev) => ({
        ...prev,
        colors: [...(prev.colors || []), currentColor],
      }));
    }
  };

  const removeColor = (color: string) => {
    setProduct((prev) => ({
      ...prev,
      colors: prev.colors?.filter((c) => c !== color) || [],
    }));
  };

  const addSize = (size: string) => {
    const trimmedSize = size.trim();
    if (trimmedSize && !product.sizes?.includes(trimmedSize)) {
      setProduct((prev) => ({
        ...prev,
        sizes: [...(prev.sizes || []), trimmedSize],
      }));
      toast.success(`Added size: ${trimmedSize}`);
    } else if (trimmedSize && product.sizes?.includes(trimmedSize)) {
      toast.error('Size already exists');
    }
  };

  const removeSize = (size: string) => {
    setProduct((prev) => ({
      ...prev,
      sizes: prev.sizes?.filter((s) => s !== size) || [],
    }));
  };

  const handlePresetSelect = (preset: CategoryType) => {
    // Clear existing sizes first
    setProduct((prev) => ({
      ...prev,
      sizes: [],
    }));
    
    // Set new preset
    setSelectedPreset(preset);
    const sizes = SIZE_PRESETS[preset];
    setProduct((prev) => ({
      ...prev,
      sizes: sizes,
    }));
    toast.success(`Added ${sizes.length} size options for ${CATEGORY_LABELS[preset]}`);
  };

  const clearAllSizes = () => {
    setProduct((prev) => ({
      ...prev,
      sizes: [],
    }));
    setSelectedPreset('');
    setAvailableSizes([]);
    toast.success('Cleared all sizes');
  };

  const handleCategoryChange = (category: string) => {
    setProduct({ ...product, category });
    
    // Auto-detect category for size presets
    const lowerCategory = category.toLowerCase();
    let detectedPreset: CategoryType | '' = '';
    
    if (lowerCategory.includes('cloth') || lowerCategory.includes('apparel') || lowerCategory.includes('fashion')) {
      detectedPreset = 'clothing';
    } else if (lowerCategory.includes('shoe') || lowerCategory.includes('footwear')) {
      detectedPreset = 'shoes';
    } else if (lowerCategory.includes('sunglass') || lowerCategory.includes('eyewear') || lowerCategory.includes('glass')) {
      detectedPreset = 'sunglasses';
    } else if (lowerCategory.includes('jewelry') || lowerCategory.includes('jewellery')) {
      detectedPreset = 'jewelry';
    } else if (lowerCategory.includes('bag')) {
      detectedPreset = 'bags';
    } else if (lowerCategory.includes('home') || lowerCategory.includes('furniture')) {
      detectedPreset = 'home';
    } else if (lowerCategory.includes('electronic') || lowerCategory.includes('gadget')) {
      detectedPreset = 'electronics';
    } else if (lowerCategory.includes('baby') || lowerCategory.includes('infant')) {
      detectedPreset = 'baby';
    } else if (lowerCategory.includes('women')) {
      detectedPreset = 'women';
    } else if (lowerCategory.includes('men')) {
      detectedPreset = 'men';
    } else if (lowerCategory.includes('kid') || lowerCategory.includes('child')) {
      detectedPreset = 'kids';
    }
    
    if (detectedPreset) {
      handlePresetSelect(detectedPreset);
    }
  };

  return (
    <div className="bg-white border border-border rounded-lg p-4 shadow-elevation-1 bulk-upload-form">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-mocha-grey">
          {isEditing ? `Editing Row #${(editingIndex || 0) + 1}` : `Row #${index + 1}`}
        </span>
        <span className="text-xs text-mocha-grey/60">
          {isEditing ? 'Update product details' : 'Add product manually'}
        </span>
      </div>

      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
        <div>
          <label className="text-xs font-medium text-mocha-grey block mb-1">
            Name *
          </label>
          <input
            type="text"
            value={product.name}
            onChange={(e) => setProduct({ ...product, name: e.target.value })}
            placeholder="Product name"
            className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-mocha-grey block mb-1">
            Category *
          </label>
          <input
            type="text"
            value={product.category}
            onChange={(e) => handleCategoryChange(e.target.value)}
            placeholder="Clothing, Shoes, Sunglasses, etc."
            className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm"
          />
          <p className="text-xs text-mocha-grey/60 mt-1">Type category to auto-suggest sizes</p>
        </div>

        <div>
          <label className="text-xs font-medium text-mocha-grey block mb-1">
            Brand
          </label>
          <input
            type="text"
            value={product.brand}
            onChange={(e) => setProduct({ ...product, brand: e.target.value })}
            placeholder="Brand name"
            className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm"
          />
        </div>
      </div>

      {/* Description */}
      <div className="mb-3">
        <label className="text-xs font-medium text-mocha-grey block mb-1">
          Description
        </label>
        <textarea
          value={product.description}
          onChange={(e) => setProduct({ ...product, description: e.target.value })}
          placeholder="Product description"
          rows={2}
          className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm resize-none"
        />
      </div>

      {/* Pricing and Stock */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
        <div>
          <label className="text-xs font-medium text-mocha-grey block mb-1">
            Price * (₹)
          </label>
          <input
            type="number"
            value={product.price || ''}
            onChange={(e) => setProduct({ ...product, price: parseFloat(e.target.value) || 0 })}
            placeholder="99.99"
            className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-mocha-grey block mb-1">
            Discount Price (₹)
          </label>
          <input
            type="number"
            value={product.discount_price || ''}
            onChange={(e) => setProduct({ ...product, discount_price: parseFloat(e.target.value) || 0 })}
            placeholder="79.99"
            className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-mocha-grey block mb-1">
            Stock
          </label>
          <input
            type="number"
            value={product.stock_quantity || ''}
            onChange={(e) => setProduct({ ...product, stock_quantity: parseInt(e.target.value) || 0 })}
            placeholder="10"
            className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-mocha-grey block mb-1">
            Weight (kg)
          </label>
          <input
            type="number"
            value={product.weight || ''}
            onChange={(e) => setProduct({ ...product, weight: parseFloat(e.target.value) || 0 })}
            placeholder="1.5"
            step="0.1"
            className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm"
          />
        </div>
      </div>

      {/* Materials and Warranty */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
        <div>
          <label className="text-xs font-medium text-mocha-grey block mb-1">
            Materials
          </label>
          <input
            type="text"
            value={product.materials}
            onChange={(e) => setProduct({ ...product, materials: e.target.value })}
            placeholder="Cotton, Wood, Metal"
            className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-mocha-grey block mb-1">
            Warranty
          </label>
          <input
            type="text"
            value={product.warranty}
            onChange={(e) => setProduct({ ...product, warranty: e.target.value })}
            placeholder="1 Year, 2 Years, Lifetime"
            className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm"
          />
        </div>
      </div>

      {/* Colors */}
      <div className="mb-3">
        <label className="text-xs font-medium text-mocha-grey block mb-1">
          Colors
        </label>
        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="w-10 h-10 rounded-lg border-2 border-border flex items-center justify-center hover:border-primary transition-colors"
              style={{ backgroundColor: currentColor }}
            >
              <Icon name="PaintBrushIcon" size={16} className="text-white drop-shadow" />
            </button>
            {showColorPicker && (
              <div className="absolute top-12 left-0 z-10 bg-white rounded-lg shadow-lg p-2 border border-border">
                <HexColorPicker
                  color={currentColor}
                  onChange={setCurrentColor}
                  className="w-48 h-32"
                />
                <button
                  type="button"
                  onClick={() => setShowColorPicker(false)}
                  className="mt-2 w-full px-3 py-1 text-xs bg-primary text-white rounded hover:bg-primary/90"
                >
                  Close
                </button>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={addColor}
            className="px-3 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 text-sm font-medium"
          >
            Add Color
          </button>
        </div>
        {product.colors && product.colors.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {product.colors.map((color) => (
              <div
                key={color}
                onClick={() => removeColor(color)}
                className="w-8 h-8 rounded-full border-2 border-white shadow-sm cursor-pointer hover:scale-110 transition-transform"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        )}
      </div>

      {/* Sizes with Presets */}
      <div className="mb-3">
        <label className="text-xs font-medium text-mocha-grey block mb-1">
          Sizes
        </label>
        
        {/* Size Preset Selector */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
          <div>
            <label className="text-xs text-mocha-grey block mb-1">Quick Add Size Presets</label>
            <select
              value={selectedPreset}
              onChange={(e) => {
                if (e.target.value) {
                  handlePresetSelect(e.target.value as CategoryType);
                } else {
                  setSelectedPreset('');
                  setAvailableSizes([]);
                  setProduct((prev) => ({ ...prev, sizes: [] }));
                }
              }}
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm"
            >
              <option value="">Select product type...</option>
              {Object.keys(SIZE_PRESETS).map((key) => (
                <option key={key} value={key}>
                  {CATEGORY_LABELS[key]}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <label className="text-xs text-mocha-grey block mb-1">Add Custom Size</label>
              <input
                type="text"
                value={customSize}
                onChange={(e) => setCustomSize(e.target.value)}
                placeholder="e.g., XXL, 42, One Size"
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && customSize.trim()) {
                    addSize(customSize);
                    setCustomSize('');
                  }
                }}
              />
            </div>
            <button
              type="button"
              onClick={() => {
                if (customSize.trim()) {
                  addSize(customSize);
                  setCustomSize('');
                }
              }}
              className="px-3 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 text-sm font-medium whitespace-nowrap"
            >
              <Icon name="PlusIcon" size={16} />
            </button>
          </div>
        </div>

        {/* Show available sizes for selected preset */}
        {selectedPreset && availableSizes.length > 0 && (
          <div className="mt-2 p-2 bg-soft-linen/50 rounded-lg border border-border">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs font-medium text-mocha-grey">Available sizes for {CATEGORY_LABELS[selectedPreset]}:</p>
              <button
                type="button"
                onClick={() => {
                  const sizes = SIZE_PRESETS[selectedPreset];
                  setProduct((prev) => ({
                    ...prev,
                    sizes: sizes,
                  }));
                  toast.success(`Added all ${sizes.length} sizes`);
                }}
                className="text-xs text-primary hover:text-primary/80 font-medium"
              >
                Select All
              </button>
            </div>
            <div className="flex flex-wrap gap-1">
              {availableSizes.map((size) => (
                <span
                  key={size}
                  onClick={() => {
                    if (product.sizes?.includes(size)) {
                      removeSize(size);
                    } else {
                      addSize(size);
                    }
                  }}
                  className={`px-2 py-0.5 text-xs rounded cursor-pointer transition-colors ${
                    product.sizes?.includes(size)
                      ? 'bg-primary text-white border border-primary'
                      : 'bg-white text-mocha-grey border border-border hover:border-primary hover:bg-primary/5'
                  }`}
                >
                  {size}
                  {product.sizes?.includes(size) && ' ✓'}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Display current sizes */}
        {product.sizes && product.sizes.length > 0 ? (
          <div className="flex flex-wrap gap-2 mt-2">
            {product.sizes.map((size) => (
              <span
                key={size}
                onClick={() => removeSize(size)}
                className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-lg text-xs cursor-pointer hover:bg-error/10 hover:border-error/50 transition-colors flex items-center gap-1"
              >
                {size}
                <Icon name="XMarkIcon" size={12} className="opacity-50" />
              </span>
            ))}
            <button
              type="button"
              onClick={clearAllSizes}
              className="px-3 py-1 text-xs text-error hover:bg-error/10 rounded-lg transition-colors"
            >
              Clear All
            </button>
          </div>
        ) : (
          <p className="text-xs text-mocha-grey/50 mt-2">No sizes added yet. Select a preset or add custom sizes.</p>
        )}
      </div>

      {/* Photo Upload Section */}
      <div className="mb-3">
        <label className="text-xs font-medium text-mocha-grey block mb-1">
          Product Images
        </label>
        <div className="flex items-center gap-3">
          <label className={`px-4 py-2 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors ${uploadingImage ? 'opacity-50 cursor-not-allowed' : ''}`}>
            <div className="flex items-center gap-2 text-sm text-mocha-grey">
              {uploadingImage ? (
                <>
                  <Icon name="ArrowPathIcon" size={16} className="animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Icon name="PhotoIcon" size={16} />
                  Upload Images
                </>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="hidden"
              disabled={uploadingImage}
            />
          </label>
          {product.product_images && product.product_images.length > 0 && (
            <span className="text-xs text-mocha-grey">
              {product.product_images.length} image(s) uploaded
            </span>
          )}
        </div>

        {/* Image Previews */}
        {product.product_images && product.product_images.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {product.product_images.map((img, idx) => (
              <div key={idx} className="relative group">
                <img
                  src={img}
                  alt={`Product ${idx + 1}`}
                  className="w-16 h-16 object-cover rounded-lg border border-border"
                />
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute -top-1.5 -right-1.5 bg-error text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-error/80"
                >
                  <Icon name="XMarkIcon" size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Status */}
      <div className="mb-3">
        <label className="text-xs font-medium text-mocha-grey block mb-1">
          Status
        </label>
        <select
          value={product.status}
          onChange={(e) => setProduct({ ...product, status: e.target.value as 'active' | 'inactive' | 'draft' })}
          className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm"
        >
          <option value="draft">Draft</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div className="flex justify-end gap-2">
        {/* ✅ Show Cancel button when editing */}
        {isEditing && (
          <button
            onClick={handleCancelEdit}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium text-sm flex items-center gap-2"
          >
            <Icon name="XMarkIcon" size={16} />
            Cancel
          </button>
        )}
        <button
          onClick={handleSubmit}
          className={`px-4 py-2 font-medium text-sm flex items-center gap-2 rounded-lg transition-colors ${
            isEditing
              ? 'bg-primary text-white hover:bg-primary/90'
              : 'bg-secondary text-secondary-foreground hover:bg-secondary/90'
          }`}
        >
          <Icon name={isEditing ? 'CheckIcon' : 'PlusIcon'} size={16} />
          {isEditing ? 'Update Product' : 'Add Product'}
        </button>
      </div>
    </div>
  );
};