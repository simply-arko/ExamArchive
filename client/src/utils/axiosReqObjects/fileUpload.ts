import { SERVER_ROUTES } from '@/constants/routes';
import { TFileUploadFormFields } from '@/types/upload';

export default ({
  fileUploadData,
  jwtToken,
}: {
  fileUploadData: TFileUploadFormFields[];
  jwtToken: string;
}) => {
  const url = SERVER_ROUTES.UPLOAD;
  if (!jwtToken) return null;
  const axiosObj = {
    url,
    data: { data: fileUploadData },
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwtToken}`,
    },
    withCredentials: true,
  };

  return axiosObj;
};
