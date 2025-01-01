import { useState, useCallback } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { PostData, INewPost } from "@/lib/types";
import { useNavigate } from "react-router-dom";
import { PostValidation } from "@/lib/validation/index";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField, // Keep this import
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import FileUploader from "@/components/shared/FileUploader";
import { useCreatePost } from "@/hooks/useAuthMutations";
import { useUserContext } from "../../context/AuthProvider";
import Loader from "@/components/shared/Loader";

type PostFormProps = {
  post?: PostData;
};

const PostForm = ({ post }: PostFormProps) => {
  const { mutate: createPost, isPending: isCreatingPost } = useCreatePost();
  const { user } = useUserContext();
  const navigate = useNavigate();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const form = useForm<z.infer<typeof PostValidation>>({
    resolver: zodResolver(PostValidation),
    defaultValues: {
      caption: post ? post.caption : "",
      location: post ? post.location : "",
      tags: post?.tags?.join(",") || "",
    },
  });

  const handleFilesChange = useCallback((files: File[]) => {
    setSelectedFiles(files);
  }, []);

  const onSubmit = async (values: z.infer<typeof PostValidation>) => {
    try {
      const tagsArray = values.tags
        ? values.tags.split(",").map((tag) => tag.trim())
        : [];

      if (!selectedFiles || selectedFiles.length === 0) {
        console.log("selectedFiles:", selectedFiles);
        throw new Error("No files uploaded");
      }

      const newPost: INewPost = {
        caption: values.caption,
        location: values.location,
        tags: tagsArray,
        files: selectedFiles, //send files as files
        creator: user?.id || "",
      };

      await createPost(newPost);
      navigate("/");
    } catch (error) {
      console.error("Failed to create post:", error);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col justify-center gap-9 w-full max-w-5xl"
      >
        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Caption</FormLabel>
              <FormControl>
                <Textarea
                  className="shad-textarea custom-scrollbar"
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <div>
          {" "}
          {/* REMOVE FormField here */}
          <FormLabel className="shad-form_label">Add Photos</FormLabel>
          <FileUploader onFilesChange={handleFilesChange} />
        </div>{" "}
        {/* REMOVE FormField here */}
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add location</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">
                Add Tags (separated by comma ",")
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  className="shad-input"
                  placeholder="Art, Expression, Learn"
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <div className="flex gap-4 items-center justify-end">
          <Button type="button" className="shad-button_dark_4">
            Cancel
          </Button>
          <Button
            type="submit"
            className="shad-button_primary whitespace-nowrap"
          >
            {isCreatingPost ? (
              <div className="flex-center gap-2">
                <Loader /> Loading..
              </div>
            ) : (
              "Submit"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PostForm;
