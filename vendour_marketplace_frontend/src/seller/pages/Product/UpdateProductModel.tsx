import {
    AddPhotoAlternateRounded,
    CloseRounded
} from "@mui/icons-material";
import {
    Button,
    CircularProgress,
    FormControl,
    FormHelperText,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    TextField
} from "@mui/material";
import { useFormik } from "formik";
import { useState } from "react";
import * as Yup from "yup";

import { uploadToCloudinary } from "../../../util/uploadToCloudinary";
import { colors } from "../../../data/filter/colors";
import { updateProduct } from "../../../redux/slice/seller/sellerProductSlice";
import SnackbarMessage from "../../../component/SnackbarMessage/SnackbarMessage";
import { useAppDispatch, useAppSelector } from "../../../redux/store";

import type { SnackbarProps } from "../../../types/props";
import type {
    ProductRequest,
    ProductResponse
} from "../../../types/product";

interface UpdateProductModelProps {
    onClose: () => void;
    productUpdate: ProductResponse;
}


const UpdateProductModel = ({ onClose, productUpdate }: UpdateProductModelProps) => {
    const [uploadImage, setUploadImage] = useState(false);
    const [snackbar, setSnackbar] = useState<SnackbarProps>({
        open: false,
        message: "",
        severity: "success",
    });

    const dispatch = useAppDispatch();
    const product = useAppSelector(store => store.sellerProduct);


    const validationSchema = Yup.object({
        title: Yup.string().required("Title is required").min(3),
        description: Yup.string().required("Description is required").min(10).max(500),
        images: Yup.array().of(Yup.string().url()).min(1, "At least one image is required"),
        mrpPrice: Yup.number().required().min(1),
        sellingPrice: Yup.number().required().min(1).max(Yup.ref("mrpPrice"), "Cannot exceed MRP"),
        color: Yup.string().required(),
        sizes: Yup.string().required(),
        stocks: Yup.number().required().min(1),
    });

    const formik = useFormik<ProductRequest>({
        initialValues: {
            images: productUpdate.images || [],
            title: productUpdate.title || '',
            description: productUpdate.description || '',
            color: productUpdate.color || '',
            stocks: productUpdate.stocks || 0,
            category1: '',
            category2: '',
            category3: '',
            sizes: productUpdate.sizes || '',
            sellingPrice: productUpdate.sellingPrice || 0,
            mrpPrice: productUpdate.mrpPrice || 0,
        },
        validationSchema,
        onSubmit: async (values) => {
            console.log('updating product request :', values);

            const result = await dispatch(updateProduct({ productId: productUpdate.id ?? 0, request: values }));
            if (updateProduct.fulfilled.match(result)) {
                setSnackbar({ open: true, message: "Product updated successfully.", severity: "success" });
                setTimeout(() => {
                    onClose();
                }, 1500);
            } else {
                setSnackbar({
                    open: true,
                    message: result.payload || "Unable to update product.",
                    severity: "error"
                });
            }
        },
    });


    const handleImageChange = async (event: any) => {
        const file = event.target.files?.[0];
        if (!file) return;
        setUploadImage(true);
        const image = await uploadToCloudinary(file, "image");
        formik.setFieldValue("images", [...formik.values.images, image]);
        setUploadImage(false);
    };

    const handleRemoveImage = (index: number) => {
        const updated = [...formik.values.images];
        updated.splice(index, 1);
        formik.setFieldValue("images", updated);
    };


    return (
        <div>
            <p className="text-xl font-bold text-primary-color pb-5">Edit Product</p>
            <form onSubmit={formik.handleSubmit} className="space-y-6 p-6">
                <Grid container spacing={2}>
                    {/* Upload image */}
                    <Grid size={{ xs: 12 }}>
                        <input type="file" accept="image/*" id="image-input" style={{ display: "none" }} onChange={handleImageChange} />
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
                        {formik.touched.images && formik.errors.images && (
                            <p className="text-red-600 text-sm mt-1">{formik.errors.images}</p>
                        )}
                        <div className="flex flex-wrap gap-2 mt-2">
                            {formik.values.images.map((image, index) => (
                                <div key={index} className="relative w-24 h-24">
                                    <img src={image} alt="" className="w-24 h-24 object-cover rounded-md border" />
                                    <IconButton
                                        onClick={() => handleRemoveImage(index)}
                                        size="small"
                                        color="error"
                                        sx={{ position: "absolute", top: 2, right: 2, backgroundColor: "white" }}
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
                            label="Title"
                            fullWidth
                            onChange={formik.handleChange}
                            value={formik.values.title}
                            error={formik.touched.title && Boolean(formik.errors.title)}
                            helperText={formik.touched.title && formik.errors.title}
                        />
                    </Grid>

                    {/* Description */}
                    <Grid size={{ xs: 12 }}>
                        <TextField
                            name="description"
                            label="Description"
                            multiline
                            rows={3}
                            fullWidth
                            onChange={formik.handleChange}
                            value={formik.values.description}
                            error={formik.touched.description && Boolean(formik.errors.description)}
                            helperText={formik.touched.description && formik.errors.description}
                        />
                    </Grid>

                    {/* Prices, Color, Size */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            name="mrpPrice"
                            label="MRP"
                            fullWidth
                            onChange={formik.handleChange}
                            value={formik.values.mrpPrice}
                            error={formik.touched.mrpPrice && Boolean(formik.errors.mrpPrice)}
                            helperText={formik.touched.mrpPrice && formik.errors.mrpPrice}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            name="sellingPrice"
                            label="Selling Price"
                            fullWidth
                            onChange={formik.handleChange}
                            value={formik.values.sellingPrice}
                            error={formik.touched.sellingPrice && Boolean(formik.errors.sellingPrice)}
                            helperText={formik.touched.sellingPrice && formik.errors.sellingPrice}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <FormControl fullWidth error={formik.touched.color && Boolean(formik.errors.color)}>
                            <InputLabel id="color-label">Color</InputLabel>
                            <Select
                                labelId="color-label"
                                name="color"
                                value={formik.values.color}
                                onChange={formik.handleChange}
                                label="Color"
                            >
                                <MenuItem value=""><em>None</em></MenuItem>
                                {colors.map((color, i) => (
                                    <MenuItem value={color.name} key={i}>
                                        <div className="flex gap-3 items-center">
                                            <span
                                                className="w-5 h-5 rounded-full border"
                                                style={{ backgroundColor: color.hex }}
                                            />
                                            {color.name}
                                        </div>
                                    </MenuItem>
                                ))}
                            </Select>
                            <FormHelperText>{formik.errors.color}</FormHelperText>
                        </FormControl>
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            name="stocks"
                            label="Stocks"
                            fullWidth
                            type="number"
                            onChange={formik.handleChange}
                            value={formik.values.stocks}
                            error={formik.touched.stocks && Boolean(formik.errors.stocks)}
                            helperText={formik.touched.stocks && formik.errors.stocks}
                        />
                    </Grid>

                    {/* Sizes */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <FormControl fullWidth error={formik.touched.sizes && Boolean(formik.errors.sizes)}>
                            <InputLabel id="sizes-label">Sizes</InputLabel>
                            <Select
                                labelId="sizes-label"
                                name="sizes"
                                value={formik.values.sizes}
                                onChange={formik.handleChange}
                                label="Sizes"
                            >
                                <MenuItem value=""><em>None</em></MenuItem>
                                <MenuItem value="xxl">XXL</MenuItem>
                                <MenuItem value="xl">XL</MenuItem>
                                <MenuItem value="lg">LG</MenuItem>
                                <MenuItem value="md">MD</MenuItem>
                                <MenuItem value="sm">SM</MenuItem>
                                <MenuItem value="xs">XS</MenuItem>
                            </Select>
                            <FormHelperText>{formik.errors.sizes}</FormHelperText>
                        </FormControl>
                    </Grid>

                    {/* Submit Button */}
                    <Grid size={{ xs: 12 }}>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            disabled={product.loading || formik.isSubmitting}
                        >
                            {product.loading ? <CircularProgress size={24} /> : "Update Product"}
                        </Button>
                    </Grid>
                </Grid>

                {/* Close Button */}
                <div className="absolute top-7 right-1 px-7">
                    <IconButton onClick={onClose}>
                        <CloseRounded sx={{
                            transition: 'all 0.25s ease',
                            '&:hover': { transform: 'rotate(90deg)' }
                        }} />
                    </IconButton>
                </div>

                {/* Snackbar */}
                <SnackbarMessage
                    open={snackbar.open}
                    severity={snackbar.severity}
                    message={snackbar.message}
                    onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
                />
            </form>
        </div>
    );
};

export default UpdateProductModel;
