import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const { name, image } = product;
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/product/${name}`);
  };

  // Directly use image name for files in the 'public' directory
  const imagePath = image ? `/${image}` : '/default.jpeg';

  return (
    <div 
      onClick={handleClick} 
      className="border border-gray-300 rounded-lg p-4 shadow-lg w-64 cursor-pointer"
    >
      <img 
        src={imagePath} 
        alt={name} 
        className="w-full h-32 object-cover rounded-lg mb-4" 
      />
      <h3 className="text-lg font-semibold text-center">{name}</h3>
    </div>
  );
};

export default ProductCard;
