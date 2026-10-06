"use client";

import { useMemo, useState } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface ChildItem {
  id: string;
  label: string;
}

const childItems: ChildItem[] = [
  { id: "child1", label: "Read" },
  { id: "child2", label: "Write" },
  { id: "child3", label: "Delete" },
];

export default function Component() {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>(
    childItems.reduce((acc, item) => ({ ...acc, [item.id]: false }), {}),
  );

  const parentState = useMemo<boolean | "indeterminate">(() => {
    const checkedCount = Object.values(checkedItems).filter(Boolean).length;
    if (checkedCount === 0) return false;
    if (checkedCount === childItems.length) return true;
    return "indeterminate";
  }, [checkedItems]);

  const handleParentChange = (checked: boolean | "indeterminate") => {
    const isChecked = checked === true;
    const newState = childItems.reduce(
      (acc, item) => ({ ...acc, [item.id]: isChecked }),
      {},
    );
    setCheckedItems(newState);
  };

  const handleChildChange = (
    id: string,
    checked: boolean | "indeterminate",
  ) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: checked === true,
    }));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        <Checkbox
          checked={parentState}
          id="parent"
          onCheckedChange={handleParentChange}
        />
        <Label className="font-semibold" htmlFor="parent">
          Select all permissions
        </Label>
      </div>
      <div className="ml-6 space-y-2">
        {childItems.map((item) => (
          <div key={item.id} className="flex items-center space-x-2">
            <Checkbox
              checked={checkedItems[item.id]}
              id={item.id}
              onCheckedChange={(checked) => handleChildChange(item.id, checked)}
            />
            <Label htmlFor={item.id}>{item.label}</Label>
          </div>
        ))}
      </div>
    </div>
  );
}
