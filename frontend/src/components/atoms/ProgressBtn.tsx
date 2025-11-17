import { FaAngleRight, FaAngleLeft } from "react-icons/fa";
import { useAppDispatch } from "../../store/hooks";
import { increment, decrement } from "../../store/counterSlice";
import { twMerge } from "tailwind-merge";

interface Props {
  reverse?: boolean;
  className?: string;
  onClick?: () => void;
}

const ProgressBtn = ({ reverse, className, onClick }: Props) => {
  const dispatch = useAppDispatch();

  const handleNextPage = () => {
    if (onClick) onClick();
    reverse ? dispatch(decrement()) : dispatch(increment());
  };

  return (
    <div
      onClick={handleNextPage}
      className={twMerge(
        "flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-sky-500 text-white duration-200 hover:bg-sky-600",
        className,
      )}
    >
      {reverse ? <FaAngleLeft /> : <FaAngleRight />}
    </div>
  );
};

export default ProgressBtn;
