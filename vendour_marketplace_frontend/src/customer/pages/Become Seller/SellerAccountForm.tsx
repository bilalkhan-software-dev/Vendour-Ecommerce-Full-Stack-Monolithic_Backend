import {
    Button,
    CircularProgress,
    IconButton,
    Step,
    StepLabel,
    Stepper,
    Tooltip,
    Zoom,
} from "@mui/material";
import { useState } from "react";
import { formBecomeSellerSteps } from "../../../data/account/customerAccount";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { useFormik, getIn } from "formik";
import * as Yup from "yup";
import FormStep1 from "./FormSteps/FormStep1";
import FormStep2 from "./FormSteps/FormStep2";
import FormStep3 from "./FormSteps/FormStep3";
import FormStep4 from "./FormSteps/FormStep4";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import { sellerSignup } from "../../../redux/slice/seller/sellerAuthSlice";
import type { SnackbarProps } from "../../../types/props";
import SnackbarMessage from "../../../component/SnackbarMessage/SnackbarMessage";
import type { FormValues } from "../../../types/seller";
import { useNavigate } from "react-router-dom";



// ✅ Validation Schema (Pakistani formats included)
const validationSchema = Yup.object({
    name: Yup.string()
        .required("Full name is required")
        .min(3, "Name must be at least 3 characters long"),
    mobile: Yup.string()
        .matches(/^03[0-9]{9}$/, "Enter a valid Pakistani mobile number (e.g. 03XXXXXXXXX)")
        .required("Mobile number is required"),
    email: Yup.string().email("Invalid email format").required("Email is required"),
    strn: Yup.string()
        .matches(/^[0-9]{13}$/, "Invalid STRN — must be 13 digits")
        .required("Sales Tax Registration Number (STRN) is required"),
    bankDetails: Yup.object({
        accountNumber: Yup.string()
            .required("Bank account number is required")
            .matches(/^[0-9]{10,16}$/, "Enter a valid account number (10–16 digits)"),
        bankName: Yup.string().required("Bank name is required"),
        accountHolderName: Yup.string().required("Account holder name is required"),
        iban: Yup.string()
            .matches(/^PK\d{2}[A-Z0-9]{20}$/, "Invalid Pakistani IBAN (e.g. PK36SCBL0000001123456702)")
            .required("IBAN is required")

    }),
    businessDetails: Yup.object({
        businessName: Yup.string().required("Business name is required"),
        businessAddress: Yup.string().required("Business address is required"),
        businessMobileNumber: Yup.string()
            .matches(/^03[0-9]{9}$/, "Invalid Pakistani mobile number")
            .required("Business mobile number is required"),
        businessEmail: Yup.string()
            .email("Invalid business email")
            .required("Business email is required"),
        // banner: Yup.string().url("Invalid banner URL").nullable(),
        // logo: Yup.string().url("Invalid logo URL").nullable(),
    }),
    pickupAddress: Yup.object({
        name: Yup.string().required("Pickup name is required"),
        locality: Yup.string().required("Locality is required"),
        city: Yup.string().required("City is required"),
        state: Yup.string().required("State is required"),
        pinCode: Yup.string()
            .matches(/^[0-9]{5}$/, "Invalid postal code (must be 5 digits)")
            .required("Postal code is required"),
        mobile: Yup.string()
            .matches(/^03[0-9]{9}$/, "Invalid Pakistani mobile number")
            .required("Pickup mobile number is required"),
        address: Yup.string().required("Address is required"),
    }),
});

const stepFields = [
    ["name", "email", "mobile", "strn"], // Step 1
    ["bankDetails.accountNumber", "bankDetails.bankName", "bankDetails.accountHolderName", "bankDetails.iban"], // Step 2
    ["businessDetails.businessName", "businessDetails.businessAddress", "businessDetails.businessMobileNumber", "businessDetails.businessEmail", "businessDetails.banner", "businessDetails.logo"], // Step 3
    ["pickupAddress.name", "pickupAddress.locality", "pickupAddress.city", "pickupAddress.state", "pickupAddress.pinCode", "pickupAddress.mobile", "pickupAddress.address"], // Step 4
];

