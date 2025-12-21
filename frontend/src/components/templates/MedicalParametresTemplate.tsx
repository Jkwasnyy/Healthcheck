import { useEffect, useState } from "react";
import { Main, ProgressBtn } from "../atoms/index";
import { useAppSelector } from "../../store/hooks";

type Ilness = "diabetes" | "obesity" | "atherosclerosis" | "hypertension";

type Field = {
  name: string;
  unit: string;
  type: "number" | "checkbox";
  min?: number;
  max?: number;
};

const ilnessParametres: Record<Ilness, { fields: Field[] }> = {
  diabetes: {
    fields: [
      { name: "Pregnancies", unit: "number", type: "number", min: 0, max: 17 },
      { name: "Glucose", unit: "mg/dL", type: "number", min: 50, max: 200 },
      {
        name: "BloodPressure",
        unit: "mmHg",
        type: "number",
        min: 40,
        max: 122,
      },
      { name: "SkinThickness", unit: "mm", type: "number", min: 7, max: 99 },
      { name: "Insulin", unit: "µU/mL", type: "number", min: 0, max: 900 },
      { name: "BMI", unit: "kg/m²", type: "number", min: 15, max: 70 },
      {
        name: "DiabetesPedigreeFunction",
        unit: "number",
        type: "number",
        min: 0,
        max: 2.5,
      },
      { name: "Age", unit: "years", type: "number", min: 16, max: 90 },
    ],
  },
  obesity: {
    fields: [
      { name: "bmi", unit: "kg/m²", type: "number", min: 10, max: 60 },
      {
        name: "waist_circumference",
        unit: "cm",
        type: "number",
        min: 40,
        max: 200,
      },
      { name: "age", unit: "years", type: "number", min: 0, max: 120 },
    ],
  },
  atherosclerosis: {
    fields: [
      { name: "ldl", unit: "mg/dL", type: "number", min: 50, max: 300 },
      { name: "hdl", unit: "mg/dL", type: "number", min: 20, max: 100 },
      { name: "sbp", unit: "mmHg", type: "number", min: 80, max: 250 },
      { name: "age", unit: "years", type: "number", min: 0, max: 120 },
      { name: "smoking", unit: "", type: "checkbox" },
    ],
  },
  hypertension: {
    fields: [
      { name: "sbp", unit: "mmHg", type: "number", min: 80, max: 250 },
      { name: "dbp", unit: "mmHg", type: "number", min: 50, max: 150 },
      { name: "bmi", unit: "kg/m²", type: "number", min: 10, max: 60 },
      { name: "age", unit: "years", type: "number", min: 0, max: 120 },
    ],
  },
};

type Props = {
  setValues: React.Dispatch<
    React.SetStateAction<Record<string, string | number | boolean>>
  >;
};

const MedicalParametresTemplate = ({ setValues }: Props) => {
  const ilness = useAppSelector((state) => state.user.ilness) as Ilness;
  const fields = ilnessParametres[ilness]?.fields ?? [];

  const [temp, setTemp] = useState<Record<string, string | number | boolean>>(
    {},
  );

  useEffect(() => {
    const defaults: Record<string, string | number | boolean> = {};

    fields.forEach((f) => {
      defaults[f.name] = f.type === "number" ? Number(f.min) : false;
    });

    setTemp(defaults);
  }, [ilness]);

  const handleNumberChange = (index: number, name: string, value: number) => {
    const field = fields[index];

    if (Number.isNaN(value)) {
      setTemp((prev) => ({
        ...prev,
        [name]: "",
      }));
      return;
    }

    if (field.type !== "number") return;

    let currentValue = value;

    if (field.min !== undefined && currentValue < field.min) {
      currentValue = field.min;
    }

    if (field.max !== undefined && currentValue > field.max) {
      currentValue = field.max;
    }

    setTemp((prev) => ({
      ...prev,
      [name]: currentValue,
    }));
  };

  const handleCheckbox = (name: string, checked: boolean) => {
    setTemp((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const saveAndProceed = () => {
    setValues(temp);
    console.log(temp);
  };

  return (
    <Main className="flex flex-col items-center text-sm lg:text-base">
      <h2 className="text-base font-semibold lg:text-lg">
        Add <span className="text-sky-500">{ilness}</span> parameters
      </h2>
      <section className="my-8 w-full max-w-sm space-y-2">
        {fields.map((p, i: number) => {
          const current = temp[p.name];
          return (
            <div
              key={i}
              className="flex flex-wrap items-center justify-between rounded-lg bg-white px-4 py-2 shadow-sm hover:bg-sky-50"
            >
              <div>{p.name}</div>
              {p.type === "number" ? (
                <input
                  type="number"
                  className="w-24 text-center outline-none"
                  value={Number(current)}
                  onChange={(e) =>
                    handleNumberChange(i, p.name, e.target.valueAsNumber)
                  }
                  min={p.min}
                  max={p.max}
                />
              ) : (
                <input
                  type="checkbox"
                  checked={Boolean(current)}
                  onChange={(e) => handleCheckbox(p.name, e.target.checked)}
                  className="w-28"
                />
              )}
            </div>
          );
        })}
      </section>
      <div className="flex items-center gap-2">
        <ProgressBtn reverse />
        <ProgressBtn onClick={saveAndProceed} />
      </div>
    </Main>
  );
};

export default MedicalParametresTemplate;
