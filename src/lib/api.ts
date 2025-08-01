import { Product, ProductsResponse, CreateProductData, UpdateProductData } from '@/types/product';

const BASE_URL = 'https://dummyjson.com';

export class ProductAPI {
  static async getProducts(limit = 30, skip = 0): Promise<ProductsResponse> {
    const response = await fetch(`${BASE_URL}/products?limit=${limit}&skip=${skip}`);
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    return response.json();
  }

  static async getProduct(id: number): Promise<Product> {
    const response = await fetch(`${BASE_URL}/products/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch product');
    }
    return response.json();
  }

  static async createProduct(data: CreateProductData): Promise<Product> {
    const response = await fetch(`${BASE_URL}/products/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to create product');
    }
    return response.json();
  }

  static async updateProduct(data: UpdateProductData): Promise<Product> {
    const response = await fetch(`${BASE_URL}/products/${data.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to update product');
    }
    return response.json();
  }

  static async deleteProduct(id: number): Promise<{ isDeleted: boolean; id: number }> {
    const response = await fetch(`${BASE_URL}/products/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete product');
    }
    return response.json();
  }

  static async searchProducts(query: string): Promise<ProductsResponse> {
    const response = await fetch(`${BASE_URL}/products/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error('Failed to search products');
    }
    return response.json();
  }

  static async getCategories(): Promise<string[]> {
    const response = await fetch(`${BASE_URL}/products/categories`);
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    const data = await response.json();
    // Ensure we return an array of unique strings
    if (Array.isArray(data)) {
      const uniqueCategories = [...new Set(data.map(cat => String(cat)))];
      return uniqueCategories;
    }
    return [];
  }
}