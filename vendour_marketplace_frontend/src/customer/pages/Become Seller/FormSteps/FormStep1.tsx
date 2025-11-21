import { Box, TextField } from "@mui/material";

const FormStep1 = ({ formik }: any) => {
    return (
        <Box>
            <div className="space-y-9">
                {/* Full Name */}
                <TextField
                    name="name"
                    label="Full Name"
                    fullWidth
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.name && Boolean(formik.errors.name)}
                    helperText={formik.touched.name && formik.errors.name}
                    sx={{marginBottom:1}}
                />

                {/* Email */}
                <TextField
                    name="email"
                    label="Email"
                    fullWidth
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                    sx={{marginBottom:1}}
                />

                {/* Mobile */}
                <TextField
                    name="mobile"
                    label="Mobile"
                    fullWidth
                    value={formik.values.mobile}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.mobile && Boolean(formik.errors.mobile)}
                    helperText={formik.touched.mobile && formik.errors.mobile}
                    sx={{marginBottom:1}}
                />

                {/* STRN */}
                <TextField
                    name="strn"
                    label="Sales Tax Registration Number"
                    fullWidth
                    value={formik.values.strn}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.strn && Boolean(formik.errors.strn)}
                    helperText={formik.touched.strn && formik.errors.strn}
                    sx={{marginBottom:1}}
                />
            </div>
        </Box>
    );
};

export default FormStep1;
