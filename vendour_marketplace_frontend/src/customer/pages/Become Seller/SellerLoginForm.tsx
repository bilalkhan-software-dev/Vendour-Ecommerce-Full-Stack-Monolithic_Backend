import { Box, Button, CircularProgress, TextField } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import { sentSigninUpOtp } from "../../../redux/slice/authSlice";
import { useRef, useState } from "react";
import { sellerLogin } from "../../../redux/slice/seller/sellerAuthSlice";
import type { SnackbarProps } from "../../../types/props";
import SnackbarMessage from "../../../component/SnackbarMessage/SnackbarMessage";
import { useNavigate } from "react-router-dom";

const SellerLoginForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const auth = useAppSelector(store => store.auth);
  const sellerAuth = useAppSelector(store => store.sellerAuth);
  const [snackbar, setSnackbar] = useState<SnackbarProps>({
    open: false,
    message: "",
    severity: "success",
  });

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    otp: Yup.string()
      .matches(/^[0-9]{6}$/, "OTP must be exactly 6 digits")
      .required("OTP is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      otp: "",
    },
    validationSchema,
    onSubmit: async (values) => {

      console.log("Login seller form submitted: ", values);
      const result = await dispatch(sellerLogin(values))
      if (sellerLogin.fulfilled.match(result)) {
        setSnackbar({
          open: true,
          message: "Login successfully!",
          severity: "success",
        });
        setTimeout(() => {
          navigate("/seller/")
        }, 3000);
      } else if (sellerLogin.rejected.match(result)) {
        setSnackbar({
          open: true,
          message: result.payload || "Login failed. Please try again",
          severity: "error",
        });
      }
    },
  });

  const handleSendOtp = async () => {
    const result = await dispatch(sentSigninUpOtp({ email: formik.values.email, role: "ROLE_SELLER" }));

    if (sentSigninUpOtp.rejected.match(result)) {
      setSnackbar({
        open: true,
        message: result.payload || "Unable to send otp. Please try again",
        severity: "error",
      });
    }

  };

  // Refs for each OTP box
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Handle OTP box input
  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const { value } = e.target;

    if (/^[0-9]?$/.test(value)) {
      const otpArray = formik.values.otp.split("");
      otpArray[index] = value;
      const newOtp = otpArray.join("");
      formik.setFieldValue("otp", newOtp);

      // auto focus next box
      if (value && otpRefs.current[index + 1]) {
        otpRefs.current[index + 1]?.focus();
      }
    }
  };

  // Handle backspace focus
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !formik.values.otp[index] && otpRefs.current[index - 1]) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  return (
    <Box>
      <p className="text-xl font-bold text-center pb-9 text-primary-color">
        Login As Seller
      </p>
      <form onSubmit={formik.handleSubmit}>
        <div className="space-y-9">
          {/* Email */}
          <TextField
            name="email"
            type="email"
            onChange={formik.handleChange}
            value={formik.values.email}
            label="Enter Email"
            disabled={auth.isOtpSent}
            fullWidth
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />

          {/* OTP input boxes */}
          {auth.isOtpSent && (
            <div className="space-y-2 mt-3">
              <p className="font-medium text-sm opacity-60">
                Enter the OTP sent to your email
              </p>
              <Box display="flex" gap={2} justifyContent="center">
                {Array.from({ length: 6 }).map((_, index) => (
                  <TextField
                    key={index}
                    inputRef={(el) => (otpRefs.current[index] = el)}
                    inputProps={{
                      maxLength: 1,
                      style: { textAlign: "center", fontSize: "20px" },
                    }}
                    sx={{ width: 80 }}
                    value={formik.values.otp[index] || ""}
                    onChange={(e) => handleOtpChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                  />
                ))}
              </Box>
              {formik.touched.otp && formik.errors.otp && (
                <p className="text-red-600 text-sm text-center">
                  {formik.errors.otp}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Buttons */}
        {!auth.isOtpSent && (
          <Button
            fullWidth
            onClick={handleSendOtp}
            disabled={auth.loading || formik.isSubmitting}
            variant="contained"
            sx={{ mt: 2, py: "11px", color: "white" }}
          >
            {auth.loading ? <CircularProgress size={24} color="inherit" /> : 'Send OTP'}
          </Button>
        )}


        {auth.isOtpSent &&
          (<Button
            type="submit"
            fullWidth
            disabled={sellerAuth.loading || formik.isSubmitting || !formik.isValid}
            variant="contained"
            sx={{ mt: 2, py: "11px", color: "white" }}
          >
            {sellerAuth.loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
          </Button>)
        }

      </form>
      <SnackbarMessage
        message={snackbar.message}
        open={snackbar.open}
        severity={snackbar.severity}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      />
    </Box>
  );
};

export default SellerLoginForm;


/**
 * OTP input behavior (6-box) — step-by-step explanation
 *
 * Overview:
 * - The form keeps the whole OTP as a single string in Formik (e.g. "123456").
 * - The UI renders 6 single-character TextField boxes. Each box represents one index in that string.
 *
 * handleOtpChange(e, index) — what it does step by step:
 * 1. Read the user's input:
 *    - const { value } = e.target;
 *    - value will be either "" (empty) or a single character (because each box has maxLength: 1).
 *
 * 2. Validate the character:
 *    - The regex /^[0-9]?$/ allows either an empty string or a single digit (0–9).
 *    - If the input doesn't match (letters, multiple chars), the function ignores it and doesn't update Formik.
 *
 * 3. Build an array of characters from the current Formik OTP:
 *    - const otpArray = formik.values.otp.split("");
 *    - If the value was empty, split("") returns [].
 *
 * 4. Place the new character at the correct position:
 *    - otpArray[index] = value;
 *    - This writes the digit at that index. If the array was shorter, assignment creates that index (empty slots are fine).
 *
 * 5. Produce the new OTP string:
 *    - const newOtp = otpArray.join("");
 *    - join("") concatenates all entries (empty slots become empty strings), producing the updated OTP string.
 *
 * 6. Update Formik:
 *    - formik.setFieldValue("otp", newOtp);
 *    - This keeps the canonical OTP value in one place (Formik), which triggers validation when appropriate.
 *
 * 7. Auto-focus next box:
 *    - If value is non-empty, move focus to otpRefs.current[index + 1] (if it exists).
 *    - This improves typing flow so users don't need to manually move between boxes.
 *
 *
 * handleKeyDown(e, index) — backspace behavior:
 * 1. Detect Backspace key:
 *    - if (e.key === "Backspace") { ... }
 *
 * 2. If Backspace is pressed and the current box is empty (no digit at otp[index]):
 *    - Move focus to the previous box: otpRefs.current[index - 1]?.focus();
 *    - This allows the user to delete the previous digit quickly (mimics common OTP UX).
 *
 *
 * Additional notes & best practices:
 * - Use inputProps.maxLength = 1 to limit visible characters in each box.
 * - Use inputMode="numeric" and pattern="\d*" on inputs to hint mobile keyboards to show numeric keypad.
 * - Validation: Yup enforces /^[0-9]{6}$/ so Formik will only consider the form valid when all 6 boxes are filled with digits.
 *   - To show errors promptly, ensure you mark the field touched (e.g., formik.setFieldTouched("otp", true) on blur or before submit).
 * - Trim / normalize the OTP before sending: formik.values.otp.slice(0, 6) to ensure max length.
 * - Paste support (optional improvement):
 *    - Add an onPaste handler that reads clipboard text, extracts up to 6 digits, fills otpArray accordingly,
 *      sets formik.setFieldValue("otp", joinedDigits) and updates/ focuses the appropriate boxes.
 */

