import { Link } from "react-router-dom";
import { products } from "../data/productsData";

export default function RecommendedProducts({ currentProductId }) {
  const recommended = products
    .filter((p) => p.id !== currentProductId)
    .slice(0, 4);

  return (
    <div className="mt-10">
      <h2 className="text-xl font-bold mb-4">You May Also Like</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {recommended.map((product) => (
          <Link
            to={`/product/${product.id}`}
            key={product.id}
            className="bg-white rounded-lg shadow hover:shadow-lg transition p-3 flex flex-col"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-40 object-cover rounded"
            />
            <h3 className="mt-3 font-medium text-sm truncate">
              {product.name}
            </h3>
            <div className="text-blue-600 font-bold">${product.price}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
