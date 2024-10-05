import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../components/customer/ProductCard';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import data from '../data/data.json';

const CustomerHome = () => {
  const [customerName, setCustomerName] = useState('Guest');
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState([]);
  const [sortBy, setSortBy] = useState(''); // State for sorting by nutrient
  const [sortOrder, setSortOrder] = useState('asc'); // State for sort order (ascending or descending)
  const navigate = useNavigate();
  const userId = localStorage.getItem('customerId'); // Get customerId from localStorage

  useEffect(() => {
    const storedName = localStorage.getItem('customerName');
    if (storedName && storedName.trim()) {
      setCustomerName(storedName);
    }

    // Transform product names for image matching
    const transformProductName = (name) => name.toLowerCase().replace(/\s+/g, '_');

    const allProducts = data.ingredients.map(product => ({
      ...product,
      transformedName: transformProductName(product.name)
    }));

    setProducts(allProducts);

    // Fetch user's cart from the server
    const fetchCart = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/cart/${userId}`);
        setCart(response.data.items); // Set the cart state with the fetched items
      } catch (error) {
        console.error('Error fetching cart:', error);
      }
    };

    if (userId) {
      fetchCart();
    }
  }, [userId]);

  const filteredProducts = products
    .filter(product => product.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (!sortBy) return 0; // No sorting if sortBy is not selected

      const comparison = parseFloat(a[sortBy]) - parseFloat(b[sortBy]);
      return sortOrder === 'asc' ? comparison : -comparison; // Adjust based on sortOrder
    });

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('customerId');
    localStorage.removeItem('customerName');
    navigate('/'); // Redirect to home page after logout
  };

  return (
    <div className="p-6">
      {/* Logo */}
      <h1 className="text-5xl font-bold text-gray-700 mb-0" style={{ marginLeft: '2cm' }}>
        <span style={{ color: 'green', fontWeight: 'bold', fontFamily: "'Edu Australia', cursive" }}>Fresh</span>{' '}
        <span style={{ color: 'black', fontWeight: 'bold', fontFamily: "'Edu Australia', cursive" }}>Fleet</span>
      </h1>

      {/* Greeting */}
      <h1 className="text-3xl font-bold text-center text-gray-700 mb-4" style={{ marginLeft: '38cm' }}>
        Hello {customerName}!
      </h1>

      {/* Search box, sort, and buttons container */}
      <div className="mb-6 flex justify-between items-center">
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search for products..."
          className="border border-gray-900 p-2 rounded-lg w-full max-w-md"
          style={{ marginLeft: '2cm' }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Search for products"
        />

        {/* Sort Dropdown */}
        <div className="flex items-center space-x-2" style={{ marginRight: '2cm' }}>
          <select
            className="border border-gray-900 p-2 rounded-lg w-48"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="">Sort by Nutrient</option>
            <option value="calories">Calories</option>
            <option value="carbohydrates">Carbohydrates</option>
            <option value="protein">Protein</option>
            <option value="fibers">Fibers</option>
          </select>

          {/* Sort Order Toggle (asc/desc) */}
          <select
            className="border border-gray-900 p-2 rounded-lg w-32"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="asc">Low to High</option>
            <option value="desc">High to Low</option>
          </select>
        </div>

        {/* Buttons container */}
        <div className="flex space-x-4" style={{ marginRight: '2cm' }}>
          <button
            onClick={() => navigate('/cart')}
            className="custom-button px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            MyCart
          </button>

          <button
            onClick={() => navigate('/recipes')}
            className="custom-button px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Recipes
          </button>

          <button
            onClick={handleLogout}
            className="custom-button px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Product list */}
      <div className="flex flex-wrap justify-center gap-10">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))
        ) : (
          <p>No products found.</p>
        )}
      </div>
    </div>
  );
};

export default CustomerHome;
