"use client";

import { useState } from "react";
import { MinusIcon, PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Input } from "@/components/ui/input";

export default function ButtonGroupComponent() {
  const [value, setValue] = useState<number>(1);

  const handleIncrement = () => setValue((prev) => prev + 1);
  const handleDecrement = () => setValue((prev) => (prev > 1 ? prev - 1 : 1));

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
    if (!isNaN(newValue) && newValue > 0) {
      setValue(newValue);
    } else if (e.target.value === "") {
      setValue(1);
    }
  };

  return (
    <ButtonGroup aria-label="Quantity selector">
      <Button variant="outline" size="icon" onClick={handleDecrement}>
        <MinusIcon />
      </Button>
      <Input
        readOnly
        value={value}
        onChange={handleInputChange}
        className="max-w-12 text-center"
        min={1}
      />
      <Button variant="outline" size="icon" onClick={handleIncrement}>
        <PlusIcon />
      </Button>
    </ButtonGroup>
  );
}
