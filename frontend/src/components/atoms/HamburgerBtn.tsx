import { motion } from "framer-motion";
import { useState } from "react";
import MobileMenu from "../atoms/MobileMenu";

const HamburgerBtn = () => {
  const [toggle, setToggle] = useState<boolean>(false);

  return (
    <>
      <div
        onClick={() => setToggle((prev) => !prev)}
        className="relative z-50 cursor-pointer space-y-1.5"
      >
        <motion.span
          animate={{ rotateZ: toggle ? 45 : 0, y: toggle ? 8 : 0 }}
          className="block h-0.5 w-6 bg-black"
        />
        <motion.span
          animate={{ width: toggle ? 0 : 16 }}
          className="block h-0.5 w-4 bg-black"
        />
        <motion.span
          animate={{ rotateZ: toggle ? -45 : 0, y: toggle ? -8 : 0 }}
          className="block h-0.5 w-6 bg-black"
        />
      </div>

      {toggle && <MobileMenu onClose={() => setToggle(false)} />}
    </>
  );
};

export default HamburgerBtn;
