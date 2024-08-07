import { Accordion, AccordionItem, Button } from '@nextui-org/react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { IoFilter } from 'react-icons/io5';
import { TbFilterSearch } from 'react-icons/tb';
import { AxiosRequestConfig } from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { LuCheckCircle } from 'react-icons/lu';
import { MdClear } from 'react-icons/md';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { SERVER_ROUTES } from '@/constants/routes';
import { useSearch } from '@/hooks/useSearch';
import { IFilterInputs, TFilterOption } from '@/types/search';
import { SEARCH_FILTTER_OPTIONS as CONST_SEARCH_FILTTER_OPTIONS } from '@/constants/search';
import OptionGroup from './OptionGroup/OptionGroup';
import fetcher from '@/utils/fetcher/fetcher';

export function SearchFilterSheet() {
  const { setFilters, searchInputs, clearFilters } = useSearch();
  const [filter, setFilter] = useState<IFilterInputs>({
    subjectName: undefined,
    examType: undefined,
    year: undefined,
    sortFilter: undefined,
  });
  // eslint-disable-next-line camelcase
  const [SEARCH_FILTTER_OPTIONS, setSEARCH_FILTTER_OPTIONS] = useState<
    Array<TFilterOption>
  >(CONST_SEARCH_FILTTER_OPTIONS);

  const handleGetSubjectFilters = useCallback(async () => {
    if (
      SEARCH_FILTTER_OPTIONS.find(({ key }) => key === 'subjectName') !==
      undefined
    ) {
      return;
    }

    const requestObj: AxiosRequestConfig<any> = {
      url: `${SERVER_ROUTES.SEARCH}/getSubjectFilters`,
      method: 'GET',
    };

    try {
      const response = await fetcher(requestObj);

      const newOptions: TFilterOption = {
        component: 'autocomplete',
        key: 'subjectName',
        label: 'Subject Name',
        options: response.data.data.map((subjectName: any) => ({
          label: subjectName,
        })),
        multiple: false,
      };
      setSEARCH_FILTTER_OPTIONS((prev) => [...prev, newOptions]);
    } catch (err: any) {
      console.warn(err);
    }
  }, []);

  useEffect(() => {
    handleGetSubjectFilters();
  }, []);

  useEffect(() => {
    const { subjectName, examType, year, sortFilter } = searchInputs;
    setFilter({ subjectName, examType, year, sortFilter });
  }, [JSON.stringify(searchInputs)]);

  const handleApplyFilters = () => {
    setFilters(filter);
  };
  const handleClearFilters = () => {
    clearFilters();
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          isIconOnly
          color="default"
          aria-label="filter"
          variant="bordered"
        >
          <TbFilterSearch className="text-lg" />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col gap-y-4 w-[320px] font-natosans dark:bg-[#191919]">
        <SheetHeader>
          <SheetTitle className="flex flex-row gap-x-4 ">
            <IoFilter className="text-2xl font-bold text-slate-400" />{' '}
            <span className="text-slate-400">FILTER OPTIONS</span>
          </SheetTitle>
        </SheetHeader>
        <div className="no-scrollbar overflow-y-auto h-[100%]">
          <Accordion>
            {SEARCH_FILTTER_OPTIONS.map(
              ({ key, label, options, component, multiple }, index) => (
                <AccordionItem
                  key={key}
                  aria-label={key}
                  title={
                    <p className="text-base font-bold dark:text-slate-400 text-slate-600">
                      {label}
                    </p>
                  }
                >
                  {component === 'radio' && (
                    <OptionGroup
                      key={index}
                      multiple={multiple}
                      filter={filter}
                      setFilter={setFilter}
                      filterKey={key}
                      options={options as Record<string, string>}
                    />
                  )}
                  {component === 'autocomplete' && (
                    <Autocomplete
                      disablePortal
                      options={
                        options as Array<{
                          label: string;
                        }>
                      }
                      renderInput={(params) => (
                        <TextField {...params} label="Subject Name" />
                      )}
                      value={{
                        label: filter[key as keyof IFilterInputs] ?? '',
                      }}
                      onChange={(_, newValue) => {
                        setFilter((prevState) => ({
                          ...prevState,
                          [key]: newValue?.label as any,
                        }));
                      }}
                    />
                  )}
                </AccordionItem>
              )
            )}
          </Accordion>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <div className="flex flex-col gap-y-4 w-[100%]">
              <Button
                className="w-[100%] text-md"
                type="submit"
                variant="bordered"
                color="primary"
                radius="sm"
                startContent={<LuCheckCircle />}
                onClick={handleApplyFilters}
              >
                APPLY ALL
              </Button>
              <Button
                className="w-[100%] text-md"
                type="submit"
                variant="bordered"
                color="danger"
                radius="sm"
                startContent={<MdClear />}
                onClick={handleClearFilters}
              >
                CLEAR ALL
              </Button>
            </div>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
