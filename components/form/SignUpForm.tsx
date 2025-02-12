"use client";

import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "../ui/use-toast";

const FormSchema = z
  .object({
    name: z.string().min(1, "Name is required").max(100),
    email: z.string().min(1, "Email is required").email("Invalid email"),
    password: z.string().min(3, "Password must be at least 3 characters"),
    confirmPassword: z.string().min(3, "Password confirmation is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

const SignUpForm = () => {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    const response = await fetch("/api/user", {
      method: "POST",
      body: JSON.stringify(values),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      toast({
        title: "Success",
        description: "User created successfully",
      });
      router.push("/sign-in");
    } else {
      const data = await response.json();
      toast({
        title: "Error",
        description: data.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-[#1e1e1e]">
      <div className="bg-[#232222] p-8 rounded-lg shadow-lg w-full max-w-md text-white">
        <h2 className="text-3xl font-bold text-center mb-6">
          Create an Account
        </h2>

        {/* ✅ Sign-up Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="John Doe"
                      {...field}
                      className="bg-[#2d2d2d] border-none text-white rounded-lg p-3"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="mail@example.com"
                      {...field}
                      className="bg-[#2d2d2d] border-none text-white rounded-lg p-3"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      {...field}
                      className="bg-[#2d2d2d] border-none text-white rounded-lg p-3"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">
                    Confirm Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Re-enter your password"
                      type="password"
                      {...field}
                      className="bg-[#2d2d2d] border-none text-white rounded-lg p-3"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ✅ Submit Button */}
            <Button className="w-full mt-10 bg-yellow-400 text-black rounded-lg p-3 text-lg font-semibold hover:bg-yellow-500">
              Sign Up
            </Button>
          </form>
        </Form>

        {/* ✅ Already have an account? */}
        <p className="text-center text-sm text-gray-400 mt-4">
          Already have an account?&nbsp;
          <Link className="text-yellow-400 hover:underline" href="/sign-in">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpForm;
