import { useState } from "react";

const PasswordForm: React.FC<{
    password: string;
    setPassword: (password: string) => void;
}> = ({ password, setPassword }) => {
    const [showPassword, setShowPassword] = useState(false);
    return (
        <div className="relative w-full border border-gray-300 bg-gray-50 rounded-lg">
            <input
                id="campaignPassword"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full focus:outline-none focus:ring-2 text-gray-900 placeholder-gray-500 focus:border-primary-500 focus:ring-primary-500 p-2.5 text-sm rounded-lg"
            />
            <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute inset-y-0 right-0 flex items-center px-2 focus:outline-none"
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={-1}
            >
                <span className={`${showPassword ? "icon-[mdi--eye-off]" : "icon-[mdi--eye]"} text-gray-500 w-5 h-5`} />
            </button>
        </div>
    )
}

export default PasswordForm;