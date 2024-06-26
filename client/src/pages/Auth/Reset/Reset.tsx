import { jwtDecode } from 'jwt-decode';
import { toast } from 'sonner';
import useSWR from 'swr';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { AUTH_TOKEN } from '@/constants/auth';
import { Button } from '@/components/ui/button';
import { CLIENT_ROUTES } from '@/constants/routes';
import Email from './Email/Email';
import LogoBanner from '@/assets/LogoBanner.png';
import { SUCCESS_CODES } from '@/constants/statusCodes';
import Spinner from '@/components/ui/spinner';
import Update from './Update/Update';
import { getResetObj } from '@/utils/axiosReqObjects';
import { resetInputSchema } from '@/schemas/authSchema';
import { IResetJwtPayload, TResetFormFields } from '@/types/auth';

export default function Reset() {
  const [userData, setUserData] = useState<TResetFormFields>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const authToken = searchParams.get(AUTH_TOKEN);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<TResetFormFields>({
    resolver: zodResolver(resetInputSchema),
  });

  const {
    data: user,
    isValidating,
    error,
  } = useSWR(userData ? getResetObj(userData) : null);

  useEffect(() => {
    if (user) {
      if (user.status === SUCCESS_CODES.OK) {
        toast.success('Reset Link Generated', {
          description: 'Check your mail!',
          duration: 5000,
        });
      } else if (user.status === SUCCESS_CODES.CREATED) {
        toast.success(`${user?.data?.message}`, {
          description: 'You are all Set!',
          duration: 5000,
        });
        navigate(CLIENT_ROUTES.AUTH_LOGIN);
      }
    } else if (error) {
      toast.error(`${error?.message}`, {
        description: error?.response?.data?.message,
        duration: 5000,
      });
    }
  }, [user, error]);

  const onSubmit: SubmitHandler<TResetFormFields> = (formData) => {
    if (authToken) {
      const payload: IResetJwtPayload = jwtDecode(authToken);
      setUserData({
        ...formData,
        action: 'RESET',
        authToken,
        email: payload.email,
      });
    } else {
      setUserData({ ...formData, action: 'EMAIL' });
    }
  };

  return (
    <div className="p-4 h-screen lg:grid lg:grid-cols-2 lg:gap-x-4">
      <div className="h-full lg:col-span-1 py-12 ">
        <div className=" max-w-[360px] mx-auto mt-12 min-h-[100px] flex flex-col items-center gap-y-8">
          <div className="flex flex-col items-center gap-y-4">
            <img src={LogoBanner} alt="" className="w-[180px]" />
            <div>
              <h1 className="text-3xl font-semibold text-center">
                {authToken ? 'Just one more step!' : 'Forgot your Password?'}
              </h1>
              <h3 className="text-sm opacity-60 mt-2 text-center">
                {authToken
                  ? 'Enter your new password...'
                  : 'Enter your details to recover!'}
              </h3>
            </div>
          </div>
          <form className="w-full relative" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-y-2">
              {!authToken && <Email register={register} errors={errors} />}
              {authToken && <Update register={register} errors={errors} />}
            </div>
            <Button
              type="submit"
              className="w-full mt-8"
              disabled={isSubmitting || isValidating}
            >
              {authToken ? 'Update' : 'Send Mail'}
              {(isSubmitting || isValidating) && (
                <Spinner className="w-4 h-4 ml-3 " />
              )}
            </Button>
          </form>
        </div>
      </div>
      <div className="hidden bg-reset-banner bg-no-repeat bg-cover bg-right lg:block lg:col-span-1 lg:rounded-3xl" />
    </div>
  );
}
