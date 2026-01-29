import { useEffect, useState } from "react";
import { Main, ProgressBtn } from "../atoms/index";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

interface Advice {
  result: string;
  medical_advices: string;
  how_to_cure: string;
  movies: string[];
  norm: Record<string, string>;
}

interface UiAdvice {
  [key: string]: Advice;
}

interface PredictResponse {
  diabetes: {
    risk_level: string;
    probability: number;
    description: string;
  };
  diseases_detected: Record<string, { risk_level: string }>;
  raport: string[];
  ui_advice: UiAdvice[];
}

interface Props {
  values: Record<string, number | boolean | string>;
}

const ResultTemplate = ({ values }: Props) => {
  const [result, setResult] = useState<PredictResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Pobierz patientId i token z localStorage
  const patientId = Number(localStorage.getItem("patientId"));
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const sendData = async () => {
      setLoading(true);
      setError(null);
      setResult(null);

      try {
        const res = await fetch("http://localhost:8000/predict", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });

        if (!res.ok) throw new Error("API Error");

        const data: PredictResponse = await res.json();
        setResult(data);
      } catch (err) {
        setError("Cannot load analysis result");
      } finally {
        setLoading(false);
      }
    };

    sendData();
  }, [values]);

  const getYouTubeId = (url: string) => {
    const match = url.match(/(?:v=|\/)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : null;
  };

  const handleSaveResult = async () => {
    if (!result) return;
    if (!token || !patientId) {
      alert("You must be logged in to save results");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("http://localhost:8000/save-result", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          patient_id: patientId,
          diabetes: result.diabetes,
          diseases_detected: result.diseases_detected,
          raport: result.raport,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(`Could not save result: ${data.detail || "Unknown error"}`);
        return;
      }

      toast.success("Results saved successfully!");
      navigate("/account");
    } catch (err) {
      console.error(err);
      alert("Network error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Main className="flex flex-col items-center text-sm lg:text-base">
      <h2 className="text-base font-bold lg:text-lg">Health Analysis Result</h2>

      {loading && <p className="mt-4">Analyzing your health data...</p>}
      {error && <p className="mt-4 text-red-500">{error}</p>}

      {result && (
        <div className="mt-6 grid w-full max-w-6xl grid-cols-1 gap-6 md:grid-cols-2">
          {/* Wszystkie choroby */}
          {result.ui_advice.map((diseaseObj, idx) => {
            const key = Object.keys(diseaseObj)[0];
            const advice = diseaseObj[key];

            return (
              <section key={idx} className="rounded-xl border-2 p-4">
                <h3 className="mb-4 font-bold">{key}</h3>
                <p>
                  <strong>Result:</strong> {advice.result}
                </p>
                <p>
                  <strong>Advice:</strong> {advice.medical_advices}
                </p>
                <p>
                  <strong>How to reduce risk:</strong> {advice.how_to_cure}
                </p>
                <p>
                  <strong>Norms:</strong>{" "}
                  {Object.entries(advice.norm)
                    .map(([k, v]) => `${k}: ${v}`)
                    .join(", ")}
                </p>

                {advice.movies.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {advice.movies.map((url, i) => {
                      const videoId = getYouTubeId(url);
                      if (!videoId) return null;
                      return (
                        <div key={i} className="aspect-w-16 aspect-h-9">
                          <iframe
                            width="100%"
                            height="300"
                            src={`https://www.youtube.com/embed/${videoId}`}
                            title="YouTube video player"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="rounded"
                          ></iframe>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            );
          })}

          {/* Raport */}
          {result.raport && (
            <section className="rounded-xl bg-sky-900 p-4 text-white md:col-span-2">
              <h3 className="mb-4 font-semibold">Medical Report</h3>
              <ul>
                {result.raport.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </section>
          )}

          {/* Save Results Button */}
          <button
            onClick={handleSaveResult}
            disabled={saving}
            className="col-span-full rounded-md bg-green-500 px-4 py-2 text-white hover:bg-green-600 disabled:bg-gray-400"
          >
            {saving ? "Saving..." : "Save Results"}
          </button>
        </div>
      )}

      <div className="mt-6 flex items-center gap-2">
        <ProgressBtn reverse />
      </div>
    </Main>
  );
};

export default ResultTemplate;
