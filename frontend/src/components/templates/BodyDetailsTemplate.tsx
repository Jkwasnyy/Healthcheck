import { useState } from "react";
import { GenderCard, Main, ProgressBtn } from "../atoms/index";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { setBody as setGlobalBody } from "../../store/userSlice";

interface Body {
  weight: number;
  height: number;
}

const BodyDetailsTemplate = () => {
  const {
    gender,
    weight: globalWeight,
    height: globalHeight,
  } = useAppSelector((store) => store.user);
  const dispatch = useAppDispatch();
  const [body, setBody] = useState<Body>({
    weight: globalWeight,
    height: globalHeight,
  });
  const { weight, height } = body;

  return (
    <Main className="flex flex-col items-center text-sm lg:text-base">
      <GenderCard type={gender} gender={gender} className="w-45" />
      <section className="my-6 flex w-60 flex-col text-center">
        <div className="space-y-1">
          <h2 className="font-semibold capitalize">{gender}</h2>
          <h2>
            Your weight: {weight}kg / {(weight * 2.20462262).toFixed(1)}lbs
          </h2>
          <h2>
            Your height: {height}cm / {(height * 0.032808399).toFixed(1)}feet
          </h2>
        </div>
        <div className="mt-4 flex flex-col items-center gap-2">
          <input
            type="range"
            min={30}
            max={200}
            value={body.weight}
            onChange={(e) =>
              setBody({ ...body, weight: Number(e.target.value) })
            }
            className="w-full"
          />
          <input
            type="range"
            min={100}
            max={220}
            value={body.height}
            onChange={(e) =>
              setBody({ ...body, height: Number(e.target.value) })
            }
            className="w-full"
          />
        </div>
      </section>
      <div className="flex items-center gap-2">
        <ProgressBtn reverse />
        <ProgressBtn
          onClick={() => {
            dispatch(setGlobalBody({ weight, height }));
          }}
        />
      </div>
    </Main>
  );
};

export default BodyDetailsTemplate;
