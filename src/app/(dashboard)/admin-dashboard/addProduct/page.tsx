"use client";

import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useAddAdminProductMutation, useUpdateAdminProductMutation, useGetAdminProductsQuery, useGetCategoriesQuery, useGetBrandsQuery } from '@/store/api/productsApi';
import { useSearchParams, useRouter } from 'next/navigation';
import { HexColorPicker } from "react-colorful";
import Breadcrumb from '@/components/common/Breadcrumb';
import {
  Archive,
  FileText,
  Box,
  Sliders,
  Tag,
  Info,
  Weight,
  Shield,
  DollarSign,
  Trash2,
  Plus,
  type LucideIcon,
} from "lucide-react";

// Slug generator
const generateSlug = (name: string) =>
  name
    .toLowerCase()
    .replaceAll(" ", "-")
    .replaceAll(/[^\w-]+/g, "");

// Interfaces
interface ProductData {
  name: string;
  slug: string;
  description: string;
  longDescription: string;
  materials: string;
  careInstructions: string;
  additionalInfo: string;
  weight: number;
  warranty: string;
  adminEmail: string;
  price: number;
  discountPrice: number;
  stockQuantity: number;
  category: string;
  brand: string;
  packingStandard: string;
  type: "own" | "affiliate";
}

interface Specification {
  key: string;
  value: string;
}
import { uploadImageToImageKit } from '@/lib/utils/imagekit';

