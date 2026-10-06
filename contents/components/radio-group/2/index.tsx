import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const RadioGroupHorizontalDemo = () => {
  return (
    <RadioGroup defaultValue="email" className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <RadioGroupItem value="email" id="email" />
        <Label htmlFor="email">Email</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="sms" id="sms" />
        <Label htmlFor="sms">SMS</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="push" id="push" />
        <Label htmlFor="push">Push</Label>
      </div>
    </RadioGroup>
  );
};

export default RadioGroupHorizontalDemo;
