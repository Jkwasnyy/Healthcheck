import { useEffect, useState } from "react";
import { Main, ProgressBtn } from "../atoms/index";

type Disease = {
  risk_level: string;
  flags: string[];
  description: string;
};

type ApiResponse = {
  diabetes: {
    risk_level: string;
    probability: number;
    description: string;
  };
  diseases_detected: Record<string, Disease>;
  raport: string[];
};

interface Props {
  values: Record<string, number | boolean | string>;
}

const ResultTemplate = ({ values }: Props) => {
  const [result, setResult] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const riskLevelDisplay: Record<string, string> = {
    "spore": "🔴 Spore",
    "umiarkowane": "🟡 Umiarkowane",
    "małe": "🟢 Małe",
  };

  useEffect(() => {
    const sendData = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(
          "http://localhost:8000/predict",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
          },
        );

        if (!res.ok) {
          throw new Error("API Error");
        }

        const data: ApiResponse = await res.json();
        setResult(data);
      } catch (err) {
        setError("Cannot load analysis result");
      } finally {
        setLoading(false);
      }
    };

    sendData();
  }, [values]);

  return (
    <Main className="flex flex-col items-center text-sm lg:text-base">
      <h2 className="text-base font-bold lg:text-lg">Health Analysis Result</h2>

      {loading && <p className="mt-4">Analyzing your health data...</p>}
      {error && <p className="mt-4 text-red-500">{error}</p>}

      {result && (
        <div className="my-8 w-full max-w-md space-y-6">
          {/* Diabetes Analysis */}
          <div className="rounded-lg bg-white p-4 shadow-md">
            <h3 className="mb-2 font-semibold text-blue-600">
              {result.diabetes.description}
            </h3>
            <p className="text-lg">
              <span className="font-semibold">Risk Level:</span>{" "}
              {riskLevelDisplay[result.diabetes.risk_level]} ({result.diabetes.probability}%)
            </p>
          </div>

          {/* Other Detected Diseases */}
          {Object.keys(result.diseases_detected).length > 0 && (
            <div className="rounded-lg bg-white p-4 shadow-md">
              <h3 className="mb-3 font-semibold">Detected Health Conditions:</h3>
              {Object.entries(result.diseases_detected).map(([name, data]) => (
                <div key={name} className="mb-4 border-l-4 border-orange-400 pl-3">
                  <p className="font-medium">{name}</p>
                  <p className="text-sm">
                    <span className="font-semibold">Risk:</span>{" "}
                    {riskLevelDisplay[data.risk_level]}
                  </p>
                  <ul className="mt-1 list-inside list-disc text-xs text-gray-600">
                    {data.flags.map((flag, i) => (
                      <li key={i}>{flag}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {/* Parameter Report */}
          {result.raport.length > 0 && (
            <div className="rounded-lg bg-white p-4 shadow-md">
              <p className="mb-2 font-semibold">Parameter Status:</p>
              <ul className="space-y-1 text-xs">
                {result.raport.map((line, i) => (
                  <li key={i} className="text-gray-700">
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      <ProgressBtn reverse />
    </Main>
  );
};

export default ResultTemplate;
