/* eslint-disable no-nested-ternary */

/* eslint-disable require-await */
/* eslint-disable function-paren-newline */
import { Outlet, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  Button,
  Card,
  CardBody,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Tooltip,
} from '@nextui-org/react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { RiPushpinLine } from 'react-icons/ri';
import { AiOutlineFilePdf } from 'react-icons/ai';
import useSWR, { KeyedMutator, MutatorOptions } from 'swr';
import { createContext, useCallback, useContext } from 'react';
import { getPinnedFilesObj, togglePinObj } from '@/utils/axiosReqObjects';
import { useAuth } from '@/hooks/useAuth';
import { IPinnedFile } from '@/types/folder';
import { CLIENT_ROUTES } from '@/constants/routes';
import fetcher from '@/utils/fetcher/fetcher';
import {
  MAX_CHAR_DISPLAY,
  parseUTC,
  toCamelCase,
  wordShortner,
} from '@/utils/helpers';
import { monthNames } from '@/constants/shared';
import { IPinContext } from '@/types/bookmarks';
import { PinCardShimmer } from './Shimmer/Shimmer';

const defaultMutate: KeyedMutator<any> = async (
  _data?: any,
  _opts?: boolean | MutatorOptions<any>
) => Promise.resolve({});
const PinContext = createContext<IPinContext>({
  pinnedFiles: [],
  mutate: defaultMutate,
});

export default function Bookmarks() {
  const {
    authState: { jwtToken },
  } = useAuth();
  const navigate = useNavigate();
  const iconClasses = 'text-xl pointer-events-none flex-shrink-0';
  const {
    data: response,
    mutate,
    isLoading,
    isValidating,
  } = useSWR(getPinnedFilesObj(jwtToken));
  const pinnedFiles: Array<IPinnedFile> = response?.data?.files ?? [];

  const handleFilePin = useCallback(
    async (fileId: string, action: 'PIN' | 'UNPIN') => {
      const reqObj = togglePinObj({ fileId, action }, jwtToken);
      if (!reqObj) {
        toast.error('Something went wrong!', {
          duration: 5000,
        });
        return;
      }

      try {
        await fetcher(reqObj);
      } catch (err) {
        toast.error('Something went wrong!', {
          description: `${err}`,
          duration: 5000,
        });
        return;
      }
      mutate().then(() =>
        toast.success(
          `File ${action === 'PIN' ? 'Pinned' : 'Un-Pinned'} successfully!`,
          {
            duration: 5000,
          }
        )
      );
    },
    []
  );

  return (
    <div className="max-w-[1200px] mx-auto flex flex-col p-4 gap-y-4 font-natosans">
      <div className="text-xl flex flex-row gap-x-2 font-semibold dark:text-slate-400 text-slate-700">
        <span>Pinned</span> <RiPushpinLine className="self-center text-2xl" />
      </div>
      <div className="flex gap-4 flex-col sm:flex-row">
        {isLoading || isValidating ? (
          Array.from({ length: 3 }, (_, index) => (
            <PinCardShimmer key={index} />
          ))
        ) : pinnedFiles.length > 0 ? (
          pinnedFiles.map(({ name, questionId, fileId, updatedAt }) => {
            const { day, month, year } = parseUTC(updatedAt);
            const [subjectName] = name.split(',');
            return (
              <Card
                key={questionId}
                isPressable
                onPress={() => {
                  navigate(`${CLIENT_ROUTES.FILE_PREVIEW}/${questionId}`);
                }}
                className="w-full sm:w-1/3 font-natosans"
                radius="sm"
                style={{
                  boxShadow:
                    'rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.08) 0px 0px 0px 1px',
                }}
              >
                <CardBody className="flex flex-row gap-x-3">
                  <div className="self-center p-3 rounded-md">
                    <AiOutlineFilePdf className="text-3xl text-[#e81a0c]" />
                  </div>
                  <div className="grow font-medium tracking-wide flex flex-col gap-y-1">
                    <Tooltip
                      content={toCamelCase(subjectName)}
                      className="dark:text-slate-300 text-slate-700"
                      radius="sm"
                      placement="top"
                      delay={200}
                      showArrow
                      isDisabled={subjectName.length <= MAX_CHAR_DISPLAY}
                    >
                      {toCamelCase(wordShortner(subjectName))}
                    </Tooltip>
                    <span className="text-sm text-slate-500">
                      Added on: {`${monthNames[month]} ${day}, ${year}`}
                    </span>
                  </div>
                  <span className="w-fit h-fit ">
                    <Dropdown radius="sm" className="font-natosans">
                      <DropdownTrigger>
                        <Button
                          variant="light"
                          size="sm"
                          isIconOnly
                          className="self-center"
                        >
                          <BsThreeDotsVertical className="text-xl text-slate-600" />
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu aria-label="Static Actions" variant="light">
                        <DropdownItem
                          key="un-pinned"
                          startContent={
                            <RiPushpinLine className={iconClasses} />
                          }
                          onClick={() => handleFilePin(fileId, 'UNPIN')}
                        >
                          Un-Pin File
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </span>
                </CardBody>
              </Card>
            );
          })
        ) : (
          <div className="text-sm text-slate-500 my-3">
            Pinned files will appear here
          </div>
        )}
      </div>
      <PinContext.Provider
        // eslint-disable-next-line react/jsx-no-constructed-context-values
        value={{ pinnedFiles, mutate }}
      >
        <Outlet />
      </PinContext.Provider>
    </div>
  );
}

export const usePin = () => {
  const context = useContext(PinContext);

  if (context === undefined) {
    throw new Error('usePin must be used within a PinProvider');
  }

  return context;
};
