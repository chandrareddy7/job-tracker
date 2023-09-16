import { Form, Link, redirect, useNavigate } from "react-router-dom";
import { Logo, FormRow, SubmitBtn } from "../components/index";
import Wrapper from "../assets/wrappers/RegisterAndLoginPage";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";

export const action = async ({ request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  try {
    await customFetch.post("/auth/login", data);
    toast.success("Login successful");
    return redirect("/dashboard");
  } catch (error) {
    toast.error(error?.response?.data?.message);
    return error;
  }
};

const Login = () => {
  const navigate = useNavigate();

  const loginDemoUser = async () => {
    const data = {
      email: "test1@gmail.com",
      password: "chandra123",
    };
    try {
      await customFetch.post("/auth/login", data);
      toast.success("Login successful");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error?.response?.data?.message);
      return error;
    }
  };
  return (
    <Wrapper>
      <Form method="post" className="form">
        <Logo />
        <h4>Login</h4>
        <FormRow type="email" name="email" />
        <FormRow type="password" name="password" />
        <SubmitBtn />
        <button type="button" className="btn btn-block" onClick={loginDemoUser}>
          Explore the app
        </button>
        <p>
          Not a member yet?{" "}
          <Link to="/register" className="member-btn">
            Register
          </Link>{" "}
        </p>
      </Form>
    </Wrapper>
  );
};
export default Login;
