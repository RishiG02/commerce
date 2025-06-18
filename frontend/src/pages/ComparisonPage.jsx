import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { apiUrl } from '../config/config';
import '../css/ComparisonPage.css';

const ComparisonPage = () => {
  const [comparisonData, setComparisonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchComparisonData = async () => {
      try {
        const searchParams = new URLSearchParams(location.search);
        const productIds = searchParams.get('ids');
        
        if (!productIds) {
          throw new Error('No products selected for comparison');
        }

        const response = await axios.get(`${apiUrl}/api/products/compare?ids=${productIds}`);
        setComparisonData(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchComparisonData();
  }, [location.search]);

  if (loading) return <div className="comparison-loading">Loading comparison...</div>;
  if (error) return <div className="comparison-error">Error: {error}</div>;
  if (!comparisonData) return <div className="comparison-empty">No products to compare</div>;

  return (
    <div className="comparison-container">
      <h2>Product Comparison</h2>
      <button onClick={() => navigate(-1)} className="back-button">
        &larr; Back to Products
      </button>
      
      <div className="comparison-grid">
        {/* Header row with product names */}
        <div className="comparison-row header">
          <div className="attribute-name">Attribute</div>
          {comparisonData.products.map((product, idx) => (
            <div key={idx} className="product-info">
              <img 
                src={product.image_url} 
                alt={product.name} 
                className="product-image"
              />
              <h3>{product.name}</h3>
              <div className="product-price">
                {product.discount_price ? (
                  <>
                    <span className="original-price">₹{product.price}</span>
                    <span className="discounted-price">₹{product.discount_price}</span>
                  </>
                ) : (
                  <span>₹{product.price}</span>
                )}
              </div>
              <div className="product-rating">
                ★ {product.average_rating} ({product.review_count} reviews)
              </div>
            </div>
          ))}
        </div>

        {/* Comparison rows */}
        {comparisonData.commonAttributes.map((attr, idx) => (
          <div key={idx} className="comparison-row">
            <div className="attribute-name">{attr.name}</div>
            {attr.values.map((value, i) => (
              <div key={i} className="attribute-value">
                {value !== null && value !== undefined ? value.toString() : 'N/A'}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComparisonPage;