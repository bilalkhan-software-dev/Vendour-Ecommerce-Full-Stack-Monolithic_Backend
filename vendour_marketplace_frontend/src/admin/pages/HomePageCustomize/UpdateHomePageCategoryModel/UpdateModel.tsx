import React, { useState } from "react";
import { useAppDispatch } from "../../../../redux/store";
import type { HomeCategoryResponse } from "../../../../types/homeCategory";
import { useFormik } from "formik";
import { updateHomeCategories } from "../../../../redux/slice/admin/adminHomePageCustomizationSlice";
import type { SnackbarProps } from "../../../../types/props";
import {
    IconButton,
    CircularProgress,
    Button,
    Box,
    Typography,
    Select,
    MenuItem,
} from "@mui/material";
import { CloseRounded, DeleteOutline, CloudUpload } from "@mui/icons-material";
import { uploadToCloudinary } from "../../../../util/uploadToCloudinary";

// Category Data
import { menLevelThree } from "../../../../data/category/level three/menLevelThree";
import { womenLevelThree } from "../../../../data/category/level three/womenLevelThree";
import { electronicsLevelThree } from "../../../../data/category/level three/electronicsLevelThree";
import { homeFurnitureLevelThree } from "../../../../data/category/level three/homeFurnitureLevelThree";
import { fetchAllHomePageData } from "../../../../redux/slice/admin/adminHomePageCustomizationSlice";

interface UpdateModelProps {
    category: HomeCategoryResponse;
    onClose: () => void;
    setSnackbar: (snackbar: SnackbarProps) => void;
}

const UpdateModel: React.FC<UpdateModelProps> = ({
    category,
    onClose,
    setSnackbar,
}) => {
    const dispatch = useAppDispatch();
    const [uploading, setUploading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const formik = useFormik({
        initialValues: {
            image: category?.image || "",
            categoryId: category.categoryId || "",
            name: category.name || "",
        },
        onSubmit: async (values) => {
            console.log('values: ', values);
            const result = await dispatch(
                updateHomeCategories({
                    homeCategoryId: category?.id,
                    homeCategoryRequest: values,
                })
            );

            if (updateHomeCategories.fulfilled.match(result)) {
                setSnackbar({
                    open: true,
                    message: "Category updated successfully",
                    severity: "success",
                });
                dispatch(fetchAllHomePageData());
                onClose();
            } else {
                setSnackbar({
                    open: true,
                    message:
                        (result.payload as string) ||
                        "Unable to update. Please try again later!",
                    severity: "error",
                });
            }
        },
    });

    const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        setUploading(true);
        try {
            const imageUrl = await uploadToCloudinary(file, "image");
            formik.setFieldValue("image", imageUrl);
            setSnackbar({
                open: true,
                message: "Image uploaded successfully!",
                severity: "success",
            });
        } catch {
            setSnackbar({
                open: true,
                message: "Image upload failed. Please try again.",
                severity: "error",
            });
        } finally {
            setUploading(false);
        }
    };

    const handleRemoveImage = () => formik.setFieldValue("image", "");
    const handleEditCategory = () => setIsEditing(true);

    const section = category.homeCategorySection;
    const all =
        section === "ELECTRONICS_CATEGORIES"
            ? electronicsLevelThree
            : ["DEALS", "SHOP_BY_CATEGORIES", "GRID"].includes(section)
                ? [
                    ...menLevelThree,
                    ...womenLevelThree,
                    ...homeFurnitureLevelThree,
                    ...electronicsLevelThree,
                ]
                : [];

    return (
        <div className="bg-black/40 flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6 relative">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <Typography variant="h6" color="primary" className="font-semibold">
                        Update Category
                    </Typography>
                    <IconButton onClick={onClose} size="small">
                        <CloseRounded />
                    </IconButton>
                </div>

                {/* Form */}
                <form onSubmit={formik.handleSubmit} className="space-y-4">
                    {/* Image Upload */}
                    <Box className="flex flex-col items-center gap-4 mt-2">
                        {formik.values.image ? (
                            <Box className="relative">
                                <img
                                    src={formik.values.image}
                                    alt="Category"
                                    className="w-32 h-32 object-cover rounded-xl border border-gray-200 shadow-sm"
                                />
                                <IconButton
                                    onClick={handleRemoveImage}
                                    size="small"
                                    sx={{
                                        position: "absolute",
                                        top: -10,
                                        right: -10,
                                        bgcolor: "white",
                                        boxShadow: 1,
                                    }}
                                >
                                    <DeleteOutline fontSize="small" />
                                </IconButton>
                            </Box>
                        ) : (
                            <Button
                                variant="outlined"
                                component="label"
                                startIcon={<CloudUpload />}
                                disabled={uploading}
                            >
                                {uploading ? "Uploading..." : "Upload Image"}
                                <input
                                    hidden
                                    accept="image/*"
                                    type="file"
                                    onChange={handleImageChange}
                                />
                            </Button>
                        )}

                        {/* Info */}
                        <Typography>ID: {category.categoryId || "—"}</Typography>
                        <Typography>Name: {category.name || "—"}</Typography>
                        <Typography>Section: {category.homeCategorySection || "—"}</Typography>

                        {/* Edit Category */}
                        {!isEditing && (
                            <Button onClick={handleEditCategory}>
                                Edit Category
                            </Button>
                        )}

                        {/* Category Selector */}
                        {isEditing && (
                            <Select
                                fullWidth
                                value={formik.values.categoryId}
                                onChange={(e) => {
                                    const selected = all.find(
                                        (c) => c.categoryId === e.target.value
                                    );
                                    formik.setFieldValue("categoryId", e.target.value);
                                    formik.setFieldValue("name", selected?.name || "");
                                }}
                                displayEmpty
                            >
                                <MenuItem value="" disabled>
                                    Select Category
                                </MenuItem>
                                {all.map((item) => (
                                    <MenuItem
                                        key={item.parentCategoryId}
                                        value={item.categoryId}
                                    >
                                        {item.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        )}
                    </Box>

                    {/* Action Buttons */}
                    <Box className="flex justify-end gap-3 mt-6">
                        <Button variant="outlined" color="inherit" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            disabled={formik.isSubmitting || uploading}
                            startIcon={
                                formik.isSubmitting ? (
                                    <CircularProgress size={18} color="inherit" />
                                ) : undefined
                            }
                        >
                            {formik.isSubmitting ? "Updating..." : "Update"}
                        </Button>
                    </Box>
                </form>
            </div>
        </div>
    );
};

export default UpdateModel;
