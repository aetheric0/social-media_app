import { useForm, FieldValues, Path } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "../../components/ui/form";
import { Input } from "../../components/ui/input";



interface TextInputProps<T extends FieldValues> {
    name: Path<T>;
    label: string;
    type?: string;
    form: ReturnType<typeof useForm<T>>;
  }

  const TextInput = <T extends FieldValues>({ name, label, type = "text", form  }: TextInputProps<T>): JSX.Element => (
    <FormField control={form.control} name={name} render={({ field }) => (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <FormControl>
          <Input type={type} className="shad-input" {...field} />
        </FormControl>
        {form.formState.errors[name]?.message && ( 
          <FormMessage>{String(form.formState.errors[name]?.message)}</FormMessage>
        )}
      </FormItem>
    )} />
  )

export default TextInput;