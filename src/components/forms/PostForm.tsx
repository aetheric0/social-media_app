// src/components/PostForm.tsx
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { INewPost } from '../../lib/types';
import { useNavigate } from "react-router-dom";
import { PostValidation } from "@/lib/validation/index";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import FileUploader from "@/components/shared/FileUploader";
import { useCreatePost } from "@/hooks/useAuthMutations";
import { useUserContext } from "../../context/AuthProvider";
import Loader from "../shared/Loader";

type PostFormProps = {
  post?: INewPost;
};

const PostForm = ({ post }: PostFormProps) => {
  const { mutate: createPost, isLoading: isCreatingPost } = useCreatePost();
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const { user } = useUserContext();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof PostValidation>>({
    resolver: zodResolver(PostValidation),
    defaultValues: {
      caption: post ? post.caption : "",
      file: [],
      location: post ? post.location : "",
      tags: (post && post.tags) ? post.tags.join(",") : "",
    },
  });

  const onSubmit = async (values: z.infer<typeof PostValidation>) => {
    try {
      const tagsArray = values.tags
        ? values.tags.split(",").map((tag) => tag.trim())
        : [];
      
      if (uploadedFiles.length === 0) {
        throw new Error("No files uploaded");
      }
  
      const newPost: INewPost = {
        caption: values.caption,
        location: values.location,
        tags: JSON.parse(tagsArray),
        file: uploadedFiles.length > 0 ? uploadedFiles : [], 
        imageUrl: "",
        imageId: `${uploadedFiles[0].name}-${Date.now()}`,
        creator: user?.id || '',
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
        encType="multipart/form-data"
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
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Photos</FormLabel>
              <FormControl>
                <FileUploader
                  fieldChange={field.onChange}
                  mediaUrl={post?.imageUrl}
                  onFilesChange={setUploadedFiles} 
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
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
