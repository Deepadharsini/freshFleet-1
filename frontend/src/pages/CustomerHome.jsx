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
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const navigate = useNavigate();
  const userId = localStorage.getItem('customerId');

  useEffect(() => {
    const storedName = localStorage.getItem('customerName');
    if (storedName && storedName.trim()) {
      setCustomerName(storedName);
    }

    // Transform product names for image matching
    const transformProductName = (name) => name.toLowerCase().replace(/\s+/g, '_');
    const allProducts = data.ingredients.map((product) => ({
      ...product,
      transformedName: transformProductName(product.name),
    }));

    setProducts(allProducts);

    // Fetch user's cart from the server
    const fetchCart = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/cart/${userId}`);
        setCart(response.data.items);
      } catch (error) {
        console.error('Error fetching cart:', error);
      }
    };

    if (userId) {
      fetchCart();
    }
  }, [userId]);

  const filteredProducts = products
    .filter((product) => product.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (!sortBy) return 0;

      const comparison = parseFloat(a[sortBy]) - parseFloat(b[sortBy]);
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('customerId');
    localStorage.removeItem('customerName');
    navigate('/');
  };

  return (
    <div className="bg-[#e0f7e0] min-h-screen p-4 md:p-8 lg:p-12">
      {/* Logo */}
      <h1 className="text-4xl md:text-5xl font-bold text-gray-700 mb-2 md:mb-6 text-center lg:text-left lg:ml-8">
        <span style={{ color: 'green', fontWeight: 'bold', fontFamily: "'Edu Australia', cursive" }}>Fresh</span>{' '}
        <span style={{ color: 'black', fontWeight: 'bold', fontFamily: "'Edu Australia', cursive" }}>Fleet</span>
      </h1>

      {/* Greeting */}
      <h1 className="text-2xl md:text-3xl font-bold text-center lg:text-left text-gray-700 mb-4 lg:ml-8">
        Hello {customerName}!
      </h1>

      {/* Search box, sort, and buttons container */}
      <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0 lg:mx-8">
        {/* Search Input */}
        <input
          type="text"
          placeholder="Search for products..."
          className="border border-gray-900 p-2 rounded-lg w-full max-w-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Search for products"
        />

        {/* Sort Dropdown */}
        <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4 lg:space-x-8">
          <select
            className="border border-gray-900 p-2 rounded-lg"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="">Sort by Nutrient</option>
            <option value="calories">Sort by Calories</option>
            <option value="carbohydrates">Sort by Carbohydrates</option>
            <option value="protein">Sort by Protein</option>
            <option value="fibers">Sort by Fibers</option>
          </select>

          <select
            className="border border-gray-900 p-2 rounded-lg"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="asc">Low to High</option>
            <option value="desc">High to Low</option>
          </select>
        </div>

        {/* Buttons container */}
        <div className="flex space-x-4 lg:space-x-6">
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
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6 lg:mx-8">
  {filteredProducts.length > 0 ? (
    filteredProducts.map((product, index) => (
      <ProductCard key={index} product={product} />
    ))
  ) : (
    <p className="text-center lg:text-left lg:ml-8">No products found.</p>
  )}
</div>


    </div>
  );
};

export default CustomerHome;
