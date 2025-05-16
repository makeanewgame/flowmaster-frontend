import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Chip,
  Pagination,
} from "@heroui/react";
import { useCallback, useMemo, useState } from "react";
import { VerticalDotsIcon } from "./Icons/VerticalDotsIcon";
import { SearchIcon } from "@/pages/Icons";

export const columns = [
  { name: "ID", uid: "id", sortable: true, hidden: true },
  { name: "FILE", uid: "file", sortable: true },
  { name: "DATE", uid: "date", sortable: true },
  { name: "CHARACTER", uid: "character", sortable: true },
  { name: "TYPE", uid: "type", sortable: true },
  { name: "RETRAIN", uid: "retrain" },
  { name: "STATUS", uid: "status", sortable: true },
  { name: "ACTIONS", uid: "actions" },
];

export const statusOptions = [
  { name: "Active", uid: "active" },
  { name: "Paused", uid: "paused" },
  { name: "Vacation", uid: "vacation" },
];

export function capitalize(s: string) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";
}

interface FileTableProps {
  fileList: any[];
  handleDelete: (id: any) => void;
}

const statusColorMap: Record<
  string,
  "default" | "primary" | "secondary" | "success" | "warning" | "danger"
> = {
  INDEXED: "success",
  paused: "danger",
  UPLOADED: "warning",
};

export default function FileTable({ fileList, handleDelete }: FileTableProps) {
  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<Set<string | number>>(
    new Set([])
  );

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortDescriptor, setSortDescriptor] = useState<{
    column: string | number;
    direction: "ascending" | "descending";
  }>({
    column: "age",
    direction: "ascending",
  });
  const [page, setPage] = useState(1);

  const pages = Math.ceil(fileList.length / rowsPerPage);

  const hasSearchFilter = Boolean(filterValue);

  const filteredItems = useMemo(() => {
    let filteredUsers = [...fileList];
    return filteredUsers;
  }, [fileList]);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = useCallback((file: any, columnKey: any) => {
    const cellValue = file[columnKey];

    switch (columnKey) {
      case "file":
        return <div>{file.file}</div>;
      case "role":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">{cellValue}</p>
            <p className="text-bold text-tiny capitalize text-default-500">
              {file.team}
            </p>
          </div>
        );
      case "date":
        return <div>{new Date(file.date).toLocaleDateString()}</div>;
      case "status":
        return (
          <div className="flex items-center gap-2">
            <Chip
              className="capitalize border-none gap-1 text-default-600"
              color={
                statusColorMap[file.status as keyof typeof statusColorMap] ||
                "default"
              }
              size="sm"
              variant="dot"
            >
              {cellValue}
            </Chip>
            {file.status === "UPLOADED" && (
              <svg
                className="animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                width="26"
                height="26"
                viewBox="0 0 26 26"
                fill="none"
              >
                <circle cx="13" cy="13" r="13" fill="#D9D9D9" />
                <path
                  d="M26 13C26 14.7072 25.6637 16.3977 25.0104 17.9749C24.3571 19.5521 23.3995 20.9852 22.1924 22.1924C20.9852 23.3995 19.5521 24.3571 17.9749 25.0104C16.3977 25.6637 14.7072 26 13 26L13 13L26 13Z"
                  fill="#006EFF"
                />
                <circle cx="13" cy="13" r="8" fill="white" />
              </svg>
            )}
          </div>
        );
      case "actions":
        return (
          <div className="relative flex justify-end items-center gap-2">
            <Dropdown className="bg-background border-1 border-default-200">
              <DropdownTrigger>
                <Button isIconOnly radius="full" size="sm" variant="light">
                  <VerticalDotsIcon className="text-default-400" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem key="view">View</DropdownItem>
                <DropdownItem key="edit">Edit</DropdownItem>

                <DropdownItem
                  key="delete"
                  onPress={() => {
                    handleDelete(file.id);
                  }}
                >
                  Delete
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  const onRowsPerPageChange = useCallback((e: any) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const onSearchChange = useCallback((value: any) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            classNames={{
              base: "w-full sm:max-w-[44%]",
              inputWrapper: "border-1",
            }}
            placeholder="Search by name..."
            size="sm"
            startContent={<SearchIcon className="text-default-300" />}
            value={filterValue}
            variant="bordered"
            onClear={() => setFilterValue("")}
            onValueChange={onSearchChange}
          />
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {fileList.length}
          </span>
        </div>
      </div>
    );
  }, [
    filterValue,

    onSearchChange,
    onRowsPerPageChange,
    fileList.length,
    hasSearchFilter,
  ]);

  const bottomContent = useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <Pagination
          showControls
          isDisabled={hasSearchFilter}
          page={page}
          total={pages}
          variant="light"
          onChange={setPage}
        />
        <span className="text-small text-default-400">
          {selectedKeys.has("all")
            ? "All items selected"
            : `${selectedKeys.size} of ${items.length} selected`}
        </span>
      </div>
    );
  }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

  const classNames = useMemo(
    () => ({
      base: "h-full grow",

      wrapper: ["h-full"],
      th: ["bg-transparent", "text-default-500", "border-b", "border-divider"],
      tr: ["border-b", "border-divider", "h-12"],
      td: [
        // changing the rows border radius
        // first
        "h-12",
        "group-data-[first=true]/tr:first:before:rounded-none",
        "group-data-[first=true]/tr:last:before:rounded-none",
        // middle
        "group-data-[middle=true]/tr:before:rounded-none",
        // last
        "group-data-[last=true]/tr:first:before:rounded-none",
        "group-data-[last=true]/tr:last:before:rounded-none",
      ],
    }),
    []
  );

  return (
    <Table
      removeWrapper={true}
      fullWidth={true}
      layout="auto"
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
      classNames={classNames}
      selectedKeys={selectedKeys}
      selectionMode="multiple"
      sortDescriptor={sortDescriptor}
      topContent={topContent}
      aria-label="File Table"
      topContentPlacement="outside"
      onSelectionChange={(keys) => {
        if (keys instanceof Set) {
          setSelectedKeys(keys);
        } else {
          setSelectedKeys(new Set([keys.toString()]));
        }
      }}
      onSortChange={(descriptor) =>
        setSortDescriptor(
          descriptor as {
            column: string | number;
            direction: "ascending" | "descending";
          }
        )
      }
    >
      <TableHeader columns={columns.filter((column) => !column.hidden)}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === "actions" ? "center" : "start"}
            allowsSorting={column.sortable}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody emptyContent={"No fileList found"} items={sortedItems}>
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
