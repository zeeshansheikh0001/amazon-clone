import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from '../redux/slices/productSlice';
import ProductCard from '../components/ProductCard';
import '../assets/css/ProductsPage.css';

const ProductsPage = () => {
  const dispatch = useDispatch();
  const { products, isLoading, pagination } = useSelector((state) => state.product);
  const [filters, setFilters] = useState({
    category: '',
    search: '',
    minPrice: '',
    maxPrice: '',
    page: 1
  });

  useEffect(() => {
    dispatch(getProducts(filters));
  }, [dispatch, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
      page: 1 // Reset to page 1 when filters change
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({
      ...prev,
      page: newPage
    }));
  };

  return (
    <div className="products-page">
      <div className="container">
        <h1 className="page-title">Products</h1>
        
        {/* Filters */}
        <div className="filters">
          <div className="filter-group">
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Search products..."
              className="search-input"
            />
          </div>
          
          <div className="filter-group">
            <select 
              name="category" 
              value={filters.category}
              onChange={handleFilterChange}
              className="category-select"
            >
              <option value="">All Categories</option>
              <option value="electronics">Electronics</option>
              <option value="clothing">Clothing</option>
              <option value="home">Home & Kitchen</option>
              <option value="books">Books</option>
            </select>
          </div>
          
          <div className="filter-group price-filter">
            <input
              type="number"
              name="minPrice"
              value={filters.minPrice}
              onChange={handleFilterChange}
              placeholder="Min Price"
              className="price-input"
            />
            <span>-</span>
            <input
              type="number"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleFilterChange}
              placeholder="Max Price"
              className="price-input"
            />
          </div>
        </div>
        
        {/* Products Grid */}
        {isLoading ? (
          <div className="loading">Loading products...</div>
        ) : products.length > 0 ? (
          <div className="products-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="no-products">No products found matching your criteria.</div>
        )}
        
        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="pagination">
            <button 
              onClick={() => handlePageChange(filters.page - 1)}
              disabled={filters.page === 1}
              className="pagination-btn"
            >
              Previous
            </button>
            
            <span className="page-info">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            
            <button 
              onClick={() => handlePageChange(filters.page + 1)}
              disabled={filters.page === pagination.totalPages}
              className="pagination-btn"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage; 