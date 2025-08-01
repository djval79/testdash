"use client";

import { useState, useEffect, useMemo } from 'react';
import { Product } from '@/types/product';
import { ProductAPI } from '@/lib/api';
import { ProductCard } from '@/components/product-card';
import { ProductModal } from '@/components/product-modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Plus, 
  Search, 
  Filter, 
  SortAsc, 
  SortDesc, 
  Package,
  Loader2,
  X,
  TrendingUp,
  AlertTriangle,
  DollarSign,
  BarChart3,
  Star,
  Zap,
  Eye,
  EyeOff
} from 'lucide-react';
import { toast } from 'sonner';

type SortOption = 'title' | 'price' | 'rating' | 'stock';
type SortDirection = 'asc' | 'desc';

export default function ProductDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('title');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [categories, setCategories] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<Set<number>>(new Set());
  const [bulkMode, setBulkMode] = useState(false);
  
  // Advanced filtering states for Tech-Savvy Customer persona
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [minRating, setMinRating] = useState<string>('');
  const [stockFilter, setStockFilter] = useState<string>('all'); // all, in-stock, low-stock, out-of-stock
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
  const [advancedSearch, setAdvancedSearch] = useState(false);
  
  // Casual Shopper persona - Simple view mode
  const [simpleView, setSimpleView] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await ProductAPI.getProducts(100); // Get more products
      setProducts(response.products);
    } catch (error) {
      toast.error('Failed to fetch products');
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const cats = await ProductAPI.getCategories();
      setCategories(cats);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      fetchProducts();
      return;
    }

    try {
      setLoading(true);
      const response = await ProductAPI.searchProducts(query);
      setProducts(response.products);
    } catch (error) {
      toast.error('Failed to search products');
      console.error('Error searching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await ProductAPI.deleteProduct(id);
      setProducts(products.filter(p => p.id !== id));
      toast.success('Product deleted successfully');
    } catch (error) {
      toast.error('Failed to delete product');
      console.error('Error deleting product:', error);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleModalSuccess = () => {
    fetchProducts();
  };

  const toggleProductSelection = (productId: number) => {
    const newSelected = new Set(selectedProducts);
    if (newSelected.has(productId)) {
      newSelected.delete(productId);
    } else {
      newSelected.add(productId);
    }
    setSelectedProducts(newSelected);
  };

  const selectAllProducts = () => {
    if (selectedProducts.size === filteredAndSortedProducts.length) {
      setSelectedProducts(new Set());
    } else {
      setSelectedProducts(new Set(filteredAndSortedProducts.map(p => p.id)));
    }
  };

  const bulkUpdateStock = async (stockChange: number) => {
    if (selectedProducts.size === 0) {
      toast.error('Please select products to update');
      return;
    }

    try {
      setLoading(true);
      const updatePromises = Array.from(selectedProducts).map(async (productId) => {
        const product = products.find(p => p.id === productId);
        if (product) {
          const newStock = Math.max(0, product.stock + stockChange);
          return ProductAPI.updateProduct({ ...product, stock: newStock });
        }
      });

      await Promise.all(updatePromises);
      toast.success(`Updated stock for ${selectedProducts.size} products`);
      setSelectedProducts(new Set());
      setBulkMode(false);
      fetchProducts();
    } catch (error) {
      toast.error('Failed to update stock');
      console.error('Error updating stock:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Advanced filtering for Tech-Savvy Customer persona
    // Price range filtering
    if (priceRange.min !== '') {
      const minPrice = parseFloat(priceRange.min);
      if (!isNaN(minPrice)) {
        filtered = filtered.filter(product => product.price >= minPrice);
      }
    }
    if (priceRange.max !== '') {
      const maxPrice = parseFloat(priceRange.max);
      if (!isNaN(maxPrice)) {
        filtered = filtered.filter(product => product.price <= maxPrice);
      }
    }

    // Rating filtering
    if (minRating !== '' && minRating !== 'any') {
      const rating = parseFloat(minRating);
      if (!isNaN(rating)) {
        filtered = filtered.filter(product => product.rating >= rating);
      }
    }

    // Stock status filtering
    if (stockFilter !== 'all') {
      switch (stockFilter) {
        case 'in-stock':
          filtered = filtered.filter(product => product.stock > 10);
          break;
        case 'low-stock':
          filtered = filtered.filter(product => product.stock > 0 && product.stock <= 10);
          break;
        case 'out-of-stock':
          filtered = filtered.filter(product => product.stock === 0);
          break;
      }
    }

    // Advanced search (search in title, description, brand)
    if (searchQuery && advancedSearch) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product => 
        product.title.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.brand.toLowerCase().includes(query)
      );
    }

    // Sort products
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy];
      let bValue: any = b[sortBy];

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortDirection === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [products, selectedCategory, sortBy, sortDirection, priceRange, minRating, stockFilter, searchQuery, advancedSearch]);

  const clearFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setSortBy('title');
    setSortDirection('asc');
    setPriceRange({ min: '', max: '' });
    setMinRating('any');
    setStockFilter('all');
    setSelectedCategories(new Set());
    setAdvancedSearch(false);
    fetchProducts();
  };

  // Business Analytics
  const businessMetrics = useMemo(() => {
    const totalProducts = products.length;
    const totalCategories = new Set(products.map(p => p.category)).size;
    const averagePrice = products.length > 0 
      ? products.reduce((sum, p) => sum + p.price, 0) / products.length 
      : 0;
    const lowStockProducts = products.filter(p => p.stock < 10).length;
    const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
    
    return {
      totalProducts,
      totalCategories,
      averagePrice,
      lowStockProducts,
      totalValue
    };
  }, [products]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Package className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold">Product Dashboard</h1>
                <p className="text-muted-foreground">
                  Manage your product inventory with ease
                </p>
              </div>
            </div>
            <Button onClick={() => setIsModalOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Product
            </Button>
            <Button 
              variant={bulkMode ? "default" : "outline"} 
              onClick={() => {
                setBulkMode(!bulkMode);
                setSelectedProducts(new Set());
              }}
              className="gap-2"
            >
              <Package className="h-4 w-4" />
              {bulkMode ? 'Exit Bulk Mode' : 'Bulk Edit'}
            </Button>
            <Button 
              variant={simpleView ? "default" : "outline"} 
              onClick={() => setSimpleView(!simpleView)}
              className="gap-2"
              title="Toggle Simple View for easier browsing"
            >
              {simpleView ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {simpleView ? 'Detailed View' : 'Simple View'}
            </Button>
          </div>
        </div>
      </div>

      {/* Business Analytics Dashboard */}
      {!loading && products.length > 0 && (
        <div className="border-b bg-muted/30">
          <div className="container mx-auto px-4 py-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Business Overview
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="bg-background rounded-lg p-4 border">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Package className="h-4 w-4" />
                  Total Products
                </div>
                <div className="text-2xl font-bold">{businessMetrics.totalProducts}</div>
              </div>
              <div className="bg-background rounded-lg p-4 border">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Filter className="h-4 w-4" />
                  Categories
                </div>
                <div className="text-2xl font-bold">{businessMetrics.totalCategories}</div>
              </div>
              <div className="bg-background rounded-lg p-4 border">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <DollarSign className="h-4 w-4" />
                  Avg. Price
                </div>
                <div className="text-2xl font-bold">${businessMetrics.averagePrice.toFixed(2)}</div>
              </div>
              <div className="bg-background rounded-lg p-4 border">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <TrendingUp className="h-4 w-4" />
                  Total Value
                </div>
                <div className="text-2xl font-bold">${businessMetrics.totalValue.toLocaleString()}</div>
              </div>
              <div className={`bg-background rounded-lg p-4 border ${businessMetrics.lowStockProducts > 0 ? 'border-orange-200 bg-orange-50' : ''}`}>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <AlertTriangle className={`h-4 w-4 ${businessMetrics.lowStockProducts > 0 ? 'text-orange-500' : ''}`} />
                  Low Stock
                </div>
                <div className={`text-2xl font-bold ${businessMetrics.lowStockProducts > 0 ? 'text-orange-600' : ''}`}>
                  {businessMetrics.lowStockProducts}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Operations Panel */}
      {bulkMode && (
        <div className="border-b bg-blue-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={selectAllProducts}
                >
                  {selectedProducts.size === filteredAndSortedProducts.length ? 'Deselect All' : 'Select All'}
                </Button>
                <span className="text-sm text-muted-foreground">
                  {selectedProducts.size} products selected
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => bulkUpdateStock(10)}
                  disabled={selectedProducts.size === 0}
                >
                  +10 Stock
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => bulkUpdateStock(1)}
                  disabled={selectedProducts.size === 0}
                >
                  +1 Stock
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => bulkUpdateStock(-1)}
                  disabled={selectedProducts.size === 0}
                >
                  -1 Stock
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => bulkUpdateStock(-10)}
                  disabled={selectedProducts.size === 0}
                >
                  -10 Stock
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  handleSearch(e.target.value);
                }}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category, index) => (
                  <SelectItem key={`${category}-${index}`} value={category}>
                    {typeof category === 'string' 
                      ? category.charAt(0).toUpperCase() + category.slice(1)
                      : String(category)
                    }
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="title">Title</SelectItem>
                <SelectItem value="price">Price</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="stock">Stock</SelectItem>
              </SelectContent>
            </Select>
            
            <Button
              variant="outline"
              size="icon"
              onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
            >
              {sortDirection === 'asc' ? (
                <SortAsc className="h-4 w-4" />
              ) : (
                <SortDesc className="h-4 w-4" />
              )}
            </Button>

            {(selectedCategory !== 'all' || searchQuery || priceRange.min || priceRange.max || (minRating && minRating !== 'any') || stockFilter !== 'all' || advancedSearch) && (
              <Button variant="outline" onClick={clearFilters} className="gap-2">
                <X className="h-4 w-4" />
                Clear
              </Button>
            )}
          </div>
        </div>

        {/* Advanced Filters for Tech-Savvy Customer */}
        <div className="mt-4 p-4 border rounded-lg bg-muted/50">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="h-4 w-4 text-blue-500" />
            <span className="font-medium text-sm">Advanced Filters</span>
            <Badge variant="outline" className="text-xs">Tech Mode</Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Price Range */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Price Range</label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                  className="h-8"
                />
                <span className="text-muted-foreground">-</span>
                <Input
                  type="number"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                  className="h-8"
                />
              </div>
            </div>

            {/* Rating Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Min Rating</label>
              <Select value={minRating} onValueChange={setMinRating}>
                <SelectTrigger className="h-8">
                  <Star className="mr-2 h-3 w-3" />
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any Rating</SelectItem>
                  <SelectItem value="4.5">4.5+ Stars</SelectItem>
                  <SelectItem value="4.0">4.0+ Stars</SelectItem>
                  <SelectItem value="3.5">3.5+ Stars</SelectItem>
                  <SelectItem value="3.0">3.0+ Stars</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Stock Status */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Stock Status</label>
              <Select value={stockFilter} onValueChange={setStockFilter}>
                <SelectTrigger className="h-8">
                  <Package className="mr-2 h-3 w-3" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stock</SelectItem>
                  <SelectItem value="in-stock">In Stock (10+)</SelectItem>
                  <SelectItem value="low-stock">Low Stock (1-10)</SelectItem>
                  <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Advanced Search Toggle */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Search Mode</label>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="advanced-search"
                  checked={advancedSearch}
                  onCheckedChange={(checked) => setAdvancedSearch(checked === true)}
                />
                <label htmlFor="advanced-search" className="text-sm">
                  Search in description & brand
                </label>
              </div>
            </div>
          </div>
        </div>
        {/* Active Filters */}
        {(selectedCategory !== 'all' || searchQuery || priceRange.min || priceRange.max || minRating || stockFilter !== 'all' || advancedSearch) && (
          <div className="flex items-center gap-2 mt-4">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {searchQuery && (
              <Badge variant="secondary" className="gap-1">
                Search: {searchQuery}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => {
                    setSearchQuery('');
                    fetchProducts();
                  }}
                />
              </Badge>
            )}
            {selectedCategory !== 'all' && (
              <Badge variant="secondary" className="gap-1">
                Category: {selectedCategory}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => setSelectedCategory('all')}
                />
              </Badge>
            )}
            {(priceRange.min || priceRange.max) && (
              <Badge variant="secondary" className="gap-1">
                Price: {priceRange.min || '0'} - {priceRange.max || '∞'}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => setPriceRange({ min: '', max: '' })}
                />
              </Badge>
            )}
            {minRating && minRating !== 'any' && (
              <Badge variant="secondary" className="gap-1">
                Rating: {minRating}+ stars
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => setMinRating('any')}
                />
              </Badge>
            )}
            {stockFilter !== 'all' && (
              <Badge variant="secondary" className="gap-1">
                Stock: {stockFilter.replace('-', ' ')}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => setStockFilter('all')}
                />
              </Badge>
            )}
            {advancedSearch && (
              <Badge variant="secondary" className="gap-1">
                Advanced Search
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => setAdvancedSearch(false)}
                />
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 pb-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-square rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : filteredAndSortedProducts.length === 0 ? (
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || selectedCategory !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Get started by adding your first product'
              }
            </p>
            <Button onClick={() => setIsModalOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Product
            </Button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-muted-foreground">
                Showing {filteredAndSortedProducts.length} products
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAndSortedProducts.map((product, index) => (
                <ProductCard
                  key={`product-${product.id}-${index}`}
                  product={product}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  bulkMode={bulkMode}
                  isSelected={selectedProducts.has(product.id)}
                  onToggleSelect={toggleProductSelection}
                  simpleView={simpleView}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Product Modal */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        product={editingProduct}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
}