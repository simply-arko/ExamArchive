import { useParams } from 'react-router-dom';
import useSWR from 'swr';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { getFileObj } from '@/utils/axiosReqObjects';
import { SUCCESS_CODES } from '@/constants/statusCodes';
import { IFileData } from '@/types/file';
import { PDFViewer } from './PDFViewer/PDFViewer';
import RatingSection from './RatingSection/RatingSection';
import TagsSection from './TagsSection/TagsSection';
import { WFullSekelton } from '@/components/Skeleton';
import HeaderStrip from './HeaderStrip/HeaderStrip';
import BasicInfo from './BasicInfo/BasicInfo';
import {
  BasicInfoShimmer,
  HeaderStripShimmer,
  PDFViewerShimmer,
  RatingSectionShimmer,
} from '../Shimmer/Shimmer';

export default function PreviewContent() {
  const [fileData, setFileData] = useState<IFileData>();
  const { paperid } = useParams();

  const {
    data: response,
    error,
    isLoading,
    mutate,
  } = useSWR(paperid ? getFileObj(paperid) : null);

  const parseToJSON = async () => {
    const parsedData = await JSON.parse(response.data.data);
    setFileData(parsedData);
  };

  useEffect(() => {
    if (response) {
      if (response.status === SUCCESS_CODES.OK) {
        parseToJSON();
      } else {
        toast.error('Something went wrong!', {
          duration: 5000,
        });
      }
    }
    if (error) {
      toast.error(`${error?.message}`, {
        description: error?.response?.data?.message,
        duration: 5000,
      });
    }
  }, [response, error]);

  return (
    <>
      {isLoading ? (
        <WFullSekelton className="w-3/5 h-8 rounded-lg" />
      ) : (
        <h1 className="text-xl font-medium p-4 sm:text-4xl">
          <p>
            {fileData?.subjectName} ({fileData?.subjectCode})
          </p>
        </h1>
      )}
      {isLoading ? (
        <HeaderStripShimmer className="flex flex-row p-4 justify-between" />
      ) : (
        fileData &&
        paperid && (
          <HeaderStrip
            className="flex flex-row px-4 justify-between"
            fileData={fileData}
            paperId={paperid}
          />
        )
      )}
      <div className="grid grid-cols-1 sm:grid-cols-6 sm:grid-rows-3">
        <div className="col-span-1 sm:col-span-3 sm:row-span-3 p-4">
          {isLoading ? (
            <PDFViewerShimmer />
          ) : (
            fileData && <PDFViewer pdfURL={fileData.file.url} />
          )}
        </div>
        {isLoading ? (
          <BasicInfoShimmer className="col-span-1 row-start-1 flex flex-col gap-y-2 text-sm sm:text-lg sm:col-span-3 sm:row-span-1 p-4" />
        ) : (
          fileData && (
            <BasicInfo
              className="col-span-1 row-start-1 flex flex-col gap-y-2 text-sm sm:text-lg sm:col-span-3 sm:row-span-1 p-4"
              fileData={fileData}
            />
          )
        )}
        <div className="col-span-1 sm:col-span-3 sm:row-span-1 p-4">
          {isLoading ? (
            <RatingSectionShimmer />
          ) : (
            paperid &&
            fileData && (
              <RatingSection postId={paperid} rating={fileData.rating} />
            )
          )}
        </div>
        <div className="col-span-1 sm:col-span-3 sm:row-span-1 p-4">
          {fileData && paperid && (
            <TagsSection
              tags={fileData.tags}
              mutate={mutate}
              postId={paperid}
            />
          )}
        </div>
      </div>
    </>
  );
}
