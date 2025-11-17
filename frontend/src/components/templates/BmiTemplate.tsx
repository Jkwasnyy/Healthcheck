import { Main, ProgressBtn, GenderCard } from "../atoms/index";
import { useAppSelector } from "../../store/hooks";
import { twMerge } from "tailwind-merge";

const BmiTemplate = () => {
  const { gender, weight, height } = useAppSelector((store) => store.user);

  const handleBMIScore = () => {
    const heightInMetres = height / 100;
    const bmi = weight / Math.pow(heightInMetres, 2);

    let text = "";
    let color = "";

    if (bmi < 18.5) {
      text = "Your weight is underweight";
      color = "text-blue-500";
    } else if (bmi >= 18.5 && bmi < 25) {
      text = "Your weight is normal";
      color = "text-green-500";
    } else if (bmi >= 25 && bmi < 30) {
      text = "Your weight is overweight";
      color = "text-orange-500";
    } else {
      text = "Your weight is obese";
      color = "text-red-500";
    }

    return { bmi, text, color };
  };

  const bmiRanges = [
    { max: 18.5, color: "bg-blue-500" },
    { max: 25, color: "bg-green-500" },
    { max: 30, color: "bg-orange-500" },
    { max: 50, color: "bg-red-500" },
  ];

  return (
    <Main className="flex flex-col items-center space-y-8 text-sm lg:text-base">
      <div className="relative">
        <GenderCard type={gender} gender={gender} className="w-55" />
        <div
          className={twMerge(
            "bg-weight absolute bottom-0 left-1/2 w-full -translate-x-1/2 border border-neutral-200 bg-white p-2 text-center font-medium shadow-sm",
            handleBMIScore().color,
          )}
        >
          {handleBMIScore().text}
        </div>
      </div>
      <div className="w-full max-w-sm">
        <div className="relative mb-4 h-8 w-full max-w-sm rounded-xl">
          {bmiRanges.map((range, idx) => {
            const prevMax = idx === 0 ? 0 : bmiRanges[idx - 1].max;
            const widthPercent =
              ((range.max - prevMax) / bmiRanges[bmiRanges.length - 1].max) *
              100;

            let roundedClass = "";
            if (idx === 0) roundedClass = "rounded-l-xl";
            else if (idx === bmiRanges.length - 1)
              roundedClass = "rounded-r-xl";

            return (
              <div
                key={idx}
                className={`${range.color} absolute top-0 h-full ${roundedClass}`}
                style={{
                  width: `${widthPercent}%`,
                  left: `${(prevMax / bmiRanges[bmiRanges.length - 1].max) * 100}%`,
                }}
              ></div>
            );
          })}

          {/* wskaźnik BMI */}
          <div
            className="absolute top-[-20%] h-[140%] w-1.5 rounded-xl bg-neutral-300"
            style={{
              left: `${Math.min(
                (handleBMIScore().bmi / bmiRanges[bmiRanges.length - 1].max) *
                  100,
                99,
              )}%`,
            }}
          ></div>
        </div>
        <h2 className="text-center font-medium">
          Your BMI is {handleBMIScore().bmi.toFixed(1)}
        </h2>
      </div>
      <div className="flex items-center gap-2">
        <ProgressBtn reverse />
        <ProgressBtn />
      </div>
    </Main>
  );
};

export default BmiTemplate;
