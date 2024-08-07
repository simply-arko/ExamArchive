/* eslint-disable function-paren-newline */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-nested-ternary */
import {
  Breadcrumbs,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  Pagination,
  SortDescriptor,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  useDisclosure,
  BreadcrumbItem,
  Spinner,
} from '@nextui-org/react';
import { Key, useCallback, useMemo, useState } from 'react';
import useSWR from 'swr';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { FaFolderOpen } from 'react-icons/fa';
import { FaEllipsisVertical } from 'react-icons/fa6';
import { IoMdAddCircleOutline } from 'react-icons/io';
import { MdDriveFileRenameOutline } from 'react-icons/md';
import { IoSearch } from 'react-icons/io5';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { folderColumns, monthNames } from '@/constants/shared';
import { TAction, IFolder } from '@/types/folder';
import { deleteFolderObj, getFilesDataObj } from '@/utils/axiosReqObjects';
import { useAuth } from '@/hooks/useAuth';
import { parseUTC } from '@/utils/helpers';
import fetcher from '@/utils/fetcher/fetcher';
import RenderItems from '../Pagination/RenderItems';
import WarningModal from '../WarningModal/WarningModal';
import NewFolderModal from '../NewFolderModal/NewFolderModal';
import RenameFolderModal from '../RenameFolderModal/RenameFolderModal';

