import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Main } from "../atoms";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const loginSchema = z.object({
  email: z.string().email("Email address is not valid"),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const navigate = useNavigate();

  const onSubmit = async (dataForm: LoginForm) => {
    try {
      const res = await fetch("http://localhost:8000/login-json", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataForm),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.detail || "Login failed");
        return;
      }

      // Zapisujemy token i patientId
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("patientId", data.patient_id.toString());

      toast.success("Login successful!");
      navigate("/"); // przekierowanie na stronę główną
    } catch (err) {
      console.error(err);
      toast.error("Network error");
    }
  };

  return (
    <Main className="flex flex-col items-center space-y-8 text-sm lg:text-base">
      <div className="w-full max-w-xl">
        <h2 className="mb-6 text-left font-bold">Login to your account</h2>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-y-2"
        >
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
            Log in
          </button>
        </form>
      </div>
    </Main>
  );
};

export default Login;
