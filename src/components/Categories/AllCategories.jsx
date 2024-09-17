import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  CircularProgress,
  Alert,
  Button,
} from "@mui/material";
import SortIcon from "@mui/icons-material/Sort";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useNavigate } from "react-router-dom";
import { getAllCategoriesByPagination } from "../../services/ApiService";
import "./AllCategories.css";

const AllCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMoreCategories, setHasMoreCategories] = useState(true);
  const pageSize = 6;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getAllCategoriesByPagination(pageNumber, pageSize);
        setCategories(data.data);

        setHasMoreCategories(data.data.length === pageSize);
      } catch (error) {
        setError("Error fetching categories: " + error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [pageNumber]);

  const handleSortClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSortClose = () => {
    setAnchorEl(null);
  };

  const handleSortOrder = (order) => {
    setSortOrder(order);
    setCategories(
      [...categories].sort((a, b) => {
        if (order === "asc") {
          return a.categoryName.localeCompare(b.categoryName);
        } else {
          return b.categoryName.localeCompare(a.categoryName);
        }
      })
    );
    handleSortClose();
  };

  const handleCardClick = (categoryId) => {
    navigate(`/category/${categoryId}`);
  };

  const handlePreviousPage = () => {
    if (pageNumber > 1) {
      setPageNumber((prevPageNumber) => prevPageNumber - 1);
    }
  };

  const handleNextPage = () => {
    if (hasMoreCategories) {
      setPageNumber((prevPageNumber) => prevPageNumber + 1);
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Container className="categories-container">
      <Typography
        variant="h4"
        component="h2"
        className="category-title"
        align="center"
        gutterBottom
      >
        Categories
      </Typography>
      <div className="sort-button">
        <IconButton
          aria-controls="sort-menu"
          aria-haspopup="true"
          onClick={handleSortClick}
        >
          <SortIcon />
        </IconButton>
      </div>
      <Menu
        id="sort-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleSortClose}
      >
        <MenuItem onClick={() => handleSortOrder("asc")}>Ascending</MenuItem>
        <MenuItem onClick={() => handleSortOrder("desc")}>Descending</MenuItem>
      </Menu>
      <Grid container spacing={4}>
        {categories.map((category) => (
          <Grid item key={category.categoryId} xs={12} sm={6} md={4}>
            <Card
              className="category-card"
              onClick={() => handleCardClick(category.categoryId)}
            >
              <CardMedia
                component="img"
                height="150"
                image={category.categoryImage}
                alt={category.categoryName}
                className="category-image"
              />
              <CardContent>
                <Typography
                  variant="h6"
                  component="div"
                  className="category-name"
                >
                  {category.categoryName}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <div className="pagination-controls">
        <Button
          variant="contained"
          color="primary"
          startIcon={<NavigateBeforeIcon />}
          onClick={handlePreviousPage}
          disabled={pageNumber === 1}
        >
          Previous
        </Button>
        <Typography variant="body2" component="span" className="page-number">
          Page {pageNumber}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          endIcon={<NavigateNextIcon />}
          onClick={handleNextPage}
          disabled={!hasMoreCategories}
        >
          Next
        </Button>
      </div>
    </Container>
  );
};

export default AllCategories;