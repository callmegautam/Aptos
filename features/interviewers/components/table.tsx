'use client';

import { type ColumnDef } from '@tanstack/react-table';

import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import UniversalTable from '@/components/universal-table';
import Actions from '@/components/ui/actions';
import TableAvatar from '@/components/ui/table-avatar';

type Status = 'active' | 'inactive';

interface Item {
  id: number;
  avatar: string | null;
  name: string;
  email: string;
  phone: string;
  total_interviews: number;
  status: Status;
}

type InterviewersTableProps = {
  items: Item[];
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
};

const statusConfig: Record<Status, { label: string; className: string }> = {
  active: {
    label: 'Active',
    className: 'bg-emerald-500/15 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
  },
  inactive: {
    label: 'Inactive',
    className: 'bg-amber-500/15 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400'
  }
};

function StatusBadge({ status }: { status: Status }) {
  const config = statusConfig[status];
  return (
    <Badge variant="outline" className={cn('border-0', config.className)}>
      {config.label}
    </Badge>
  );
}

const createColumns = ({
  onEdit,
  onDelete
}: {
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
}): ColumnDef<Item>[] => [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'avatar',
    header: 'Avatar',
    cell: ({ row }) => {
      const avatar = row.getValue('avatar') as string | null;

      return <TableAvatar avatar={avatar} name={row.getValue('name')} />;
    }
  },
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => <span className="font-medium">{row.getValue('name')}</span>
  },
  {
    accessorKey: 'email',
    header: 'Email'
  },
  {
    accessorKey: 'phone',
    header: 'Phone No'
  },
  {
    accessorKey: 'total_interviews',
    header: 'Total Interviews',
    cell: ({ row }) => <div className="font-medium">{row.getValue('total_interviews')}</div>
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <StatusBadge status={row.getValue('status')} />
  },

  {
    id: 'actions',
    cell: ({ row }) => {
      const id = row.original.id;

      return <Actions id={id} onEdit={onEdit} onDelete={onDelete} />;
    }
  }
];

export type InterviewersTableItem = Item;

export default function InterviewersTable({ items, onEdit, onDelete }: InterviewersTableProps) {
  const columns = createColumns({ onEdit, onDelete });
  return <UniversalTable columns={columns} data={items} />;
}

// export default function InterviewersTable({
//   items,
//   onEdit,
//   onDelete
// }: InterviewersTableProps) {
//   const [sorting, setSorting] = useState<SortingState>([]);
//   const [rowSelection, setRowSelection] = useState({});
//   const [globalFilter, setGlobalFilter] = useState('');

//   const columns = createColumns({ onEdit, onDelete });

//   const table = useReactTable({
//     data: items,
//     columns,
//     getCoreRowModel: getCoreRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//     onSortingChange: setSorting,
//     onRowSelectionChange: setRowSelection,
//     onGlobalFilterChange: setGlobalFilter,
//     globalFilterFn: 'includesString',
//     state: {
//       sorting,
//       rowSelection,
//       globalFilter
//     },
//     initialState: {
//       pagination: { pageSize: 5 }
//     }
//   });

//   const pageCount = table.getPageCount();
//   const currentPage = table.getState().pagination.pageIndex + 1;

//   return (
//     <div className="w-full space-y-4  px-10">
//       <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//         <div className="flex items-center gap-2">
//           <span className="text-sm text-muted-foreground">Show</span>
//           <Select
//             value={String(table.getState().pagination.pageSize)}
//             onValueChange={(value) => table.setPageSize(Number(value))}
//           >
//             <SelectTrigger className="h-8 w-16">
//               <SelectValue />
//             </SelectTrigger>
//             <SelectContent>
//               {[5, 10, 20].map((size) => (
//                 <SelectItem key={size} value={String(size)}>
//                   {size}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//           <span className="text-sm text-muted-foreground">entries</span>
//         </div>
//         <Input
//           placeholder="Search..."
//           value={globalFilter}
//           onChange={(e) => setGlobalFilter(e.target.value)}
//           className="h-8 w-full sm:w-64"
//         />
//       </div>

//       <div className="rounded-lg border">
//         <Table>
//           <TableHeader>
//             {table.getHeaderGroups().map((headerGroup) => (
//               <TableRow key={headerGroup.id}>
//                 {headerGroup.headers.map((header) => (
//                   <TableHead key={header.id}>
//                     {header.isPlaceholder
//                       ? null
//                       : flexRender(header.column.columnDef.header, header.getContext())}
//                   </TableHead>
//                 ))}
//               </TableRow>
//             ))}
//           </TableHeader>
//           <TableBody>
//             {table.getRowModel().rows.length ? (
//               table.getRowModel().rows.map((row) => (
//                 <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
//                   {row.getVisibleCells().map((cell) => (
//                     <TableCell key={cell.id}>
//                       {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                     </TableCell>
//                   ))}
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell colSpan={columns.length} className="h-24 text-center">
//                   No results.
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </div>

//       <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//         <p className="text-pretty text-sm text-muted-foreground">
//           Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}{' '}
//           to{' '}
//           {Math.min(
//             (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
//             table.getFilteredRowModel().rows.length
//           )}{' '}
//           of {table.getFilteredRowModel().rows.length} entries
//         </p>
//         <div className="flex items-center gap-1">
//           <Button
//             variant="outline"
//             size="icon"
//             className="h-8 w-8"
//             onClick={() => table.previousPage()}
//             disabled={!table.getCanPreviousPage()}
//             aria-label="Previous page"
//           >
//             <ChevronLeft className="h-4 w-4" />
//             <span className="sr-only">Previous page</span>
//           </Button>
//           {Array.from({ length: pageCount }, (_, i) => i + 1).map((page) => (
//             <Button
//               key={page}
//               variant={currentPage === page ? 'default' : 'outline'}
//               size="icon"
//               className="h-8 w-8"
//               onClick={() => table.setPageIndex(page - 1)}
//               aria-label={`Go to page ${page}`}
//             >
//               {page}
//             </Button>
//           ))}
//           <Button
//             variant="outline"
//             size="icon"
//             className="h-8 w-8"
//             onClick={() => table.nextPage()}
//             disabled={!table.getCanNextPage()}
//             aria-label="Next page"
//           >
//             <ChevronRight className="h-4 w-4" />
//             <span className="sr-only">Next page</span>
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }
