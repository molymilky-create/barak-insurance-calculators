import { motion } from "framer-motion";

interface CompanyBadgeProps {
  company: "menora" | "hachshara";
  logo: string;
  name: string;
  isSelected: boolean;
  onClick: () => void;
}

const CompanyBadge = ({
  company,
  logo,
  name,
  isSelected,
  onClick,
}: CompanyBadgeProps) => {
  const getColors = () => {
    if (company === "menora") {
      return {
        border: isSelected ? "border-yellow-500" : "border-slate-200",
        bg: isSelected ? "bg-yellow-50" : "bg-white",
        ring: "focus:ring-yellow-500",
      };
    } else {
      return {
        border: isSelected ? "border-blue-500" : "border-slate-200",
        bg: isSelected ? "bg-blue-50" : "bg-white",
        ring: "focus:ring-blue-500",
      };
    }
  };

  const colors = getColors();

  return (
    <motion.button
      onClick={onClick}
      className={`flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all ${colors.border} ${colors.bg} ${colors.ring} hover:shadow-lg focus:outline-none focus:ring-2`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <img src={logo} alt={name} className="h-16 object-contain" />
      <div className="text-lg font-bold text-slate-800">{name}</div>
    </motion.button>
  );
};

export default CompanyBadge;
