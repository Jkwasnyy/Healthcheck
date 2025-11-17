import { twMerge } from "tailwind-merge";
import type { Gender } from "../../assets/types";

interface Props {
  type: Gender;
  gender: Gender;
  className?: string;
}

const GenderCard = ({ type, gender, className }: Props) => {
  const isActive: boolean = type === gender;

  const bgClass: string =
    isActive && gender == "female"
      ? "bg-linear-to-r from-pink-100 to-purple-100"
      : isActive && gender == "male"
        ? "bg-linear-to-r from-sky-100 to-green-100"
        : "";

  return (
    <div
      className={twMerge(
        bgClass,
        "relative flex aspect-square w-35 items-center justify-center rounded-full sm:w-45 md:w-50 lg:w-60",
        className,
      )}
    >
      <img src={`${type}.png`} alt={`${type} image`} className="h-[90%]" />
    </div>
  );
};

export default GenderCard;
