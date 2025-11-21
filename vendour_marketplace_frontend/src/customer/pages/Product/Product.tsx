import {
  Box,
  Button,
  Divider,
  Drawer,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  Typography,
  useMediaQuery,
  useTheme,
  type SelectChangeEvent,
} from "@mui/material";
import { useEffect, useState } from "react";
import FilterSection from "./FilterSection";
import { FilterAlt } from "@mui/icons-material";
import ProductCard from "./ProductCard";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import { fetchAllProducts } from "../../../redux/slice/customer/productSlice";
import type { ProductParamsRequest } from "../../../types/product";
import ProductCardSkeleton from "../../../component/skeleton/ProductCardSkeleton";

const Product = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { categoryId, productTitle, categoryName } = useParams<{
    categoryId?: string;
    categoryName?: string;
    productTitle?: string;
  }>();

  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useAppDispatch();
  const { product } = useAppSelector((store) => store);

  const theme = useTheme();
  const isLarge = useMediaQuery(theme.breakpoints.up("lg"));

  const [page, setPage] = useState<number>(1);
  const [sort, setIsSort] = useState<string>();
  const [openFilter, setOpenFilter] = useState<boolean>(false);
  const [chatProductId, setChatProductId] = useState<number | null>(null);

  const handleSortChange = (event: SelectChangeEvent) => {
    setIsSort(event.target.value as string);
  };

  const pageNumber = page - 1;

  // Handle "Show all products" - reset category filter but keep other filters
  const handleAllProducts = () => {
    if (categoryId) {
      // Navigate to all products within the same route structure
      navigate("/products/category/all/All Products");
    } else {
      // If already on all products, just refetch with null category
      fetchProducts();
    }
  };

  // Handle category selection
  const handleCategorySelect = (newCategoryId: string, newCategoryName: string) => {
    navigate(`/products/category/${newCategoryId}/${newCategoryName}`);
  };

  // Determine if we're currently viewing all products
  const isViewingAllProducts = categoryId === "all" || !categoryId;

  // Fetch products based on current route and filters
  const fetchProducts = () => {
    const [minPrice, maxPrice] = searchParams.get("price")?.split("-") || [];
    const color = searchParams.get("color");
    const minDiscount = searchParams.get("discount");

    const baseParams = {
      color,
      minDiscount: minDiscount ? Number(minDiscount) : null,
      minPrice: minPrice ? Number(minPrice) : null,
      maxPrice: maxPrice ? Number(maxPrice) : null,
      sort,
      pageNumber,
    };

    let request: ProductParamsRequest;

    if (location.pathname.includes("/products/search/")) {
      request = {
        ...baseParams,
        productTitle: productTitle || null,
        categoryId: null,
      };
    } else if (location.pathname.includes("/products/category/")) {
      if (categoryId === "All Products" || categoryId === "all") {
        // All products
        request = {
          ...baseParams,
          categoryId: null,
          productTitle: null,
        };
      } else {
        // Specific category
        request = {
          ...baseParams,
          categoryId: categoryId || null,
          productTitle: null,
        };
      }
    } else {
      request = {
        ...baseParams,
        categoryId: null,
        productTitle: null,
      };
    }

    dispatch(fetchAllProducts({ params: request }));
  };

  useEffect(() => {
    fetchProducts();
  }, [searchParams, categoryId, dispatch, pageNumber, sort, productTitle, location]);

  const handlePage = (value: number) => {
    setPage(value);
  };

  // Get display title
  const getDisplayTitle = () => {
    if (categoryId === "all") {
      return "All";
    }
    return categoryName || "Products";
  };

  return (
    <div className="mt-10">
      {/* Page Title */}
      <h1 className="text-2xl text-center font-bold text-primary-color pb-5 px-9 uppercase">
        {getDisplayTitle()}
      </h1>

      <div className="lg:flex">
        {/* Sidebar filter for large screens */}
        {isLarge && (
          <section className="filter-section hidden lg:block w-[20%]">
            <FilterSection />
          </section>
        )}

        <div className="w-full lg:w-[80%] space-y-5">
          {/* Top controls */}
          <div className="flex justify-between items-center px-9 h-[40px]">
            <div className="flex items-center gap-2">
              {!isLarge && (
                <>
                  <IconButton onClick={() => setOpenFilter(true)}>
                    <FilterAlt />
                  </IconButton>
                  <Drawer
                    anchor="left"
                    open={openFilter}
                    onClose={() => setOpenFilter(false)}
                    sx={{ zIndex: 1600 }}
                  >
                    <Box sx={{ width: 280 }}>
                      <FilterSection />
                      {/* Mobile Category Navigation */}
                      <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
                        <Typography variant="h6" gutterBottom>
                          Categories
                        </Typography>
                        <Button
                          fullWidth
                          variant={isViewingAllProducts ? "contained" : "outlined"}
                          onClick={() => {
                            handleAllProducts();
                            setOpenFilter(false);
                          }}
                          sx={{ mb: 1, justifyContent: 'flex-start' }}
                        >
                          All Products
                        </Button>
                        <Button
                          fullWidth
                          variant={categoryId === "1" ? "contained" : "outlined"}
                          onClick={() => {
                            handleCategorySelect("1", "Electronics");
                            setOpenFilter(false);
                          }}
                          sx={{ mb: 1, justifyContent: 'flex-start' }}
                        >
                          Electronics
                        </Button>
                        <Button
                          fullWidth
                          variant={categoryId === "2" ? "contained" : "outlined"}
                          onClick={() => {
                            handleCategorySelect("2", "Clothing");
                            setOpenFilter(false);
                          }}
                          sx={{ mb: 1, justifyContent: 'flex-start' }}
                        >
                          Clothing
                        </Button>
                      </Box>
                    </Box>
                  </Drawer>
                </>
              )}

              {/* Show current category info on mobile */}
              {!isLarge && (
                <Typography variant="body1" fontWeight="medium">
                  {getDisplayTitle()}
                </Typography>
              )}
            </div>

            <div className="flex items-center gap-4">
              {/* Sort Section */}
              <FormControl size="small" sx={{ width: "200px" }}>
                <InputLabel id="sort-select-label">Sort by</InputLabel>
                <Select
                  labelId="sort-select-label"
                  id="sort-select"
                  value={sort || ""}
                  label="Sort by"
                  onChange={handleSortChange}
                >
                  <MenuItem value={"low_to_high"}>Price: Low to High</MenuItem>
                  <MenuItem value={"high_to_low"}>Price: High to Low</MenuItem>
                  <MenuItem value={"newest"}>Newest</MenuItem>
                  <MenuItem value={"oldest"}>Oldest</MenuItem>
                </Select>
              </FormControl>

              {/* Show All Products Button - Only show when viewing a specific category */}
              {!isViewingAllProducts && (
                <Button
                  variant="outlined"
                  onClick={handleAllProducts}
                >
                  Show all products
                </Button>
              )}
            </div>
          </div>

          <Divider />

          {/* Product Card Section */}
          {product.loading ? (
            <section className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-5">
              {Array.from({ length: 8 }).map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))}
            </section>
          )
            : product.products?.content?.length ? (
              <>
                <section className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-5">
                  {product.products.content.map((data) => (
                    <div
                      key={data.id}
                      onClick={() =>
                        navigate(
                          `/product-details/${data.id}/${data.category?.name}/${data.category?.categoryId}`
                        )
                      }
                      className="cursor-pointer"
                    >
                      <ProductCard
                        productDetail={data}
                        chatProductId={chatProductId}
                        setChatProductId={setChatProductId}
                      />
                    </div>
                  ))}
                </section>

                <div className="flex justify-center py-10">
                  <Pagination
                    count={product.products.totalPages ?? 5}
                    page={page}
                    onChange={(e, value) => handlePage(value)}
                    shape="rounded"
                    color="primary"
                  />
                </div>
              </>
            ) : (
              <Box className="flex flex-col items-center justify-center py-16">
                <Typography variant="h6" color="textSecondary" gutterBottom>
                  No products found
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Try adjusting your filters or check back later.
                </Typography>
                {!isViewingAllProducts && (
                  <Button
                    variant="contained"
                    onClick={handleAllProducts}
                    sx={{ mt: 2 }}
                  >
                    Show All Products
                  </Button>
                )}
              </Box>
            )}
        </div>
      </div>
    </div>
  );
};

export default Product;