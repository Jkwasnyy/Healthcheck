import { useEffect, useState } from "react";
import { Main, ProgressBtn } from "../atoms/index";

type ApiResponse = {
  prawdopodobienstwo_cukrzycy: number;
  interpretacja: string;
  raport: string[];
};

interface Props {
  values: Record<string, number | boolean | string>;
}

const ResultTemplate = ({ values }: Props) => {
  const [result, setResult] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const sendData = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch("http://localhost:8000/predict", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });

        if (!res.ok) {
          throw new Error("API Error");
        }

        const data: ApiResponse = await res.json();
        setResult(data);
      } catch (err) {
        setError("Cannot load a result of risk predict");
      } finally {
        setLoading(false);
      }
    };

    sendData();
  }, [values]);

  return (
    <Main className="flex flex-col items-center text-sm lg:text-base">
      <h2 className="text-base font-bold lg:text-lg">Analysis result</h2>

      {loading && <p>Analysing data...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {result && (
        <div className="my-8">
          <p>
            <span className="font-semibold">Risk of diabetes:</span>{" "}
            {result.prawdopodobienstwo_cukrzycy}%
          </p>
          <p>
            <span className="font-semibold">Interpretation:</span>{" "}
            {result.interpretacja}
          </p>
          <div>
            <p>
              <span className="font-semibold">Medical raport:</span>
            </p>
            <ul>
              {result.raport.map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
      <ProgressBtn reverse />
    </Main>
  );
};

export default ResultTemplate;
