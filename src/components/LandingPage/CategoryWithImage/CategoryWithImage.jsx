import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllCategoriesByPagination } from "../../../services/ApiService";
import "./CategoryWithImage.css";

function CategoryWithImage() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await getAllCategoriesByPagination(1, 8);
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    }
    fetchCategories();
  }, []);

  return (
    <div className="category-container">
      {categories.map((category) => (
        <div key={category.categoryId} className="category-item">
          <Link to={`/category/${category.categoryId}`}>
            <div className="category-image-wrapper">
              <img
                src={category.categoryImage}
                alt={category.categoryName}
                className="category-image"
              />
            </div>
            <div className="category-name">{category.categoryName}</div>
          </Link>
        </div>
      ))}
    </div>
  );
}

export default CategoryWithImage;