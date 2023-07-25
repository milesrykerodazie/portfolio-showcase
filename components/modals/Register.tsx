"use client";

import axios from "axios";
import { FcGoogle } from "react-icons/fc";
import { useCallback, useState } from "react";
import { signIn } from "next-auth/react";
import useRegisterModal from "@/hooks/useRegisterModal";
import Input from "../inputs/Input";
import AuthButton from "../AuthButton";
import useLoginModal from "@/hooks/useLoginModal";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import AuthModal from "./AuthModal";

const Register = () => {
  //rout for handling route navigation
  const route = useRouter();

  //modal hooks
  const registerModal = useRegisterModal();
  const loginModal = useLoginModal();

  //register states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  //password error state
  const [passwordMismatch, setPasswordMismach] = useState("");

  //the loading state
  const [isLoading, setIsLoading] = useState(false);

  //toggle auth
  const onToggle = useCallback(() => {
    registerModal.onClose();
    loginModal.onOpen();
  }, [registerModal, loginModal]);

  //register user method
  const handleRegister = async () => {
    setIsLoading(true);

    try {
      if (password !== confirmPassword) {
        setPasswordMismach("Passwords dont match, try again.");
        setPassword("");
        setConfirmPassword("");
        route.refresh();
        return;
      }

      const regData = {
        name,
        email,
        username,
        password,
      };

      const response = await axios.post("/api/register", regData);

      if (response?.data) {
        if (response?.data?.success === false) {
          toast.error(response?.data?.message);
        }
        if (response?.data?.success === true) {
          toast.success(response?.data?.message);
          setName("");
          setEmail("");
          setUsername("");
          setPassword("");
          setConfirmPassword("");
          registerModal.onClose();
          loginModal.onOpen();
        }
      }
    } catch (error: any) {
      console.log(error?.response?.data);
    } finally {
      setIsLoading(false);
    }
  };

  //the register body
  const registerBody = (
    <div className="flex flex-col gap-4">
      <Input
        id="name"
        label="Name"
        value={name}
        type="text"
        onChange={(event) => setName(event.target.value)}
        required
        disabled={isLoading}
      />
      <Input
        id="email"
        label="Email"
        value={email}
        type="text"
        onChange={(event) => setEmail(event.target.value)}
        required
        disabled={isLoading}
      />
      <Input
        id="username"
        label="Username"
        value={username}
        type="text"
        onChange={(event) => setUsername(event.target.value)}
        required
        disabled={isLoading}
      />
      <Input
        id="password"
        label="Password"
        value={password}
        type="password"
        onChange={(event) => setPassword(event.target.value)}
        required
        disabled={isLoading}
      />
      <Input
        id="confirmPassword"
        label="Confirm-Password"
        value={confirmPassword}
        type="password"
        onChange={(event) => setConfirmPassword(event.target.value)}
        required
        disabled={isLoading}
      />
    </div>
  );

  //the footer content
  const registerFooter = (
    <div className="flex flex-col gap-4">
      <hr />
      <AuthButton
        label="Register with google"
        icon={FcGoogle}
        onClick={() => signIn("google")}
      />
      <div className="text-primary text-center mt-2 font-light text-sm">
        <p>
          Already have an account?
          <span
            onClick={onToggle}
            className="text-primary cursor-pointer hover:underline font-semibold text-sm"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );

  return (
    <AuthModal
      disabled={isLoading}
      isOpen={registerModal.isOpen}
      title="Market Register"
      actionLabel="Register"
      onClose={registerModal.onClose}
      onSubmit={handleRegister}
      body={registerBody}
      footer={registerFooter}
    />
  );
};

export default Register;
