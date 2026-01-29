import { useEffect, useState } from "react";
import { Main, ProgressBtn } from "../atoms/index";
import { useAppSelector } from "../../store/hooks";

type Field = {
  id: string;
  name: string;
  unit: string;
  type: "number" | "checkbox";
  min?: number;
  max?: number;
  description?: string;
  editable?: boolean;
};

const medicalFields: Field[] = [
  {
    id: "f1",
    name: "Pregnancies",
    unit: "number",
    type: "number",
    min: 0,
    max: 17,
    description: "Number of pregnancies",
  },
  {
    id: "f2",
    name: "Glucose",
    unit: "mg/dL",
    type: "number",
    min: 50,
    max: 200,
    description: "Check blood glucose in a lab",
  },
  {
    id: "f3",
    name: "BloodPressure",
    unit: "mmHg",
    type: "number",
    min: 40,
    max: 122,
    description: "Measure diastolic blood pressure",
  },
  {
    id: "f4",
    name: "SkinThickness",
    unit: "mm",
    type: "number",
    min: 7,
    max: 99,
    description: "Measure skin fold thickness",
  },
  {
    id: "f5",
    name: "Insulin",
    unit: "µU/mL",
    type: "number",
    min: 0,
    max: 900,
    description: "Measure insulin in blood",
  },
  {
    id: "f6",
    name: "BMI",
    unit: "kg/m²",
    type: "number",
    min: 15,
    max: 70,
    description: "Body Mass Index",
  },
  {
    id: "f7",
    name: "DiabetesPedigreeFunction",
    unit: "number",
    type: "number",
    min: 0,
    max: 2.5,
    description: "Genetic risk factor for diabetes",
  },
  {
    id: "f8",
    name: "Age",
    unit: "years",
    type: "number",
    min: 6,
    max: 120,
    description: "Patient's age",
  },
];

type Props = {
  setValues: React.Dispatch<
    React.SetStateAction<Record<string, string | number | boolean>>
  >;
};

const MedicalParametresTemplate = ({ setValues }: Props) => {
  // temp klucze = nazwy pól
  const [temp, setTemp] = useState<Record<string, string | number | boolean>>(
    {},
  );
  const [additionalParams, setAdditionalParams] = useState<Field[]>([]);
  const userBmi = useAppSelector((state) => state.user.bmi);

  useEffect(() => {
    const defaults: Record<string, string | number | boolean> = {};
    medicalFields.forEach((f) => {
      defaults[f.name] =
        f.name === "BMI"
          ? userBmi || Number(f.min)
          : f.type === "number"
            ? Number(f.min)
            : false;
    });
    setTemp(defaults);
  }, [userBmi]);

  const handleNumberChange = (name: string, value: number) => {
    setTemp((prev) => ({ ...prev, [name]: Number.isNaN(value) ? "" : value }));
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setTemp((prev) => ({ ...prev, [name]: checked }));
  };

  // aktualizacja nazwy dodatkowego parametru
  const handleFieldNameChange = (id: string, newName: string) => {
    setAdditionalParams((prev) =>
      prev.map((f) => {
        if (f.id === id) {
          // aktualizujemy klucz w temp
          setTemp((tempPrev) => {
            const { [f.name]: value, ...rest } = tempPrev;
            return { ...rest, [newName]: value };
          });
          return { ...f, name: newName };
        }
        return f;
      }),
    );
  };

  const handleFieldUnitChange = (id: string, newUnit: string) => {
    setAdditionalParams((prev) =>
      prev.map((f) => (f.id === id ? { ...f, unit: newUnit } : f)),
    );
  };

  const addParam = () => {
    const id = `add_${Date.now()}`;
    const newField: Field = {
      id,
      name: `Param${additionalParams.length + 1}`,
      unit: "",
      type: "number",
      min: 0,
      max: 1000,
      description: "Additional parameter",
      editable: true,
    };
    setAdditionalParams((prev) => [...prev, newField]);
    setTemp((prev) => ({ ...prev, [newField.name]: 0 }));
  };

  const saveAndProceed = () => {
    setValues(temp);
    console.log(temp); // teraz w formacie { Glucose: 3, Age: 30, Param1: 10 }
  };

  const renderField = (p: Field) => {
    const current = temp[p.name];
    return (
      <div
        key={p.id}
        className="flex w-full flex-col justify-between rounded-lg bg-white px-4 py-2 shadow-sm hover:bg-sky-50 md:flex-row md:items-center"
      >
        {/* LEWA STRONA: nazwa + opis */}
        <div className="flex w-full flex-col md:w-3/4">
          {p.editable ? (
            <div className="flex flex-col gap-1 md:flex-row md:items-center md:gap-2">
              <input
                type="text"
                value={p.name}
                onChange={(e) => handleFieldNameChange(p.id, e.target.value)}
                className="w-full rounded border px-1 py-0.5 md:w-32"
              />
              <input
                type="text"
                value={p.unit}
                onChange={(e) => handleFieldUnitChange(p.id, e.target.value)}
                placeholder="Unit"
                className="w-full rounded border px-1 py-0.5 md:w-20"
              />
            </div>
          ) : (
            <div className="font-medium">{p.name}</div>
          )}
          {p.description && (
            <small className="text-xs text-gray-500">{p.description}</small>
          )}
        </div>

        {/* PRAWA STRONA: input */}
        <div className="mt-2 md:mt-0 md:flex md:w-1/4 md:justify-end">
          {p.type === "number" ? (
            <input
              type="number"
              className="w-full text-center outline-none md:w-24"
              value={
                current !== undefined && current !== "" ? Number(current) : ""
              }
              onChange={(e) =>
                handleNumberChange(p.name, e.target.valueAsNumber)
              }
              min={p.min}
              max={p.max}
            />
          ) : (
            <input
              type="checkbox"
              checked={Boolean(current)}
              onChange={(e) => handleCheckboxChange(p.name, e.target.checked)}
              className="w-6 md:w-24"
            />
          )}
        </div>
      </div>
    );
  };

  return (
    <Main className="flex flex-col items-center text-sm lg:text-base">
      <h2 className="text-base font-semibold lg:text-lg">
        Add your <span className="text-sky-500">medical parameters</span>
      </h2>

      <section className="my-8 grid w-full max-w-4xl grid-cols-1 gap-4 md:grid-cols-2">
        {medicalFields.map(renderField)}
        {additionalParams.map(renderField)}
        <button
          onClick={addParam}
          className="col-span-full mt-2 rounded bg-green-500 px-3 py-1 text-white hover:bg-green-600"
        >
          + Add parameter
        </button>
      </section>

      <div className="flex items-center gap-2">
        <ProgressBtn reverse />
        <ProgressBtn onClick={saveAndProceed} />
      </div>
    </Main>
  );
};

export default MedicalParametresTemplate;
