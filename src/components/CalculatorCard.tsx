interface CalculatorCardProps {
  title: string;
  description: string;
  icon: string;
  onClick: () => void;
}
const CalculatorCard: React.FC<CalculatorCardProps> = ({
  title,
  description,
  icon,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className="w-full text-right bg-white rounded-2xl shadow hover:shadow-lg transition p-5 flex flex-col gap-2 border border-slate-100"
    >
      <div className="text-3xl">{icon}</div>
      <div className="text-lg font-semibold text-slate-800">{title}</div>
      <p className="text-sm text-slate-500">{description}</p>
    </button>
  );
};

export default CalculatorCard;