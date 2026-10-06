import { ButtonGroup } from "@/components/ui/button-group";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CURRENCIES = [
  {
    value: "$",
    label: "US Dollar",
  },
  {
    value: "€",
    label: "Euro",
  },
  {
    value: "£",
    label: "British Pound",
  },
];

export default function ButtonGroupComponent() {
  return (
    <ButtonGroup>
      <Select defaultValue="$">
        <SelectTrigger>
          <SelectValue placeholder="Select status" />
        </SelectTrigger>
        <SelectContent position="popper" className="min-w-0">
          <SelectGroup>
            {CURRENCIES.map((currency) => (
              <SelectItem key={currency.value} value={currency.value}>
                {currency.value}{" "}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Input placeholder="10.00" pattern="[0-9]*" className="max-w-24" />
    </ButtonGroup>
  );
}
