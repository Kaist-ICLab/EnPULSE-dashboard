import { useState } from "react";

const PasswordForm: React.FC<{
  password: string;
  setPassword: (password: string) => void;
  placeholder?: string;
}> = ({ password, setPassword, placeholder }) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="relative w-full rounded-lg border border-gray-300 bg-gray-50">
      <input
        id="campaignPassword"
        type={showPassword ? "text" : "password"}
        value={password}
        placeholder={placeholder}
        onChange={(e) => setPassword(e.target.value)}
        className="focus:border-primary-500 focus:ring-primary-500 block w-full rounded-lg p-2.5 text-sm text-gray-900 placeholder-gray-500 focus:ring-2 focus:outline-none"
      />
      <button
        type="button"
        aria-label={showPassword ? "Hide password" : "Show password"}
        className="absolute inset-y-0 right-0 flex items-center px-2 focus:outline-none"
        onClick={() => setShowPassword((v) => !v)}
        tabIndex={-1}
      >
        <span className={`${showPassword ? "icon-[mdi--eye-off]" : "icon-[mdi--eye]"} h-5 w-5 text-gray-500`} />
      </button>
    </div>
  );
};

export default PasswordForm;
