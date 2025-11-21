import { CloseRounded } from "@mui/icons-material";
import { Box, Button, Grid, IconButton, TextField, Tooltip, tooltipClasses, Zoom } from "@mui/material";
import { useFormik } from "formik"
import * as Yup from "yup"
import type { Address } from "../../../types/seller";



interface AddressFormProps {
    onClose: () => void;
    onSave: (address: Address) => void;
}

const AddressFormSchema = Yup.object().shape({
    name: Yup.string()
        .required('Name is required')
        .matches(/^[^\d][a-zA-Z\s]*$/, 'Name should not start with a number'),

    mobile: Yup.string()
        .required('Mobile number is required')
        .matches(/^03[0-9]{9}$/, 'Enter a valid Pakistani mobile number (e.g. 03XXXXXXXXX)'),

    pinCode: Yup.string()
        .required('Pin code is required')
        .matches(/^\d{5}$/, 'Pin code must be 5 digits'),

    address: Yup.string()
        .required("Address is required")
        .matches(
            /^(?!0x[a-fA-F0-9]{40}$).*$/,
            "Address must not be a crypto wallet or hex string"
        ),


    city: Yup.string()
        .required('City is required'),

    state: Yup.string()
        .required('State is required'),

    locality: Yup.string().required("Locality (e.g., Colony, Block, Society) is required"),
});
const AddressForm = ({ onClose, onSave }: AddressFormProps) => {




    const formik = useFormik({
        initialValues: {
            name: "",
            mobile: "",
            pinCode: "",
            address: "",
            city: "",
            state: "",
            locality: ""
        },
        validationSchema: AddressFormSchema,
        onSubmit: (values) => {

            // now updating just local redux state state
            console.log("Values: ", values);
            onSave(values as Address); // update parent list
            onClose();

        },
    })



    return (
        <>
            <Box sx={{ maxHeight: "auto" }}>
                <p className="text-xl font-bold text-primary-color text-start relative pb-5">Contact Details</p>


                {/* Form fill Section */}
                <form onSubmit={formik.handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12 }} >
                            <TextField
                                name="name"
                                onChange={formik.handleChange}
                                value={formik.values.name}
                                label="Name"
                                fullWidth
                                error={formik.touched.name && Boolean(formik.errors.name)}
                                helperText={formik.touched.name && formik.errors.name}
                                sx={{
                                    '& .MuiFormHelperText-root': {
                                        marginTop: '4px',
                                        marginLeft: '0px',
                                    },
                                }}
                            />
                        </Grid>
                        <Grid size={{ xs: 6 }} >
                            <TextField
                                name="mobile"
                                onChange={formik.handleChange}
                                value={formik.values.mobile}
                                label="Contact No."
                                fullWidth
                                error={formik.touched.mobile && Boolean(formik.errors.mobile)}
                                helperText={formik.touched.mobile && formik.errors.mobile}
                                sx={{
                                    '& .MuiFormHelperText-root': {
                                        marginTop: '4px',
                                        marginLeft: '0px',
                                    },
                                }}
                            />
                        </Grid>
                        <Grid size={{ xs: 6 }} >
                            <TextField
                                name="pinCode"
                                onChange={formik.handleChange}
                                value={formik.values.pinCode}
                                label="Pin Code"
                                fullWidth
                                error={formik.touched.pinCode && Boolean(formik.errors.pinCode)}
                                helperText={formik.touched.pinCode && formik.errors.pinCode}
                                sx={{
                                    '& .MuiFormHelperText-root': {
                                        marginTop: '4px',
                                        marginLeft: '0px',
                                    },
                                }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }} >
                            <TextField
                                name="address"
                                onChange={formik.handleChange}
                                fullWidth
                                value={formik.values.address}
                                label="Current Address"
                                error={formik.touched.address && Boolean(formik.errors.address)}
                                helperText={formik.touched.address && formik.errors.address}
                            />
                        </Grid>
                        <Grid size={{ xs: 6 }} >
                            <TextField
                                name="city"
                                onChange={formik.handleChange}
                                value={formik.values.city}
                                label="City"
                                error={formik.touched.city && Boolean(formik.errors.city)}
                                helperText={formik.touched.city && formik.errors.city}
                            />
                        </Grid>
                        <Grid size={{ xs: 6 }} >

                            <TextField
                                name="state"
                                onChange={formik.handleChange}
                                value={formik.values.state}
                                label="State"
                                fullWidth
                                error={formik.touched.state && Boolean(formik.errors.state)}
                                helperText={formik.touched.state && formik.errors.state}
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                name="locality"
                                onChange={formik.handleChange}
                                value={formik.values.locality}
                                label="Locality"
                                fullWidth
                                error={formik.touched.locality && Boolean(formik.errors.locality)}
                                helperText={formik.touched.locality && formik.errors.locality}
                            />
                        </Grid>


                        {/* Submit Form */}
                        <Grid size={{ xs: 12 }}>
                            <Button type="submit" variant="contained" fullWidth sx={{ py: "14px" }}>Add Address</Button>
                        </Grid>
                    </Grid>
                </form>

                {/* Form Close Icon */}
                <div className="absolute top-7 right-1 px-7">
                    <Tooltip title="Click to close" arrow
                        slots={{
                            transition: Zoom,
                        }}
                        slotProps={{
                            popper: {
                                sx: {
                                    [`&.${tooltipClasses.popper}[data-popper-placement*="bottom"] .${tooltipClasses.tooltip}`]:
                                    {
                                        marginTop: '0px',
                                    },
                                    [`&.${tooltipClasses.popper}[data-popper-placement*="top"] .${tooltipClasses.tooltip}`]:
                                    {
                                        marginBottom: '0px',
                                    },
                                    [`&.${tooltipClasses.popper}[data-popper-placement*="right"] .${tooltipClasses.tooltip}`]:
                                    {
                                        marginLeft: '0px',
                                    },
                                    [`&.${tooltipClasses.popper}[data-popper-placement*="left"] .${tooltipClasses.tooltip}`]:
                                    {
                                        marginRight: '0px',
                                    },
                                },
                            },
                        }}>
                        <IconButton onClick={onClose} sx={{ paddingBottom: "5px" }}>
                            <CloseRounded />
                        </IconButton>
                    </Tooltip>
                </div>
            </Box>
        </>
    );
};

export default AddressForm;