interface Props {
  value: number;
}

const ProgressBar = ({ value }: Props) => {
  return (
    <div className="relative flex h-6 w-30 items-center justify-center rounded-2xl bg-neutral-200 text-white sm:w-50 lg:h-8">
      <span className="z-2 font-medium">{value}%</span>
      <div
        className="absolute bottom-0 left-0 h-full rounded-l-2xl rounded-r-2xl bg-sky-500 sm:w-20"
        style={{ width: `${value}%` }}
      />
    </div>
  );
};

export default ProgressBar;