const SellerAccountForm = () => {
    const [activeStep, setActiveStep] = useState<number>(0);
    const dispatch = useAppDispatch();
    const sellerAuth = useAppSelector((store) => store.sellerAuth);
    const navigate = useNavigate();
    const [snackbar, setSnackbar] = useState<SnackbarProps>({
        open: false,
        message: "",
        severity: "success",
    });

    const formik = useFormik<FormValues>({
        initialValues: {
            name: "",
            mobile: "",
            email: "",
            otp: "222222",
            strn: "",
            bankDetails: {
                accountNumber: "",
                bankName: "",
                accountHolderName: "",
                iban: "",
            },
            businessDetails: {
                businessName: "",
                businessAddress: "",
                businessMobileNumber: "",
                businessEmail: "",
                banner: "",
                logo: "",
            },
            pickupAddress: {
                name: "",
                locality: "",
                city: "",
                state: "",
                pinCode: "",
                mobile: "",
                address: "",
            },
        },
        validationSchema,
        validateOnChange: true,
        validateOnBlur: true,
        onSubmit: (values) => console.log("Form submitted:", values),
    });

    const handleFormSteps = async (direction: number) => {
        const lastStep = formBecomeSellerSteps.length - 1;

        if (direction === 1 && activeStep < lastStep) {
            const fieldsToValidate = stepFields[activeStep];

            // Mark fields as touched to show errors
            fieldsToValidate.forEach((field) => {
                formik.setFieldTouched(field, true, false);
            });

            // Validate current step fields only
            const errors = await formik.validateForm();
            const stepHasErrors = fieldsToValidate.some(
                (field) => getIn(errors, field)
            );

            console.log("Validating step:", activeStep + 1);
            console.log("Fields to validate:", fieldsToValidate);
            console.log("Step errors:", stepHasErrors);
            console.log("All errors:", errors);

            if (!stepHasErrors) {
                setActiveStep(activeStep + 1);
            } else {
                setSnackbar({
                    open: true,
                    message: "Please fix the errors before continuing.",
                    severity: "error",
                });
            }
        } else if (direction === -1 && activeStep > 0) {
            setActiveStep(activeStep - 1);
        } else if (activeStep === lastStep && direction === 1) {
            handleCreateAccount();
        }
    };
    const handleCreateAccount = async () => {

        const result = await dispatch(sellerSignup(formik.values));
        if (sellerSignup.fulfilled.match(result)) {
            setSnackbar({
                open: true,
                message:
                    "Account created successfully. Verification email sent. Please verify your email to activate seller account.",
                severity: "success",
            });
            formik.resetForm();
            setTimeout(()=>{
                navigate("/become-seller")
            })
        } else if (sellerSignup.rejected.match(result)) {
            setSnackbar({
                open: true,
                message:
                    result.payload,
                severity: "error",
            });
        }
    };

    return (
        <>
            <div>
                <Stepper activeStep={activeStep} alternativeLabel>
                    {formBecomeSellerSteps.map((item) => (
                        <Step key={item.id}>
                            <StepLabel>{item.name}</StepLabel>
                        </Step>
                    ))}
                </Stepper>

                <section className="mt-10 space-y-10">
                    <form onSubmit={formik.handleSubmit}>
                        <div>
                            {activeStep === 0 && <FormStep1 formik={formik} />}
                            {activeStep === 1 && <FormStep3 formik={formik} />}
                            {activeStep === 2 && <FormStep4 formik={formik} />}
                            {activeStep === 3 && <FormStep2 formik={formik} />}
                        </div>

                        <div className="flex justify-between items-center">
                            <IconButton
                                onClick={() => handleFormSteps(-1)}
                                disabled={activeStep === 0}
                            >
                                <Tooltip title="Back to previous" slots={{ transition: Zoom }}>
                                    <ArrowBackRoundedIcon
                                        className={`${activeStep !== 0 ? "text-gray-800" : ""}`}
                                    />
                                </Tooltip>
                            </IconButton>

                            <Button
                                onClick={() => handleFormSteps(1)}
                                variant="contained"
                                size="small"
                                disabled={sellerAuth.loading}
                                startIcon={
                                    sellerAuth.loading ? (
                                        <CircularProgress size={16} color="inherit" />
                                    ) : null
                                }
                            >
                                {activeStep === formBecomeSellerSteps.length - 1
                                    ? sellerAuth.loading
                                        ? "Creating..."
                                        : "Create Account"
                                    : "Continue"}
                            </Button>
                        </div>
                    </form>
                </section>
            </div>

            <SnackbarMessage
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            />
        </>
    );
};

export default SellerAccountForm;