const AddProduct = () => {
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [slugCounter, setSlugCounter] = useState(1);
  const [addAdminProduct] = useAddAdminProductMutation();
  const [updateAdminProduct] = useUpdateAdminProductMutation();
  const { data: adminProductsData } = useGetAdminProductsQuery();
  const { data: categoriesData } = useGetCategoriesQuery();
  const { data: brandsData } = useGetBrandsQuery();
  const searchParams = useSearchParams();
  const router = useRouter();
  const editId = searchParams.get('edit');

  const [productData, setProductData] = useState<ProductData>({
    name: "",
    slug: "",
    description: "",
    longDescription: "",
    materials: "",
    careInstructions: "",
    additionalInfo: "",
    weight: 0,
    warranty: "",
    adminEmail: "",
    price: 0,
    discountPrice: 0,
    stockQuantity: 0,
    category: "",
    brand: "",
    packingStandard: "",
    type: "own",
  });

  const [specifications, setSpecifications] = useState<Specification[]>([{ key: "", value: "" }]);
  const [productImages, setProductImages] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [features, setFeatures] = useState<string[]>([]);
  const [variantImageSets, setVariantImageSets] = useState<Array<{
    id: string;
    color: string;
    size: string;
    images: string[];
  }>>([]);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [customBrand, setCustomBrand] = useState("");
  const [currentColor, setCurrentColor] = useState("#ff0000");
  const { user } = useAuth();

  // Set mounted state
  useEffect(() => {
    setMounted(true);
  }, []);

  // Load product data if in edit mode
  useEffect(() => {
    if (editId && adminProductsData?.data) {
      const product = adminProductsData.data.find((p: any) => p.id === editId || p.id.toString() === editId);

      if (product) {

        setProductData({
          name: product.name || "",
          slug: product.slug || "",
          description: product.description || "",
          longDescription: product.long_description || "",
          materials: product.materials || "",
          careInstructions: product.care_instructions || "",
          additionalInfo: product.additional_info || "",
          weight: Number(product.weight) || 0,
          warranty: product.warranty || "",
          adminEmail: product.admin_email || "",
          price: Number(product.price) || 0,
          discountPrice: Number(product.discount_price) || 0,
          stockQuantity: Number(product.stock_quantity) || 0,
          category: product.category || "",
          brand: product.brand || "",
          packingStandard: product.packing_standard || "",
          type: product.type || "own",
        });

        try {
          const parsedSpecs = typeof product.specifications === 'string'
            ? JSON.parse(product.specifications)
            : product.specifications || [];
          setSpecifications(Array.isArray(parsedSpecs) ? parsedSpecs : []);

          const parseJsonField = (field: any, fallback: any[] = []) => {
            if (!field) return fallback;
            if (Array.isArray(field)) return field;
            if (typeof field === 'string') {
              if (field.startsWith('[') || field.startsWith('{')) {
                try {
                  return JSON.parse(field);
                } catch {
                  return fallback;
                }
              }
              return [field];
            }
            return fallback;
          };

          const images = parseJsonField(product.product_images, []);
          const productColors = parseJsonField(product.colors, []);
          const productSizes = parseJsonField(product.sizes, []);
          const productFeatures = parseJsonField(product.features, []);
          const productVariants = parseJsonField(product.variants, []);

          setProductImages(images);
          setColors(productColors);
          setSizes(productSizes);
          setFeatures(productFeatures);

          const formattedVariants = productVariants
            .filter((v: any) => v.images && Array.isArray(v.images) && v.images.length > 0)
            .filter((v: any, index: number, self: any[]) =>
              index === self.findIndex((t: any) =>
                (t.variantId === v.variantId || t.id === v.id) &&
                (t.color?.code || t.color) === (v.color?.code || v.color) &&
                t.size === v.size
              )
            )
            .map((v: any) => ({
              id: v.variantId || v.id || Date.now().toString(),
              color: v.color?.code || v.color || '',
              size: v.size || '',
              images: Array.isArray(v.images) ? v.images : []
            }));
          setVariantImageSets(formattedVariants);
        } catch (e) {
          console.warn('Error parsing product data:', e);
          setSpecifications([]);
          setProductImages([]);
          setColors([]);
          setSizes([]);
          setFeatures([]);
          setVariantImageSets([]);
        }

        setIsFeatured(!!product.is_featured);
        setIsNewArrival(!!product.is_new_arrival);

        // Handle categories
        const fetchedCategories = categoriesData?.categories?.map((c: any) => c.name) || [];

        if (fetchedCategories.includes(product.category)) {
          setSelectedCategory(product.category);
        } else {
          setSelectedCategory("Others");
          setCustomCategory(product.category);
        }

        const fetchedBrands = brandsData?.brands?.map((b: any) => b.name) || [];
        if (fetchedBrands.includes(product.brand)) {
          setSelectedBrand(product.brand);
        } else {
          setSelectedBrand("Others");
          setCustomBrand(product.brand);
        }
      }
    }
  }, [editId, adminProductsData]);

  const addColor = () => {
    if (currentColor && !colors.includes(currentColor)) {
      setColors([...colors, currentColor]);
    }
  };

  const removeColor = (color: string) => {
    setColors(colors.filter((c) => c !== color));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    if (name === 'name') {
      const baseSlug = generateSlug(value);
      setProductData((prev) => ({
        ...prev,
        name: value,
        slug: slugCounter > 1 ? `${baseSlug}-${slugCounter}` : baseSlug,
      }));
    } else {
      setProductData((prev) => ({
        ...prev,
        [name]: type === "number" ? Number(value) : value,
      }));
    }
  };

  const addVariantImageSet = () => {
    setVariantImageSets(prev => [...prev, {
      id: Date.now().toString(),
      color: '',
      size: '',
      images: []
    }]);
  };

  const updateVariantImageSet = (id: string, field: string, value: any) => {
    setVariantImageSets(prev => prev.map(set =>
      set.id === id ? { ...set, [field]: value } : set
    ));
  };

  const removeVariantImageSet = (id: string) => {
    setVariantImageSets(prev => prev.filter(set => set.id !== id));
  };

  const handleVariantImageSetUpload = async (e: React.ChangeEvent<HTMLInputElement>, setId: string) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setLoading(true);
    try {
      const uploadPromises = files.map((file) => uploadImageToImageKit(file, 'products/variants'));
      const uploadedUrls = await Promise.all(uploadPromises);

      updateVariantImageSet(setId, 'images',
        [...(variantImageSets.find(set => set.id === setId)?.images || []), ...uploadedUrls]
      );

      toast.success('✅ Variant images uploaded!');
    } catch (_error) {
      toast.error('❌ Variant image upload failed!');
    } finally {
      setLoading(false);
    }
  };

  const removeVariantImage = (setId: string, imageIndex: number) => {
    const set = variantImageSets.find(s => s.id === setId);
    if (set) {
      const newImages = set.images.filter((_, idx) => idx !== imageIndex);
      updateVariantImageSet(setId, 'images', newImages);
    }
  };

  const resetForm = () => {
    setProductData({
      name: "",
      slug: "",
      description: "",
      longDescription: "",
      materials: "",
      careInstructions: "",
      additionalInfo: "",
      weight: 0,
      warranty: "",
      adminEmail: "",
      price: 0,
      discountPrice: 0,
      stockQuantity: 0,
      category: "",
      brand: "",
      packingStandard: "",
      type: "own",
    });
    setSpecifications([{ key: "", value: "" }]);
    setProductImages([]);
    setColors([]);
    setSizes([]);
    setFeatures([]);
    setVariantImageSets([]);
    setIsFeatured(false);
    setIsNewArrival(false);
    setSlugCounter(1);
    setSelectedCategory("");
    setCustomCategory("");
    setSelectedBrand("");
    setCustomBrand("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const finalCategory =
      selectedCategory === "Others" ? customCategory.trim() : selectedCategory;

    const finalBrand =
      selectedBrand === "Others" ? customBrand.trim() : selectedBrand;

    if (!finalCategory) {
      toast.error("❌ Please select or enter a category.");
      return;
    }

    if (!finalBrand) {
      toast.error("❌ Please select or enter a brand.");
      return;
    }

    const adminEmail = user?.email || "";
    const adminName = user?.fullName || "Admin User";
    const adminNumber = user?.mobile || "1234567890";

    const finalData = {
      ...productData,
      category: finalCategory,
      brand: finalBrand,
      type: "own",
      productImages,
      specifications,
      colors,
      sizes,
      features,
      isFeatured,
      isNewArrival,
      variants: variantImageSets,
      adminEmail,
      adminName,
      adminNumber,
      tags: [],
      deliveryCharges: [],
      defaultDeliveryCharge: 0,
      videoUrl: "",
      affiliateLink: ""
    };

    setLoading(true);

    try {
      if (editId) {
        await updateAdminProduct({ id: editId, data: finalData }).unwrap();
        toast.success("✅ Product updated successfully!");
        setTimeout(() => {
          router.push('/admin-dashboard/products');
        }, 2000);
      } else {
        await addAdminProduct(finalData).unwrap();
        toast.success("✅ Product added successfully!");
        resetForm();
        setTimeout(() => {
          router.push('/admin-dashboard/products');
        }, 2000);
      }
    } catch (err: any) {
      if (err.status === 400 && err.data?.message?.includes('slug')) {
        setSlugCounter(prev => prev + 1);
        toast.error("Slug exists, trying with different number...");
        return;
      }

      if (err.status === 400) {
        toast.error(
          `❌ ${err.data?.message || "Validation error."}`
        );
      } else {
        toast.error(`❌ Failed to ${editId ? 'update' : 'add'} product.`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setLoading(true);
    try {
      const uploadPromises = files.map((file) => uploadImageToImageKit(file, 'products'));
      const uploadedUrls = await Promise.all(uploadPromises);
      setProductImages((prev) => [...prev, ...uploadedUrls]);
      toast.success("✅ Images uploaded!");
    } catch (_error) {
      toast.error("❌ Image upload failed!");
    } finally {
      setLoading(false);
    }
  };

  const renderInputField = (
    label: string,
    name: keyof ProductData,
    type = "text",
    Icon?: LucideIcon,
    iconColor = "#6B3F26",
    required = false
  ) => {
    const isMultiline = name === "description" || name === "longDescription";

    return (
      <div className="flex flex-col gap-1">
        <label className="font-semibold text-gray-800 mb-1 flex items-center gap-1">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>

        <div className="relative">
          {Icon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <Icon className="w-5 h-5" color={iconColor} />
            </div>
          )}

          {isMultiline ? (
            <textarea
              name={name}
              required={required}
              value={productData[name] as string}
              onChange={handleInputChange}
              rows={5}
              className={`w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 ${Icon ? "pl-11" : ""
                }`}
            />
          ) : (
            <input
              type={type}
              name={name}
              required={required}
              value={productData[name] === 0 ? "" : productData[name]}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 ${Icon ? "pl-11" : ""
                }`}
            />
          )}
        </div>
      </div>
    );
  };

  const renderArrayField = (
    label: string,
    state: string[],
    setter: any,
    required = false
  ) => (
    <div className="flex flex-col gap-4">
      <label className="font-bold text-gray-800 flex items-center gap-2">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>

      {label === "Product Images" ? (
        <div className="space-y-4">
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Plus className="w-8 h-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500 font-medium">Click or drag to upload {label.toLowerCase()}</p>
              </div>
              <input
                name="product-images"
                type="file"
                multiple
                onChange={handleImageUpload}
                className="hidden"
                required={required && state.length === 0 && !editId}
              />
            </label>
          </div>
          <div className="flex flex-wrap gap-4">
            {state.map((img, idx) => (
              <div key={`img-${idx}`} className="relative group">
                <img
                  src={img}
                  alt="Uploaded"
                  className="w-24 h-24 object-cover rounded-xl border shadow-sm transition-transform group-hover:scale-105"
                />
                <button
                  type="button"
                  onClick={() => setter(state.filter((_, i) => i !== idx))}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 scale-75 group-hover:scale-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-5 bg-gray-50/50 rounded-2xl border border-gray-200 shadow-inner-sm">
          <div className="flex flex-col gap-3">
            {state.map((val, idx) => (
              <div key={`item-${idx}`} className="flex gap-3 items-center group">
                <div className="flex-1 relative">
                  <input
                    name={`${label.toLowerCase()}-${idx}`}
                    value={val}
                    placeholder={`Enter ${label.slice(0, -1)}...`}
                    onChange={(e) => {
                      const newState = [...state];
                      newState[idx] = e.target.value;
                      setter(newState);
                    }}
                    className="w-full pl-4 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent focus:outline-none transition-all shadow-sm"
                    required={required && val.trim() !== ""}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setter(state.filter((_, i) => i !== idx))}
                  className="p-3 bg-white text-gray-400 hover:text-red-500 border border-gray-200 rounded-xl hover:border-red-100 hover:bg-red-50 transition-all shadow-sm"
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setter([...state, ""])}
              className="mt-2 flex items-center justify-center gap-2 w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-mocha-grey hover:text-primary hover:border-primary hover:bg-primary/5 transition-all text-sm font-bold"
            >
              <Plus className="w-4 h-4" />
              Add {label.slice(0, -1)}
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderKeyValueField = (
    label: string,
    state: Specification[],
    setter: any,
    required = false
  ) => (
    <div className="flex flex-col gap-4">
      <label className="font-bold text-gray-800 flex items-center gap-2">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <div className="grid grid-cols-1 gap-4">
        {state.map((item, idx) => (
          <div key={`spec-${idx}`} className="flex gap-4 items-end bg-gray-50/50 p-4 rounded-xl border border-gray-200">
            <div className="flex-1">
              <label htmlFor={`spec-key-${idx}`} className="text-xs font-bold text-mocha-grey mb-1 block uppercase">Feature / Key</label>
              <input
                id={`spec-key-${idx}`}
                name={`spec-key-${idx}`}
                placeholder="e.g. Dimensions"
                value={item.key}
                onChange={(e) => {
                  const newState = [...state];
                  newState[idx] = { ...item, key: e.target.value };
                  setter(newState);
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>
            <div className="flex-1">
              <label htmlFor={`spec-value-${idx}`} className="text-xs font-bold text-mocha-grey mb-1 block uppercase">Description / Value</label>
              <input
                id={`spec-value-${idx}`}
                name={`spec-value-${idx}`}
                placeholder="e.g. 10x10x5 cm"
                value={item.value}
                onChange={(e) => {
                  const newState = [...state];
                  newState[idx] = { ...item, value: e.target.value };
                  setter(newState);
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>
            <button
              type="button"
              onClick={() => setter(state.filter((_, i) => i !== idx))}
              className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
              title="Remove"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => setter([...state, { key: "", value: "" }])}
        className="self-start px-6 py-2 bg-primary/10 text-primary rounded-xl text-sm font-bold hover:bg-primary/20 transition-all"
      >
        + Add Specification
      </button>
    </div>
  );

  const renderVariantImageUploader = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-800">Variant Images</h3>
        <button
          type="button"
          onClick={addVariantImageSet}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Variant Images
        </button>
      </div>

      {variantImageSets.map((set) => (
        <div key={set.id} className="border border-gray-200 rounded-xl p-6 bg-gray-50/50">
          <div className="flex items-center justify-between mb-6">
            <h4 className="font-semibold text-gray-700">Variant Image Set</h4>
            <button
              type="button"
              onClick={() => removeVariantImageSet(set.id)}
              className="text-red-500 hover:text-red-700 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Color Selection */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">Color</label>
              <div className="flex flex-wrap gap-2 p-2 border border-gray-300 rounded-lg bg-white min-h-[50px]">
                {colors.length === 0 ? (
                  <p className="text-xs text-gray-400 italic py-2">Add colors in the section above first</p>
                ) : (
                  colors.map((color, colorIdx) => (
                    <button
                      key={`${set.id}-color-${colorIdx}`}
                      type="button"
                      onClick={() => updateVariantImageSet(set.id, 'color', color)}
                      className={`w-6 h-6 rounded-full border-2 transition-all ${set.color === color ? 'border-primary ring-2 ring-primary/20 scale-110' : 'border-gray-200 hover:scale-105'
                        }`}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))
                )}
              </div>
              {set.color && (
                <div className="flex items-center gap-2 px-1">
                  <div className="w-3 h-3 rounded-full border border-gray-300" style={{ backgroundColor: set.color }} />
                  <span className="text-xs font-medium text-gray-500 uppercase">{String(set.color)}</span>
                </div>
              )}
            </div>

            {/* Size Input */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">Size</label>
              <select
                value={set.size}
                onChange={(e) => updateVariantImageSet(set.id, 'size', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none bg-white"
              >
                <option value="">Select Size</option>
                {sizes.filter(s => s.trim() !== "").map((size, sizeIdx) => (
                  <option key={`${set.id}-size-${sizeIdx}`} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>

            {/* Image Upload */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700">Upload Images</label>
              <label className="flex items-center justify-center w-full h-12 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors">
                <div className="flex items-center gap-2">
                  <Plus className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-500">Upload</span>
                </div>
                <input
                  type="file"
                  multiple
                  onChange={(e) => handleVariantImageSetUpload(e, set.id)}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Display Uploaded Images */}
          {set.images.length > 0 && (
            <div className="space-y-2 mt-6">
              <label className="text-sm font-medium text-gray-700">Uploaded Images ({set.images.length}):</label>
              <div className="flex flex-wrap gap-3">
                {set.images.map((img, imgIdx) => (
                  <div key={`${set.id}-img-${imgIdx}`} className="relative group">
                    <img
                      src={img}
                      alt={`${set.color} ${set.size}`}
                      className="w-20 h-20 object-cover rounded-lg border shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() => removeVariantImage(set.id, imgIdx)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}

      {variantImageSets.length === 0 && (
        <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-300">
          <div className="space-y-2">
            <p className="font-medium">No variant images added yet</p>
            <p className="text-sm">Click "Add Variant Images" to create color-size combinations</p>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      {!mounted ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p>Loading...</p>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-6 lg:p-10 scroll-smooth">
          <Breadcrumb />
          <div className="mt-8">
            <div className="p-8 bg-white rounded-2xl shadow-sm border border-border max-w-6xl mx-auto">
              {loading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white p-6 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </div>
                  </div>
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="text-center">
                  <h1 className="text-3xl font-bold text-espresso">{editId ? 'Edit Product' : 'Add Product'}</h1>
                  <p className="text-mocha-grey mt-1">Manage your product details, inventory, and media assets.</p>
                </div>

                {/* Section 1: Basic Information */}
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-espresso py-2">Basic Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {renderInputField("Product Name", "name", "text", Tag, "#6B3F26", true)}
                    {renderInputField("Slug", "slug", "text", Sliders, "#6B3F26", true)}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {renderInputField("Description", "description", "text", FileText, "#6B3F26", true)}
                    {renderInputField("Long Description", "longDescription", "text", FileText, "#6B3F26")}
                  </div>
                </div>

                {/* Section 2: Physical Attributes & Category */}
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-espresso py-2">Physical Details & Categorization</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex flex-col gap-1">
                      <label className="font-semibold text-gray-800 mb-1 flex items-center gap-1">
                        Category<span className="text-red-500">*</span>
                      </label>
                      <select
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                      >
                        <option value="">Select a category</option>
                        {categoriesData?.categories?.map((cat: any) => (
                          <option key={cat.id} value={cat.name}>
                            {cat.name}
                          </option>
                        ))}
                        <option value="Others">Others</option>
                      </select>
                      {selectedCategory === "Others" && (
                        <input
                          type="text"
                          className="mt-2 w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                          placeholder="Enter custom category"
                          value={customCategory}
                          onChange={(e) => setCustomCategory(e.target.value)}
                        />
                      )}
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-semibold text-gray-800 mb-1 flex items-center gap-1">
                        Brand<span className="text-red-500">*</span>
                      </label>
                      <select
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                        value={selectedBrand}
                        onChange={(e) => setSelectedBrand(e.target.value)}
                        required
                      >
                        <option value="">Select a brand</option>
                        {brandsData?.brands?.map((brand: any) => (
                          <option key={brand.id} value={brand.name}>
                            {brand.name}
                          </option>
                        ))}
                        <option value="Others">Others</option>
                      </select>
                      {selectedBrand === "Others" && (
                        <input
                          type="text"
                          className="mt-2 w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                          placeholder="Enter custom brand"
                          value={customBrand}
                          onChange={(e) => setCustomBrand(e.target.value)}
                          required
                        />
                      )}
                    </div>
                    {renderInputField("Packing Standard", "packingStandard", "text", Box, "#6B3F26")}
                    {renderInputField("Weight (kg)", "weight", "number", Weight, "#6B3F26")}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {renderInputField("Materials", "materials", "text", Box, "#6B3F26")}
                    {renderInputField("Warranty", "warranty", "text", Shield, "#6B3F26")}
                    {renderInputField("Care Instructions", "careInstructions", "text", Info, "#6B3F26")}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {renderInputField("Additional Info", "additionalInfo", "text", Info, "#6B3F26")}
                  </div>
                  {renderKeyValueField("Specifications", specifications, setSpecifications)}
                </div>

                {/* Section 3: Pricing & Inventory */}
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-espresso py-2">Pricing & Inventory</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {renderInputField("Regular Price", "price", "number", DollarSign, "#6B3F26", true)}
                    {renderInputField("Discount Price", "discountPrice", "number", DollarSign, "#6B3F26", true)}
                    {renderInputField("Stock Quantity", "stockQuantity", "number", Archive, "#6B3F26", true)}
                  </div>
                </div>

                {/* Section 4: Media & Attributes */}
                <div className="space-y-8">
                  <h2 className="text-xl font-bold text-espresso py-2">Media & Attributes</h2>

                  <div className="bg-gray-50/50 p-6 rounded-2xl border border-dashed border-gray-300">
                    {renderArrayField("Product Images", productImages, setProductImages, true)}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-8">
                      {renderArrayField("Sizes", sizes, setSizes)}
                      <div className="pt-4">
                        {renderVariantImageUploader()}
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
                        <label className="block text-sm font-bold text-gray-800 mb-3">
                          Product Colors
                        </label>
                        <div className="flex flex-col gap-4">
                          <HexColorPicker
                            color={currentColor}
                            onChange={setCurrentColor}
                            className="w-full !h-36 rounded-lg shadow-sm"
                          />
                          <div className="flex items-center gap-2">
                            <div
                              className="w-8 h-8 rounded-full border shadow-sm"
                              style={{ backgroundColor: currentColor }}
                            />
                            <input
                              type="text"
                              value={currentColor}
                              onChange={(e) => setCurrentColor(e.target.value)}
                              className="border border-gray-200 rounded-lg px-3 py-1.5 text-xs w-24 focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                            <button
                              type="button"
                              onClick={addColor}
                              className="bg-primary hover:bg-primary/90 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-all"
                            >
                              Add Color
                            </button>
                          </div>
                          {colors.length > 0 && (
                            <div className="flex flex-wrap gap-2 p-2 bg-gray-50 rounded-lg">
                              {colors.map((color) => (
                                <div
                                  key={color}
                                  onClick={() => removeColor(color)}
                                  className="w-6 h-6 rounded-full border-2 border-white shadow-sm cursor-pointer hover:scale-110 transition-transform"
                                  style={{ backgroundColor: color }}
                                  title={`Remove ${color}`}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-6 p-4 bg-gray-50 rounded-2xl border border-gray-200">
                        <label className="flex items-center gap-3 text-gray-700 font-bold cursor-pointer">
                          <input
                            type="checkbox"
                            className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                            checked={isFeatured}
                            onChange={(e) => setIsFeatured(e.target.checked)}
                          />
                          Featured Product
                        </label>
                        <label className="flex items-center gap-3 text-gray-700 font-bold cursor-pointer">
                          <input
                            type="checkbox"
                            className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                            checked={isNewArrival}
                            onChange={(e) => setIsNewArrival(e.target.checked)}
                          />
                          New Arrival
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-espresso py-2">Additional Features</h2>
                  {renderArrayField("Features", features, setFeatures)}
                </div>

                <div className="pt-6">
                  <button
                    type="submit"
                    className="bg-primary text-white px-10 py-5 rounded-2xl hover:bg-primary/90 w-full text-xl font-black shadow-lg shadow-primary/20 transition-all hover:-translate-y-1 active:scale-[0.98]"
                  >
                    {editId ? 'UPDATE PRODUCT' : 'CREATE PRODUCT'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddProduct;