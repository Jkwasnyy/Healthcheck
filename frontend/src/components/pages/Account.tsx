import { useEffect, useState } from "react";
import { Main } from "../atoms";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { ChevronDown, ChevronUp } from "lucide-react";

interface Patient {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
}

interface Advice {
  result: string;
  medical_advices: string;
  how_to_cure: string;
  movies: string[];
  norm: Record<string, string>;
}

interface Result {
  result: any;
  created_at: string;
  ui_advice?: Record<string, Advice>[];
  disclaimer?: string;
}

const initialPatient: Patient = {
  id: 0,
  email: "",
  first_name: "",
  last_name: "",
};

const Account = () => {
  const [patient, setPatient] = useState<Patient>(initialPatient);
  const [results, setResults] = useState<Result[]>([]);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null); // do accordion
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You have to sign in first!");
        navigate("/login");
        return;
      }

      try {
        const resPatient = await fetch("http://localhost:8000/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!resPatient.ok) {
          const err = await resPatient.json();
          toast.error(err.detail || "Failed to fetch patient info");
          return;
        }
        const patientData: Patient = await resPatient.json();
        setPatient(patientData);

        const resResults = await fetch(
          `http://localhost:8000/patient/${patientData.id}/results`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        if (!resResults.ok) {
          toast.error("Failed to fetch results");
          return;
        }
        const resultsData: Result[] = await resResults.json();
        setResults(resultsData);
      } catch (err) {
        console.error(err);
        toast.error("Network error");
      }
    };

    fetchData();
  }, [navigate]);

  const getYouTubeId = (url: string) => {
    const match = url.match(/(?:v=|\/)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : null;
  };

  return (
    <Main className="flex flex-col items-center space-y-8 text-sm lg:text-base">
      <div className="w-full max-w-4xl space-y-6">
        <section className="rounded-xl border-2 p-4">
          <h2 className="mb-4 font-bold">Your account details</h2>
          <p>
            <strong>Email:</strong> {patient.email}
          </p>
          <p>
            <strong>First name:</strong> {patient.first_name}
          </p>
          <p>
            <strong>Last name:</strong> {patient.last_name}
          </p>
          <button
            className="mt-4 rounded bg-red-600 px-6 py-2 text-white hover:bg-red-800"
            onClick={() => {
              localStorage.removeItem("token");
              toast.success("Logged out successfully!");
              navigate("/login");
            }}
          >
            Logout
          </button>
        </section>
        <section>
          <h2 className="mb-4 font-bold">Your medical results</h2>
          {results.length ? (
            results.map((r, idx) => {
              const isExpanded = expandedIndex === idx;
              return (
                <div key={idx} className="mb-4">
                  {/* HEADER */}
                  <button
                    className="w-full bg-sky-900 p-3 text-left font-semibold text-white hover:bg-sky-700"
                    onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                  >
                    {new Date(r.created_at).toLocaleString()}
                    <span className="float-right">
                      {isExpanded ? <ChevronUp /> : <ChevronDown />}
                    </span>
                  </button>

                  {/* BODY */}
                  {isExpanded && (
                    <div className="border-2">
                      {r.ui_advice?.map((adviceObj, i) =>
                        Object.entries(adviceObj).map(
                          ([disease, advice]: [string, Advice]) => (
                            <div key={i + disease} className="border-b-2 p-6">
                              <h3 className="mb-4 font-bold">{disease}</h3>
                              <p>
                                <strong>Result:</strong> {advice.result}
                              </p>
                              <p>
                                <strong>Advice:</strong>{" "}
                                {advice.medical_advices}
                              </p>
                              <p>
                                <strong>How to reduce risk:</strong>{" "}
                                {advice.how_to_cure}
                              </p>
                              <p>
                                <strong>Norms:</strong>{" "}
                                {Object.entries(advice.norm)
                                  .map(([k, v]) => `${k}: ${v}`)
                                  .join(", ")}
                              </p>

                              {advice.movies && advice.movies.length > 0 && (
                                <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
                                  {advice.movies.map((url, j) => {
                                    const videoId = getYouTubeId(url);
                                    if (!videoId) return null;
                                    return (
                                      <iframe
                                        key={j}
                                        width="100%"
                                        height="200"
                                        src={`https://www.youtube.com/embed/${videoId}`}
                                        title="YouTube video"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                      ></iframe>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          ),
                        ),
                      )}
                      {r.disclaimer && (
                        <p className="py-4 text-center text-gray-500">
                          {r.disclaimer}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <p>Currently you don't have any saved medical results.</p>
          )}
        </section>
      </div>
    </Main>
  );
};

export default Account;
