export interface BulkProduct {
  name: string;
  price: number;
  category: string;
  brand?: string;
  stock_quantity: number;
  description?: string;
  long_description?: string;
  materials?: string;
  care_instructions?: string;
  specifications?: any;
  additional_info?: string;
  weight?: number;
  warranty?: string;
  admin_email?: string;
  admin_name?: string;
  admin_number?: string;
  discount_price?: number;
  packing_standard?: string;
  video_url?: string;
  type?: 'own' | 'affiliate';
  affiliate_link?: string;
  product_images?: string[];
  tags?: string[];
  colors?: string[];
  sizes?: string[];
  features?: string[];
  variants?: any[];
  delivery_charges?: any;
  default_delivery_charge?: number;
  is_featured?: boolean | number;
  is_new_arrival?: boolean | number;
  status?: 'active' | 'inactive' | 'draft';
  slug?: string;
}

export interface BulkUploadValidation {
  isValid: boolean;
  errors: string[];
}

export interface BulkProductWithValidation extends BulkProduct {
  _validation?: BulkUploadValidation;
  _index?: number;
}

export interface BulkUploadResult {
  total: number;
  successful: number;
  failed: number;
  message: string;
  errors: BulkUploadError[];
  insertedIds: number[];
}

export interface BulkUploadError {
  row: number;
  errors: string[];
  data: BulkProduct;
}

export interface CSVPreviewItem {
  row: number;
  product: {
    name: string;
    price: number;
    category: string;
    brand: string;
    stock_quantity: number;
  };
  isValid: boolean;
  errors: string[];
}

export interface CSVPreviewResponse {
  total: number;
  preview: CSVPreviewItem[];
  validCount: number;
  invalidCount: number;
}

export interface BulkUploadState {
  products: BulkProductWithValidation[];
  isUploading: boolean;
  isPreviewing: boolean;
  result: BulkUploadResult | null;
  preview: CSVPreviewResponse | null;
  errors: BulkUploadError[];
}

export type UploadMethod = 'csv' | 'manual';