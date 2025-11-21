
const Footer = () => {
    return (
        <div className="w-full mt-10 border-gray-400 border-t bg-gray-50 text-gray-700">
            <footer className="max-w-7xl mx-auto px-5 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
                {/* Left side */}
                <p className="text-sm text-gray-500 text-center md:text-left">
                    © {new Date().getFullYear()} Vendor Marketplace. All rights reserved.
                </p>

                {/* Right side (Links) */}
                <div className="flex gap-5 text-sm font-medium">
                    <a
                        href="/privacy"
                        className="hover:text-primary-color transition-colors"
                    >
                        Privacy Policy
                    </a>
                    <a
                        href="/terms"
                        className="hover:text-primary-color transition-colors"
                    >
                        Terms of Service
                    </a>
                    <a
                        href="/contact"
                        className="hover:text-primary-color transition-colors"
                    >
                        Contact Us
                    </a>
                </div>
            </footer>
        </div>
    );
};

export default Footer;
