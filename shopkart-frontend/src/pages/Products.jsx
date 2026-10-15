import React, { useState, useEffect } from 'react';
import api from '../services/api';
import ProductCard from '../components/ProductCard';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');
      
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (category !== 'All') params.append('category', category);
      if (sort) params.append('sort', sort);

      const res = await api.get(`/products?${params.toString()}`);
      setProducts(res.data.products);
    } catch (err) {
      setError('Something went wrong while loading products.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [category, sort]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  return (
    <div style={styles.container}>
      <h2>Product Catalog 🛒</h2>

      <div style={styles.controls}>
        <form onSubmit={handleSearchSubmit} style={styles.searchForm}>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.searchInput}
          />
          <button type="submit" style={styles.searchBtn}>Search</button>
        </form>

        <select value={category} onChange={(e) => setCategory(e.target.value)} style={styles.select}>
          <option value="All">All Categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Fashion">Fashion</option>
          <option value="Books">Books</option>
          <option value="Home">Home</option>
        </select>

        <select value={sort} onChange={(e) => setSort(e.target.value)} style={styles.select}>
          <option value="">Default Sorting</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>

      {loading && <div style={styles.status}>Loading products...</div>}

      {error && <div style={styles.error}>{error}</div>}

      {!loading && !error && products.length === 0 && (
        <div style={styles.status}>No products found. Try adjusting your filters.</div>
      )}

      {!loading && !error && products.length > 0 && (
        <div style={styles.grid}>
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { padding: '2rem', maxWidth: '1200px', margin: '0 auto' },
  controls: { display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' },
  searchForm: { display: 'flex', gap: '0.5rem', flexGrow: 1 },
  searchInput: { padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc', flexGrow: 1 },
  searchBtn: { padding: '0.5rem 1rem', background: '#0284c7', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  select: { padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' },
  status: { textAlign: 'center', padding: '3rem', fontSize: '1.2rem', color: '#64748b' },
  error: { textAlign: 'center', padding: '1rem', background: '#fef2f2', color: '#dc2626', borderRadius: '4px' }
};

export default Products;