import React from 'react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from './dropdown-menu';
import { Button } from './button';
import { MoreHorizontal, Eye, Pencil, Trash2, View } from 'lucide-react';
type ActionsProps = {
  id: number;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
};

function Actions({ id, onEdit, onDelete }: ActionsProps) {
  return (
    <div className="text-right">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem disabled>
            <Eye className="mr-2 h-4 w-4" />
            View details
          </DropdownMenuItem>
          {onEdit && (
            <DropdownMenuItem onClick={() => onEdit(id)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          {onDelete && (
            <DropdownMenuItem className="text-destructive" onClick={() => onDelete(id)}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default Actions;
