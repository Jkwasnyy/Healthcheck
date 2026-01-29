import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Main } from "../atoms";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const registerSchema = z.object({
  first_name: z.string().min(3, "First name must be at least 3 characters"),
  last_name: z.string().min(3, "Last name must be at least 3 characters"),
  email: z
    .string()
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Email address is not valid"),
  password: z
    .string()
    .regex(
      /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/,
      "Password must be at least 8 characters, include 1 uppercase letter and 1 special character",
    ),
});

type RegisterForm = z.infer<typeof registerSchema>;

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const navigate = useNavigate();

  const onSubmit = async (dataForm: RegisterForm) => {
    try {
      const res = await fetch("http://localhost:8000/register", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ ...dataForm }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.log("Error:", data);
        return;
      } else {
        console.log("Registered successfully!");
        toast.success("Account created successfully!");
        navigate("/login");
      }
    } catch (err) {
      console.log(`Network error: ${err}`);
    }
  };

  return (
    <Main className="flex flex-col items-center space-y-8 text-sm lg:text-base">
      <div className="w-full max-w-xl">
        <h2 className="mb-6 text-left font-bold">Register your account</h2>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-y-2"
        >
          <input
            {...register("first_name")}
            placeholder="First name..."
            className="bg-neutral-200 px-4 py-2 outline-none"
          />
          {errors.first_name && (
            <p className="text-xs text-red-600 lg:text-sm">
              {errors.first_name.message}
            </p>
          )}
          <input
            {...register("last_name")}
            placeholder="Last name..."
            className="bg-neutral-200 px-4 py-2"
          />
          {errors.last_name && (
            <p className="text-xs text-red-600 lg:text-sm">
              {errors.last_name.message}
            </p>
          )}
          <input
            type="email"
            {...register("email")}
            placeholder="Enter your email..."
            className="bg-neutral-200 px-4 py-2"
          />
          {errors.email && (
            <p className="text-xs text-red-600 lg:text-sm">
              {errors.email.message}
            </p>
          )}
          <input
            type="password"
            {...register("password")}
            placeholder="Enter your password..."
            className="bg-neutral-200 px-4 py-2"
          />
          {errors.password && (
            <p className="text-xs text-red-600 lg:text-sm">
              {errors.password.message}
            </p>
          )}
          <button
            type="submit"
            className="cursor-pointer bg-green-500 px-4 py-2 text-white duration-200 hover:bg-green-700"
          >
            Create new account
          </button>
        </form>
      </div>
    </Main>
  );
};

export default Register;
