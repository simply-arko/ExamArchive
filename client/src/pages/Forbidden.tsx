import { Button } from '@nextui-org/react';
import { useNavigate } from 'react-router-dom';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { useState } from 'react';
import Cartoon from '@/assets/forbidden-no-bg.png';

/* eslint-disable react/no-unescaped-entities */
export default function ForbiddenPage() {
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState<boolean>(false);
  return (
    <div className="flex flex-col gap-y-3 font-natosans text-lg justify-center items-center">
      <img
        width={700}
        height={700}
        src={Cartoon}
        alt="Forbidden"
        className="mb-7"
        onLoad={() => setLoaded(true)}
      />
      {loaded === true && (
        <>
          <p className="dark:text-slate-300 text-slate-800 text-sm text-center sm:text-medium">
            Oops! Looks like you don't have the keys to this door.
          </p>
          <p className="text-slate-500 text-sm text-center sm:text-medium">
            If you think you should have access, please reach out to support for
            assistance.
          </p>
          <Button
            color="primary"
            radius="sm"
            variant="bordered"
            className="border-transparent"
            startContent={<IoMdArrowRoundBack />}
            onClick={() => navigate('/', { replace: true })}
          >
            Go to home page
          </Button>
        </>
      )}
    </div>
  );
}
