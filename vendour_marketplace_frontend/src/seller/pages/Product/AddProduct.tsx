import { AddPhotoAlternateRounded, CloseRounded } from "@mui/icons-material";
import { Button, CircularProgress, FormControl, FormHelperText, Grid, IconButton, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { useFormik } from "formik";
import { useState } from "react";
import { uploadToCloudinary } from "../../../util/uploadToCloudinary";
import { mainCategory } from "../../../data/category/mainCategory";
import { colors } from "../../../data/filter/colors";
import type { ProductRequest } from "../../../types/product";
import { categoryLevelThree, categoryLevelTwo } from "../../../types/category";
import store, { useAppDispatch, useAppSelector } from "../../../redux/store";
import { createProduct } from "../../../redux/slice/seller/sellerProductSlice";
import * as Yup from "yup";
import type { SnackbarProps } from "../../../types/props";
import SnackbarMessage from "../../../component/SnackbarMessage/SnackbarMessage";


const AddProduct = () => {

    const [uploadImage, setUploadImage] = useState(false);
    const [snackbar, setSnackbar] = useState<SnackbarProps>({
        open: false,
        message: "",
        severity: "success",
    });
    const dispatch = useAppDispatch();
    const product = useAppSelector(store => store.sellerProduct);
    const validationSchema = Yup.object({
        title: Yup.string()
            .required("Title is required")
            .min(3, "Title must be at least 3 characters"),
        description: Yup.string()
            .required("Description is required")
            .min(10, "Description must be at least 10 characters")
            .max(500, "Description must be in 500 characters"),
        images: Yup.array()
            .of(Yup.string().url("Invalid image URL"))
            .min(1, "At least one product image is required"),
        mrpPrice: Yup.number()
            .required("MRP price is required")
            .min(1, "MRP must be greater than 0"),
        sellingPrice: Yup.number()
            .required("Selling price is required")
            .min(1, "Selling price must be greater than 0")
            .max(Yup.ref("mrpPrice"), "Selling price cannot exceed MRP"),
        color: Yup.string().required("Color is required"),
        sizes: Yup.string().required("Size is required"),
        stocks: Yup.number()
            .required("Stock is required")
            .min(1, "Stock must be at least 1"),
        category1: Yup.string().required("First category is required"),
        category2: Yup.string().required("Second category is required"),
        category3: Yup.string().required("Third category is required"),
    });





    const formik = useFormik<ProductRequest>({
        initialValues: {
            images: [],
            title: '',
            description: '',
            color: '',
            stocks: 1,
            category1: '',
            category2: '',
            category3: '',
            sizes: '',
            sellingPrice: 0,
            mrpPrice: 0,
        },
        validationSchema,
        onSubmit: async (values) => {
                console.log('Add product:', values);

                const result = await dispatch(createProduct(values)); 
                if (createProduct.fulfilled.match(result)) {
                    setSnackbar({
                        open: true,
                        message: "Product added successfully.",
                        severity: "success",
                    });
                    formik.resetForm();
                } else if (createProduct.rejected.match(result)) {
                    setSnackbar({
                        open: true,
                        message: result.payload || "Unable to add product. Please try again.",
                        severity: "error",
                    });
                }
        },
    })
    const [selectedCategory, setSelectedCategory] = useState<string>(formik.values.category1);


    const handleImageChange = async (event: any) => {
        const file = event.target.files[0];
        setUploadImage(true);
        const image = await uploadToCloudinary(file, "image");
        formik.setFieldValue("images", [...formik.values.images, image]);
        setUploadImage(false);
    }
    const handleRemoveImage = (index: number) => {
        const updatedImages = [...formik.values.images];
        updatedImages.splice(index, 1);
        formik.setFieldValue("images", updatedImages);
    };


    const levelTwoCategories = categoryLevelTwo[selectedCategory] || [];
    const levelThreeCategories = categoryLevelThree[selectedCategory] || [];

    return (
        <>
            <div className=''>
                <form onSubmit={formik.handleSubmit} className="space-y-4 p-4">
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12 }}>
                            {/* Hidden input */}
                            <input
                                type="file"
                                accept="image/*"
                                id="image-input"
                                style={{ display: "none" }}
                                onChange={handleImageChange}
                            />
                            {/* Upload placeholder */}
                            <label htmlFor="image-input" className="relative inline-block">
                                <span className="w-24 h-24 border border-primary-color rounded-md cursor-pointer flex items-center justify-center">
                                    <AddPhotoAlternateRounded className="text-gray-700" />
                                </span>
                                {uploadImage && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-white/50 rounded-md">
                                        <CircularProgress size={24} />
                                    </div>
                                )}
                            </label>
                            {/* Validation error for images */}
                            {formik.touched.images && formik.errors.images && (
                                <p className="text-red-600/100 text-sm mt-1">{formik.errors.images}</p>
                            )}

                            {/* Uploaded images */}
                            <div className="flex flex-wrap gap-2 mt-2">
                                {formik.values.images.map((image, index) => (
                                    <div key={index} className="relative w-24 h-24">
                                        <img
                                            src={image}
                                            alt={`Image ${index + 1}`}
                                            className="w-24 h-24 object-cover rounded-md border"
                                        />
                                        <IconButton
                                            onClick={() => handleRemoveImage(index)}
                                            size="small"
                                            color="error"
                                            sx={{
                                                position: "absolute",
                                                top: 2,
                                                right: 2,
                                                backgroundColor: "white",
                                                "&:hover": { backgroundColor: "white" }
                                            }}
                                        >
                                            <CloseRounded sx={{ fontSize: "1rem" }} />
                                        </IconButton>
                                    </div>
                                ))}
                            </div>
                        </Grid>

                        {/* Title */}
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                name="title"
                                onChange={formik.handleChange}
                                value={formik.values.title}
                                label="Title"
                                fullWidth
                                error={formik.touched.title && Boolean(formik.errors.title)}
                                helperText={formik.touched.title && formik.errors.title}
                            />
                        </Grid>
                        {/* Description */}
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                name="description"
                                onChange={formik.handleChange}
                                value={formik.values.description}
                                label="Description"
                                multiline
                                rows={3}
                                fullWidth
                                error={formik.touched.description && Boolean(formik.errors.description)}
                                helperText={formik.touched.description && formik.errors.description}
                            />
                        </Grid>
                        {/* MRP,Selling Price ,Color and Sizes */}
                        <Grid size={{ xs: 12, md: 4, lg: 3 }}>
                            <TextField
                                name="mrpPrice"
                                onChange={formik.handleChange}
                                value={formik.values.mrpPrice}
                                label="Maximum Retail Price"
                                fullWidth

                                error={formik.touched.mrpPrice && Boolean(formik.errors.mrpPrice)}
                                helperText={formik.touched.mrpPrice && formik.errors.mrpPrice}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 4, lg: 3 }}>
                            <TextField
                                name="sellingPrice"
                                onChange={formik.handleChange}
                                value={formik.values.sellingPrice}
                                label="Selling Price"
                                fullWidth

                                error={formik.touched.sellingPrice && Boolean(formik.errors.sellingPrice)}
                                helperText={formik.touched.sellingPrice && formik.errors.sellingPrice}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 4, lg: 3 }}>
                            <FormControl fullWidth
                                error={formik.touched.color && Boolean(formik.errors.color)}
                            >
                                <InputLabel id="color-label">Color</InputLabel>
                                <Select
                                    labelId="color-label"
                                    name="color"
                                    onBlur={formik.handleBlur}
                                    value={formik.values.color}
                                    label="Color"
                                    onChange={formik.handleChange}
                                    MenuProps={{
                                        PaperProps: {
                                            sx: {
                                                // maxHeight: 300,
                                                overflow: "auto",
                                                "&::-webkit-scrollbar": {
                                                    display: "none", // Chrome, Safari
                                                },
                                                scrollbarWidth: "none", // Firefox
                                                msOverflowStyle: "none", // IE / Edge
                                            },
                                        },
                                    }}
                                >
                                    {colors.map((color, index) =>
                                        <MenuItem value={color.name} key={index} sx={{
                                            scrollBehavior: 'smooth'
                                        }}>
                                            <div className="flex gap-3">
                                                <span
                                                    style={{
                                                        backgroundColor: color.hex,
                                                        border: color.name === "White" ? '1px solid gray' : 'none'
                                                    }}
                                                    className={`w-5 h-5 rounded-full ${color.name === "White" ? 'border border-gray-600' : ''}`}></span>
                                                <p>{color.name}</p>
                                            </div>
                                        </MenuItem>
                                    )}
                                </Select>
                                {formik.touched.color && formik.errors.color && (
                                    <FormHelperText>{formik.errors.color}</FormHelperText>
                                )}
                            </FormControl>
                        </Grid>
                        <Grid size={{ xs: 12, md: 4, lg: 3 }}>
                            <FormControl fullWidth
                                error={formik.touched.sizes && Boolean(formik.errors.sizes)}
                            >
                                <InputLabel id="sizes-label">Sizes</InputLabel>
                                <Select
                                    labelId="sizes-label"
                                    name="sizes"
                                    value={formik.values.sizes}
                                    label="Sizes"
                                    onChange={formik.handleChange}
                                >
                                    <MenuItem value=""><em>None</em></MenuItem>
                                    <MenuItem value="xxl">XXL</MenuItem>
                                    <MenuItem value="xl">XL</MenuItem>
                                    <MenuItem value="lg">LG</MenuItem>
                                    <MenuItem value="md">MD</MenuItem>
                                    <MenuItem value="sm">SM</MenuItem>
                                    <MenuItem value="xs">XS</MenuItem>
                                </Select>
                                {formik.touched.sizes && formik.errors.sizes && (
                                    <FormHelperText>{formik.errors.sizes}</FormHelperText>
                                )}
                            </FormControl>
                        </Grid>

                        <Grid size={{ xs: 12, md: 3 }}>
                            <TextField
                                fullWidth
                                id="stocks"
                                name="stocks"
                                label="Stock Quantity"
                                type="number"
                                value={formik.values.stocks}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={
                                    formik.touched.stocks &&
                                    Boolean(formik.errors.stocks)
                                }
                                helperText={
                                    formik.touched.stocks && formik.errors.stocks
                                }
                            />
                        </Grid>
                        {/* Categories */}
                        {/* First Category */}
                        <Grid size={{ xs: 12, md: 3 }}>
                            <FormControl fullWidth
                                error={formik.touched.category1 && Boolean(formik.errors.category1)}
                            >
                                <InputLabel id="category1-label">First Category</InputLabel>
                                <Select
                                    labelId="category1-label"
                                    name="category1"
                                    value={formik.values.category1}
                                    label="First Category"
                                    onChange={(e) => {
                                        formik.handleChange(e);
                                        setSelectedCategory(e.target.value); // update for next levels
                                        formik.setFieldValue("category2", "");
                                        formik.setFieldValue("category3", "");
                                    }}
                                    onBlur={formik.handleBlur}
                                >
                                    {mainCategory.map((item) => (
                                        <MenuItem key={item.categoryId} value={item.categoryId}>
                                            {item.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {formik.touched.category1 && formik.errors.category1 && (
                                    <FormHelperText>{formik.errors.category1}</FormHelperText>
                                )}
                            </FormControl>
                        </Grid>

                        {/* Second Category */}
                        <Grid size={{ xs: 12, md: 3 }}>
                            <FormControl fullWidth
                                error={formik.touched.category2 && Boolean(formik.errors.category2)}
                            >
                                <InputLabel id="category2-label">Second Category</InputLabel>
                                <Select
                                    labelId="category2-label"
                                    label="Second Category"
                                    name="category2"
                                    value={formik.values.category2}
                                    onChange={(e) => {
                                        formik.handleChange(e);
                                        formik.setFieldValue("category3", "");
                                    }}
                                    onBlur={formik.handleBlur}
                                >
                                    {levelTwoCategories.length > 0 ? (
                                        levelTwoCategories.map((item) => (
                                            <MenuItem key={item.categoryId} value={item.categoryId}>
                                                {item.name}
                                            </MenuItem>
                                        ))
                                    ) : (
                                        <MenuItem disabled>No sub categories</MenuItem>
                                    )}
                                </Select>
                                {formik.touched.category2 && formik.errors.category2 && (
                                    <FormHelperText>{formik.errors.category2}</FormHelperText>
                                )}
                            </FormControl>
                        </Grid>

                        {/* Third Category */}
                        <Grid size={{ xs: 12, md: 3 }}>
                            <FormControl fullWidth
                                error={formik.touched.category3 && Boolean(formik.errors.category3)}
                            >
                                <InputLabel id="category3-label">Third Category</InputLabel>
                                <Select
                                    labelId="category3-label"
                                    name="category3"
                                    label="Third Category"
                                    value={formik.values.category3}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                >
                                    {levelThreeCategories.length > 0 ? (
                                        levelThreeCategories.map((item) => (
                                            <MenuItem key={item.categoryId} value={item.categoryId}>
                                                {item.name}
                                            </MenuItem>
                                        ))
                                    ) : (
                                        <MenuItem disabled>No sub categories</MenuItem>
                                    )}
                                </Select>
                                {formik.touched.category3 && formik.errors.category3 && (
                                    <FormHelperText>{formik.errors.category3}</FormHelperText>
                                )}
                            </FormControl>
                        </Grid>

                        {/* Submit Button */}
                        <Grid size={{ xs: 12 }}>
                            <Button
                                type="submit"
                                fullWidth
                                disabled={product.loading || formik.isSubmitting}
                                variant="contained"
                                color="primary"
                                sx={{ py: '12px' }}
                            >
                                {product.loading ? <CircularProgress size={24} color="inherit" /> : "Add Product"}                            </Button>
                        </Grid>
                    </Grid>
                    <SnackbarMessage
                        open={snackbar.open}
                        severity={snackbar.severity}
                        message={snackbar.message}
                        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
                        anchorOrigin={{ vertical: "top", horizontal: "right" }}
                    />
                </form>
            </div>
        </>
    );
};

export default AddProduct;