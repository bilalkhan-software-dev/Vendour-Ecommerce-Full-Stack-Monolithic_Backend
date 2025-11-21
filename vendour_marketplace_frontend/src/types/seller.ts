export interface SellerResponse {
  id?: number;
  email: string;
  name: string;
  mobile: string;
  strn: string;
  role: string;
  emailVerified?: boolean;
  accountStatus?: string;

  sellerBusinessDetails?: Partial<SellerBusinessDetails>;
  sellerBankDetails?: Partial<SellerBankDetails>;
  pickupAddress?: Partial<Address>;
}

export interface SellerBusinessDetails {
  businessName: string;
  businessAddress: string;
  businessMobileNumber: string;
  businessEmail: string;
  logo?: string;
  banner?: string;
}

export interface SellerBankDetails {
  accountNumber: string;
  bankName: string;
  accountHolderName: string;
  iban: string;
}

export interface Address {
  id?: number;
  name: string;
  locality: string;
  city: string;
  state: string;
  pinCode: string;
  mobile: string;
  address: string;
}


export interface SellerAuthSliceState {
  loading: boolean,
  token: string | null | undefined,
  isAuthenticated: boolean,
  isOtpSent: boolean,
  error: string | null | undefined,
  otpSentMessage?: string | null
}


export type FormValues = {
  name: string;
  mobile: string;
  email: string;
  otp: string;
  bankDetails: {
    accountNumber: string;
    bankName: string;
    accountHolderName: string;
    iban: string;
  };
  businessDetails: {
    businessName: string;
    businessAddress: string;
    businessMobileNumber: string;
    businessEmail: string;
    banner: string;
    logo: string;
  };
  pickupAddress: {
    name: string;
    locality: string;
    city: string;
    state: string;
    pinCode: string;
    mobile: string;
    address: string;
  };
  strn: string;
};