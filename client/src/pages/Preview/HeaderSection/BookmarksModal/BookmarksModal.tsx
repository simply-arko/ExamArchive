/* eslint-disable no-underscore-dangle */
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  CheckboxGroup,
  Checkbox,
} from '@nextui-org/react';
import React, { useCallback, useEffect, useState } from 'react';
import { MdAddCircleOutline } from 'react-icons/md';
import { CiBookmark } from 'react-icons/ci';
import useSWR from 'swr';
import { toast } from 'sonner';
import { FaFolderOpen } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import {
  createFolderObj,
  getFolderNameObj,
} from '@/utils/axiosReqObjects/folder';
import fetcher from '@/utils/fetcher/fetcher';
import { addToBookmarkObj } from '@/utils/axiosReqObjects/bookmarks';
import { KEY_CODES } from '@/constants/shared';
import { IsUserAuthenticated } from '@/utils/helpers';

export default function BookmarksModal({
  isOpen,
  onOpenChange,
  onClose,
  paperid,
  subjectName,
  subjectCode,
  semester,
  year,
}: {
  isOpen: boolean;
  onOpenChange: () => void;
  onClose: () => void;
  paperid: string;
  subjectName: string;
  subjectCode: string;
  semester: string;
  year: string;
}) {
  const [collectionName, setCollectionName] = useState<string>('');
  const [isCreatingFolder, setIsCreatingFolder] = useState<boolean>(false);
  const [collectionIDs, setCollectionIDs] = useState<Array<string>>([]);
  const {
    authState: { jwtToken, isAuth },
  } = useAuth();
  const { data: collection, mutate: mutateCollection } = useSWR(
    getFolderNameObj('BOOKMARK', jwtToken)
  );
  const collectionList: Array<{ _id: string; name: string }> | undefined =
    collection?.data?.data ?? undefined;
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    if (!isOpen) {
      setIsCreatingFolder(false);
      setCollectionIDs([]);
      setCollectionName('');
    }
  }, [isOpen]);

  const handleAddToBookmark = useCallback(
    (ids?: Array<string>) => {
      const idsToAdd = [...collectionIDs, ...(ids || [])];
      if (idsToAdd.length === 0) {
        toast.error('No collection(s) selected!', {
          duration: 5000,
        });
        return;
      }
      onClose();
      const filenameForBookmark = `${subjectName},${subjectCode},${semester},${year}`;
      idsToAdd.map(async (id) => {
        const bookmarkReqObj = addToBookmarkObj(
          { fileId: paperid, folderId: id, fileName: filenameForBookmark },
          jwtToken
        );
        if (!bookmarkReqObj) {
          toast.error('Somthing went wrong!', {
            duration: 5000,
          });
          return;
        }
        try {
          await fetcher(bookmarkReqObj);
        } catch (err: any) {
          toast.error('Somthing went wrong!', {
            description: `${err.response.data.message}`,
            duration: 5000,
          });
        }
      });
      toast.success('File bookmarked successfully!', {
        duration: 2000,
      });
      setCollectionIDs([]);
    },
    [collectionIDs]
  );

  const handleCreateNewCollection = useCallback(async () => {
    if (!IsUserAuthenticated(isAuth, navigate, pathname)) {
      return;
    }
    if (!isCreatingFolder) {
      setIsCreatingFolder(true);
      return;
    }

    if (collectionName.length === 0) {
      toast.error('Collection name should have atlease one character!', {
        duration: 5000,
      });
      return;
    }
    const folderDetails = createFolderObj(
      {
        folderName: collectionName,
        action: 'BOOKMARK',
      },
      jwtToken
    );
    if (!folderDetails) {
      toast('Somthing went wrong!', {
        duration: 5000,
      });
      return;
    }
    onClose();
    try {
      const res = await fetcher(folderDetails);
      handleAddToBookmark([res.data.data._id as string]);
    } catch (err: any) {
      toast('Somthing went wrong!', {
        description: `${err.response.data.message}`,
        duration: 5000,
      });
      setCollectionName('');
      return;
    }
    mutateCollection().then(() => {
      toast.success(`${collectionName} successfully created!`, {
        duration: 5000,
      });
    });
  }, [collectionName]);

  const handleSubmit = () => {
    if (collectionIDs.length === 0) handleCreateNewCollection();
    else handleAddToBookmark();
  };

  const handleKeyEvent = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.code === KEY_CODES.ENTER) handleSubmit();
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      placement="center"
      radius="sm"
      className="font-natosans"
      onKeyDown={handleKeyEvent}
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-row gap-x-3">
              <CiBookmark className="self-center text-2xl" />
              <span>Add to bookmark</span>
            </ModalHeader>
            <ModalBody>
              <CheckboxGroup
                color="secondary"
                onValueChange={setCollectionIDs}
                className="text-medium"
              >
                <div className="max-h-[200px] overflow-y-auto no-scrollbar flex flex-col gap-y-4">
                  {collectionList?.map(({ _id, name }) => (
                    <div className="flex flex-row justify-between" key={_id}>
                      <div className="flex flex-row gap-x-3">
                        <FaFolderOpen className="self-center text-2xl text-[#fcba03]" />
                        {name}
                      </div>
                      <Checkbox radius="full" value={_id} />
                    </div>
                  ))}
                </div>
              </CheckboxGroup>
              {isCreatingFolder && (
                <Input
                  radius="sm"
                  autoFocus
                  label="Enter Collection Tiile"
                  variant="bordered"
                  onValueChange={(e) => setCollectionName(e)}
                  isInvalid={collectionList
                    ?.map((val) => val.name)
                    .includes(collectionName)}
                  errorMessage="Collection already exists!"
                />
              )}
            </ModalBody>
            <ModalFooter>
              {/*  */}
              <Button
                radius="sm"
                color="default"
                variant="bordered"
                onPress={onClose}
              >
                Cancel
              </Button>
              <Button
                radius="sm"
                color="primary"
                variant="bordered"
                onPress={handleSubmit}
                {...(collectionIDs.length === 0 && {
                  endContent: <MdAddCircleOutline className="text-xl" />,
                })}
              >
                {collectionIDs.length === 0
                  ? `Create ${!isCreatingFolder ? 'new' : ''}`
                  : 'Add'}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