export default function TabularFolderView({
  actionVarient,
}: {
  actionVarient: TAction;
}) {
  const {
    authState: { jwtToken },
  } = useAuth();
  const {
    isOpen: isCreateFolderOpen,
    onOpen: onCreateFolderOpen,
    onClose: onCreateFolderClose,
    onOpenChange: onCreateFolderOpenChange,
  } = useDisclosure();
  const {
    isOpen: isRenameFolderOpen,
    onOpen: onRenameFolderOpen,
    onClose: onRenameFolderClose,
    onOpenChange: onRenameFolderOpenChange,
  } = useDisclosure();
  const {
    isOpen: isWarningOpen,
    onOpen: onWarningOpen,
    onClose: onWarningClose,
    onOpenChange: onWarningOpenChange,
  } = useDisclosure();

  const [deletefolderId, setDeleteFolderId] = useState<string>();
  const [renamefolderInfo, setRenamefolderInfo] = useState<{
    folderId: string;
    folderName: string;
  }>();
  const {
    data: response,
    mutate,
    isLoading,
  } = useSWR(
    getFilesDataObj({ action: actionVarient, parentId: '' }, jwtToken)
  );

  const navigate = useNavigate();
  const folders: Array<IFolder> = response?.data.files ?? [];

  const [filterValue, setFilterValue] = useState('');
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({});
  const [page, setPage] = useState<number>(1);

  const hasSearchFilter = Boolean(filterValue);
  const ROWS_PER_PAGE = 10;

  const filteredItems = useMemo(() => {
    let filteredFolders = [...folders];

    if (hasSearchFilter) {
      filteredFolders = filteredFolders.filter((folder) =>
        folder.name.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    return filteredFolders;
  }, [response, filterValue]);

  const pages = Math.max(Math.ceil(filteredItems.length / ROWS_PER_PAGE), 0);

  const handleDelete = useCallback(async (folderId: string) => {
    const reqObj = deleteFolderObj(
      { action: actionVarient, folderId },
      jwtToken
    );
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
      toast.success('Folder deleted successfully!', {
        duration: 5000,
      })
    );
  }, []);
  const handleDeleteWarning = () => {
    if (deletefolderId) handleDelete(deletefolderId);
  };
  const deleteModalOpen = (id: string) => {
    setDeleteFolderId(id);
    onWarningOpen();
  };
  const renameModalOpen = (id: string, name: string) => {
    setRenamefolderInfo({ folderId: id, folderName: name });
    onRenameFolderOpen();
  };

  const sortedItems = useMemo(
    () =>
      [...filteredItems].sort((a: IFolder, b: IFolder) => {
        const first = a[sortDescriptor.column as keyof IFolder] as string;
        const second = b[sortDescriptor.column as keyof IFolder] as string;
        // eslint-disable-next-line no-magic-numbers
        const cmp = first < second ? -1 : first > second ? 1 : 0;

        return sortDescriptor.direction === 'descending' ? -cmp : cmp;
      }),
    [sortDescriptor, filteredItems, response]
  );

  const iconClasses = 'text-xl pointer-events-none flex-shrink-0';

  const items = useMemo(() => {
    const start = (page - 1) * ROWS_PER_PAGE;
    const end = start + ROWS_PER_PAGE;

    return sortedItems.slice(start, end);
  }, [page, sortedItems, ROWS_PER_PAGE]);

  const renderCell = useCallback((folder: IFolder, columnKey: Key) => {
    const cellValue = folder[columnKey as keyof IFolder];
    const { day, month, year } = parseUTC(cellValue as string);

    switch (columnKey) {
      case 'name':
        return (
          <div className="min-w-[250px] flex flex-row gap-x-2 cursor-pointer">
            <FaFolderOpen className="self-center text-4xl text-[#fcba03]" />
            <div className="flex flex-col self-center">
              <span className="self-center font-medium text-sm min-w-[120px]">
                {cellValue}
              </span>
              {actionVarient === 'UPLOAD' && (
                <span className="text-sm opacity-55">
                  File count: {folder.noOfFiles ?? 0}
                </span>
              )}
            </div>
          </div>
        );
      case 'createdAt':
        return (
          <div className="min-w-[100px] font-medium opacity-65">
            {monthNames[month]} {day}, {year}
          </div>
        );
      default:
        return (
          <div className="font-medium min-w-[120px] flex flex-row justify-between opacity-65">
            <span className="self-center">
              {monthNames[month]} {day}, {year}
            </span>
            <Dropdown radius="sm" className="font-natosans">
              <DropdownTrigger>
                <Button
                  variant="light"
                  size="sm"
                  isIconOnly
                  className="self-center"
                >
                  <FaEllipsisVertical className="text-lg" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Static Actions" variant="light">
                <DropdownItem
                  key="delete"
                  startContent={<RiDeleteBin6Line className={iconClasses} />}
                  onPress={() => deleteModalOpen(folder._id)}
                >
                  Delete Folder
                </DropdownItem>
                <DropdownItem
                  key="rename"
                  startContent={
                    <MdDriveFileRenameOutline className={iconClasses} />
                  }
                  onPress={() => renameModalOpen(folder._id, folder.name)}
                >
                  Rename Folder
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
    }
  }, []);

  const onSearchChange = useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue('');
    }
  }, []);

  const onClear = useCallback(() => {
    setFilterValue('');
    setPage(1);
  }, []);

  const topContent = useMemo(
    () => (
      <>
        <div className="flex flex-row justify-between gap-x-2 mt-3">
          <Input
            isClearable
            radius="full"
            className="w-full sm:max-w-[32%]"
            placeholder="Search by folder name"
            startContent={<IoSearch className="text-xl" />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
            variant="bordered"
          />
          <Button
            color="primary"
            startContent={
              <IoMdAddCircleOutline className="text-xl hidden sm:block" />
            }
            radius="sm"
            variant="bordered"
            onClick={() => onCreateFolderOpen()}
          >
            Create new
          </Button>
        </div>
        <Breadcrumbs className="font-natosans my-3">
          <BreadcrumbItem href="/">Home</BreadcrumbItem>
          <BreadcrumbItem href="#">Folders</BreadcrumbItem>
        </Breadcrumbs>
      </>
    ),
    [filterValue, onSearchChange, hasSearchFilter]
  );

  const bottomContent = useMemo(
    () => (
      <div className="py-10 px-2 flex flex-row justify-end">
        <Pagination
          disableCursorAnimation
          showControls
          total={pages}
          initialPage={1}
          className="gap-2"
          radius="full"
          renderItem={RenderItems}
          onChange={setPage}
          variant="light"
        />
      </div>
    ),
    [items.length, page, pages, hasSearchFilter]
  );

  return (
    <div className="font-natosans">
      <Table
        aria-label="Example table with custom cells, pagination and sorting"
        isHeaderSticky
        bottomContent={pages >= 1 ? bottomContent : null}
        bottomContentPlacement="outside"
        sortDescriptor={sortDescriptor}
        topContent={topContent}
        topContentPlacement="outside"
        selectionMode="single"
        onRowAction={(key) => navigate(`${key}`)}
        radius="sm"
        onSortChange={setSortDescriptor}
      >
        <TableHeader columns={folderColumns}>
          {({ name, uid, sortable }) => (
            <TableColumn key={uid} allowsSorting={sortable} align="start">
              {name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          emptyContent="No folders found"
          items={items}
          isLoading={isLoading}
          loadingContent={<Spinner />}
        >
          {(item) => (
            <TableRow key={`${item._id}_${item.name}`}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      <RenameFolderModal
        folderType={actionVarient}
        isOpen={isRenameFolderOpen}
        mutate={mutate}
        onClose={onRenameFolderClose}
        onOpenChange={onRenameFolderOpenChange}
        folderInfo={renamefolderInfo}
      />
      <NewFolderModal
        folderType={actionVarient}
        isOpen={isCreateFolderOpen}
        mutate={mutate}
        onClose={onCreateFolderClose}
        onOpenChange={onCreateFolderOpenChange}
        folders={folders}
      />
      <WarningModal
        actionText="Delete"
        isOpen={isWarningOpen}
        onClose={onWarningClose}
        onOpenChange={onWarningOpenChange}
        eventHandler={handleDeleteWarning}
        actionType="folder"
      />
    </div>
  );
}
