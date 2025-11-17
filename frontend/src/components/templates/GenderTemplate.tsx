import { useEffect, useState } from "react";
import { Main, ProgressBtn, GenderCard } from "../atoms";
import { useAppDispatch } from "../../store/hooks";
import { setGender as setGlobalGender } from "../../store/userSlice";
import type { Gender } from "../../assets/types";
import { twMerge } from "tailwind-merge";

const GenderTemplate = () => {
  const [gender, setGender] = useState<Gender>("female");
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setGlobalGender(gender));
  }, [gender]);

  return (
    <Main className="w-auto space-y-6">
      <GenderCardList gender={gender} />
      <SelectGender gender={gender} setGender={setGender} />
      <ProgressBtn className="mx-auto" />
    </Main>
  );
};

const GenderCardList = ({ gender }: { gender: Gender }) => {
  return (
    <section className="flex items-center gap-4">
      <GenderCard type="female" gender={gender} />
      <GenderCard type="male" gender={gender} />
    </section>
  );
};

const SelectGender = ({
  gender,
  setGender,
}: {
  gender: Gender;
  setGender: React.Dispatch<React.SetStateAction<Gender>>;
}) => {
  return (
    <div className="flex w-full items-center gap-1 rounded-3xl bg-neutral-50 p-1 text-center text-sm font-medium lg:text-base">
      <div
        onClick={() => setGender("female")}
        className={twMerge(
          "flex-1 cursor-pointer rounded-3xl p-2",
          gender == "female" ? "shadow-sm" : "",
        )}
      >
        Female
      </div>
      <div
        onClick={() => setGender("male")}
        className={twMerge(
          "flex-1 cursor-pointer rounded-3xl p-2",
          gender == "male" ? "shadow-sm" : "",
        )}
      >
        Male
      </div>
    </div>
  );
};

export default GenderTemplate;
