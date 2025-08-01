export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface CreateProductData {
  title: string;
  description: string;
  price: number;
  brand: string;
  category: string;
  stock: number;
}

export interface UpdateProductData extends CreateProductData {
  id: number;
}