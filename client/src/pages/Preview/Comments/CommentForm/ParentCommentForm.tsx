import { FaCode, FaAt } from 'react-icons/fa';
import { IoMdLink } from 'react-icons/io';
import { Button } from '@nextui-org/react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Textarea } from '@/components/ui/textarea';
// import { useComments } from '@/hooks/useComments';

interface commentFormInput {
  message: string;
}

export default function ParentCommentForm({
  handleCreateComment,
}: {
  handleCreateComment: (_message: string) => Promise<void>;
}) {
  const { register, handleSubmit, reset } = useForm<commentFormInput>();

  const onSubmit: SubmitHandler<commentFormInput> = (formData) => {
    handleCreateComment(formData.message);
    reset();
  };

  return (
    <div className="py-4 rounded-xl shadow-md flex flex-col gap-y-4">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Textarea
          placeholder="Type your comment here..."
          className="resize-none min-h-[50px]"
          {...register('message')}
        />

        <div className="px-4 flex flex-row justify-between">
          <span className="flex flex-row gap-x-4 self-center px-2 opacity-60">
            <FaCode /> <IoMdLink /> <FaAt />
          </span>
          <span>
            {/* <Button
              color="default"
              variant="flat"
              className="font-semibold mr-2 opacity-60"
            >
              Preview
            </Button> */}
            <Button
              color="success"
              className="font-semibold text-white tracking-wide"
              type="submit"
            >
              Comment
            </Button>
          </span>
        </div>
      </form>
    </div>
  );
}
