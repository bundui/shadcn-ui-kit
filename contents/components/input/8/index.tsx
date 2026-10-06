import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText
} from "@/components/ui/input-group";

export default function Component() {
  return (
    <InputGroup className="max-w-sm">
      <InputGroupInput placeholder="google.com" />
      <InputGroupAddon align="inline-end">
        <InputGroupText>.com</InputGroupText>
      </InputGroupAddon>
    </InputGroup>
  );
}
