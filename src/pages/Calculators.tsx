import { useState } from "react";
import CalculatorCard from "../components/CalculatorCard";
import HorseCalculator from "../calculators/HorseCalculator";
import FarmCalculator from "../calculators/FarmCalculator";
import InstructorCalculator from "../calculators/InstructorCalculator";
import TrainerCalculator from "../calculators/TrainerCalculator";

type CalcType = "HORSE" | "FARM" | "INSTRUCTOR" | "TRAINER" | null;

const Calculators = () => {
  const [selected, setSelected] = useState<CalcType>(null);

  if (!selected) {
    return (
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">מחשבוני ביטוח</h1>
        <p className="text-sm text-slate-600 mb-6">
          בחרו מחשבון, הזינו נתונים וקבלו פרמיה שנתית ופרמיה לתקופה חלקית.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <CalculatorCard
            title="ביטוח סוסים"
            description="צד ג', חיים ובריאות לסוסים פרטיים"
            icon="🐴"
            onClick={() => setSelected("HORSE")}
          />
          <CalculatorCard
            title="ביטוח חוות סוסים"
            description="צד ג', מדריכים, חבות מעבידים ועוד"
            icon="🐎"
            onClick={() => setSelected("FARM")}
          />
          <CalculatorCard
            title="מדריכי רכיבה"
            description="אחריות מקצועית + צד ג'"
            icon="🏇"
            onClick={() => setSelected("INSTRUCTOR")}
          />
          <CalculatorCard
            title="מאמני כושר ואומנויות לחימה"
            description="צד ג' + ביטול חריג מקצועי"
            icon="🏋️‍♂️"
            onClick={() => setSelected("TRAINER")}
          />
        </div>
      </div>
    );
  }

  const back = () => setSelected(null);

  return (
    <div className="max-w-5xl mx-auto">
      <button
        onClick={back}
        className="mb-4 text-sm px-3 py-1 rounded-full border border-slate-300 hover:bg-slate-100"
      >
        ← חזרה לרשימת המחשבונים
      </button>
      {selected === "HORSE" && <HorseCalculator />}
      {selected === "FARM" && <FarmCalculator />}
      {selected === "INSTRUCTOR" && <InstructorCalculator />}
      {selected === "TRAINER" && <TrainerCalculator />}
    </div>
  );
};

export default Calculators;
