import { useState } from "react";
import { Main, ProgressBtn } from "../atoms/index";
import { useAppDispatch } from "../../store/hooks";
import { setIlness as setGlobalIlness } from "../../store/userSlice";
import { twMerge } from "tailwind-merge";

const ilnesses: string[] = ["diabetes"];

const IlnessTemplate = () => {
  const [ilness, setIlness] = useState<string>(ilnesses[0]);
  const dispatch = useAppDispatch();

  const isIlnessSelected = (i: string) => {
    return ilness == i ? "bg-sky-100 font-medium" : "bg-white";
  };

  return (
    <Main className="flex flex-col items-center text-sm lg:text-base">
      <h2 className="text-base font-semibold lg:text-lg">
        {ilnesses.length ? "Choose one" : "Sorry client!"}
      </h2>
      <section className="my-8 w-full max-w-sm space-y-2 text-center">
        {ilnesses.length ? (
          ilnesses.map((ilness: string, index: number) => (
            <div
              key={index}
              onClick={() => setIlness(ilness)}
              className={twMerge(
                "cursor-pointer rounded-lg bg-white p-2 shadow-sm duration-200 hover:bg-sky-50",
                isIlnessSelected(ilness),
              )}
            >
              {ilness}
            </div>
          ))
        ) : (
          <p>
            Currently, this feature is not available. Please check back later
            for updates.
          </p>
        )}
      </section>
      <div className="flex items-center gap-2">
        <ProgressBtn reverse />
        {ilnesses.length ? (
          <ProgressBtn onClick={() => dispatch(setGlobalIlness(ilness))} />
        ) : null}
      </div>
    </Main>
  );
};

export default IlnessTemplate;
