import React, { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  MenuItem,
  Select,
  Typography,
  FormControl,
  InputLabel,
} from "@mui/material";
import { CloseRounded, DeleteOutline, CloudUpload } from "@mui/icons-material";
import { useFormik } from "formik";
import * as Yup from "yup";
import type { SnackbarProps } from "../../../types/props";
import { useAppDispatch } from "../../../redux/store";
import type { HomeCategoryRequest } from "../../../types/homeCategory";
import { addToHomeCategory } from "../../../redux/slice/admin/adminHomePageCustomizationSlice";
import { uploadToCloudinary } from "../../../util/uploadToCloudinary";
import { menLevelThree } from "../../../data/category/level three/menLevelThree";
import { womenLevelThree } from "../../../data/category/level three/womenLevelThree";
import { homeFurnitureLevelThree } from "../../../data/category/level three/homeFurnitureLevelThree";
import { electronicsLevelThree } from "../../../data/category/level three/electronicsLevelThree";

interface CreateHomeCategoryModalProps {
  onClose: () => void;
  setSnackbar: (snackbar: SnackbarProps) => void;
}

const CreateHomeCategoryModal: React.FC<CreateHomeCategoryModalProps> = ({
  onClose,
  setSnackbar,
}) => {
  const dispatch = useAppDispatch();
  const [uploading, setUploading] = useState(false);
  const [section, setSection] = useState<string>("ELECTRONICS_CATEGORIES");

  const formik = useFormik<HomeCategoryRequest>({
    initialValues: {
      image: "",
      categoryId: "",
      name: "",
      homeCategorySection: "ELECTRONICS_CATEGORIES",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      image: Yup.string().required("Image is required"),
      categoryId: Yup.string().required("Category ID is required"),
      homeCategorySection: Yup.string().required("Section is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      formik.setTouched({
        image: true,
        categoryId: true,
        name: true,
        homeCategorySection: true,
      });

      const result = await dispatch(
        addToHomeCategory({ homeCategoryRequest: values })
      );

      if (addToHomeCategory.fulfilled.match(result)) {
        setSnackbar({
          open: true,
          message: "Category created successfully!",
          severity: "success",
        });
        resetForm();
        onClose();
      } else {
        setSnackbar({
          open: true,
          message:
            (result.payload as string) ||
            "Unable to create category. Please try again.",
          severity: "error",
        });
      }
    },
  });

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
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
    } catch (error: any) {
      console.error("Upload error:", error);
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

  // Dynamic category options
  const all =
    section === "ELECTRONICS_CATEGORIES"
      ? electronicsLevelThree
      : section === "SHOP_BY_CATEGORIES"
        ? [
          ...menLevelThree,
          ...womenLevelThree,
          ...homeFurnitureLevelThree,
          ...electronicsLevelThree,
        ]
        : section === "GRID"
          ? [...menLevelThree, ...womenLevelThree]
          : section === "DEALS"
            ? electronicsLevelThree
            : [];

  return (
    <div className="flex items-center justify-center">
      <div className="rounded-2xl w-full max-w-md p-6 relative transition-all duration-300">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <Typography variant="h6" color="primary" className="font-semibold">
            Add Home Category
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
              <Box className="relative transition-all duration-300">
                <img
                  src={formik.values.image}
                  alt="Category"
                  className="w-32 h-32 object-cover rounded-xl border border-gray-200 shadow-sm transition-opacity duration-500 opacity-0"
                  onLoad={(e) => (e.currentTarget.style.opacity = "1")}
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

            {/* Show image error */}
            {formik.touched.image && formik.errors.image && (
              <Typography color="error" variant="body2" className="text-sm mt-1">
                {formik.errors.image}
              </Typography>
            )}
          </Box>

          {/* Section Selector */}
          <FormControl fullWidth sx={{ marginBottom: 2 }}>
            <InputLabel id="section-label">Select Section</InputLabel>
            <Select
              labelId="section-label"
              label="Select Section"
              value={section}
              onChange={(e) => {
                const sec = e.target.value as string;
                setSection(sec);
                formik.setFieldValue("homeCategorySection", sec);
                formik.setFieldValue("categoryId", "");
                formik.setFieldValue("name", "");
              }}
              disabled={uploading}
            >
              <MenuItem value="ELECTRONICS_CATEGORIES">
                Electronics Categories
              </MenuItem>
              <MenuItem value="GRID">Grid</MenuItem>
              <MenuItem value="SHOP_BY_CATEGORIES">Shop By Categories</MenuItem>
              <MenuItem value="DEALS">Deals</MenuItem>
            </Select>
          </FormControl>

          {/* Category Dropdown */}
          <FormControl fullWidth>
            <InputLabel id="category-label">Select Category</InputLabel>
            <Select
              labelId="category-label"
              label="Select Category"
              value={formik.values.categoryId}
              onChange={(e) => {
                const selected = all.find(
                  (c) => c.categoryId === e.target.value
                );
                formik.setFieldValue("categoryId", e.target.value);
                formik.setFieldValue("name", selected?.name || "");
              }}
              disabled={uploading}
            >
              <MenuItem value="" disabled>
                Select Category
              </MenuItem>
              {all.map((item) => (
                <MenuItem key={item.categoryId} value={item.categoryId}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
            {formik.touched.categoryId && formik.errors.categoryId && (
              <Typography
                color="error"
                variant="body2"
                className="text-sm mt-1"
              >
                {formik.errors.categoryId}
              </Typography>
            )}
          </FormControl>

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
              {formik.isSubmitting ? "Adding..." : "Add"}
            </Button>
          </Box>
        </form>
      </div>
    </div>
  );
};

export default CreateHomeCategoryModal;
