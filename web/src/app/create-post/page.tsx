"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCreatePostMutation, useLoginUserMutation, useMeQuery } from "../../gql/graphql";
import { useRouter } from "next/navigation";
import { useQuery, gql } from "@apollo/client";
import Link from "next/link";
import { Textarea } from "@/components/ui/textarea";
import { create } from "domain";
import { useIsAuth } from "@/utils/useIsAuth";

const formSchema = z.object({
  title: z.string(),
  text: z.string(),
});

export default function Page() {
  useIsAuth();
  const [createPost, { data, loading, error }] = useCreatePostMutation();
  const router = useRouter();
  
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      text: "",
    },
  });

  // 2. Define a submit handler.
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
    const response = await createPost({
      variables: {
        input: {
          title: values.title,
          text: values.text,
        }
      }
    });
    router.push('/');
  };

  return (
    <main className="flex flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-xl items-center justify-between font-mono text-sm">
        <h1 className="text-7xl mb-10">Post</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="what's happening?" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="details..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">post</Button>
          </form>
        </Form>
      </div>
    </main>
  );
}