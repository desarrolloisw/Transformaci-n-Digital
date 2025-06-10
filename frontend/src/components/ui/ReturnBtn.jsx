import { useNavigate } from "react-router-dom";
import { HiArrowLeft } from "react-icons/hi";

// filepath: c:\Users\fofap\Desktop\Transformacion Digital\frontend\src\components\ui\ReturnBtn.jsx
export const ReturnBtn = ({ className = "" }) => {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate(-1)}
      className={`flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 hover:scale-105 transition-all font-semibold gap-2 ${className}`}
    >
      <HiArrowLeft className="w-5 h-5" />
      Volver
    </button>
  );
};