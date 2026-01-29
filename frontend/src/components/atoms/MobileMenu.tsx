import { motion } from "framer-motion";
import { Link } from "react-router-dom";

interface MobileMenuProps {
  onClose: () => void;
}

const unloggedLinks = [
  { name: "Calculate Health", href: "/" },
  { name: "Register", href: "/register" },
  { name: "Login", href: "/login" },
];

const loggedLinks = [
  { name: "Calculate Health", href: "/" },
  { name: "Your account", href: "/account" },
];

const menuMotion = {
  visible: {
    left: 0,
    transition: { when: "beforeChildren", staggerChildren: 0.2 },
  },
  hidden: { left: 100 },
};

const itemMotion = {
  visible: { x: 0, opacity: 1 },
  hidden: { x: -100, opacity: 0 },
};

const MobileMenu = ({ onClose }: MobileMenuProps) => {
  const linksToRender = localStorage.getItem("token")
    ? loggedLinks
    : unloggedLinks;

  return (
    <motion.section
      className="fixed top-0 left-0 z-40 flex h-screen w-screen items-center justify-center bg-white"
      variants={menuMotion}
      initial="hidden"
      animate="visible"
    >
      <div className="flex flex-col gap-6 font-semibold">
        {linksToRender.map(({ name, href }, index) => (
          <motion.div key={index} variants={itemMotion}>
            <Link to={href} onClick={onClose}>
              {name}
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default MobileMenu;
