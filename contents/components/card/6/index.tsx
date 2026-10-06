import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const attendees = [
  {
    name: "Olivia Martin",
    avatar: "https://i.pravatar.cc/150?u=olivia",
  },
  {
    name: "Isabella Nguyen",
    avatar: "https://i.pravatar.cc/150?u=isabella",
  },
  {
    name: "Sofia Davis",
    avatar: "https://i.pravatar.cc/150?u=sofia",
  },
];

export default function CardComponent() {
  return (
    <Card className="w-full max-w-lg shadow-none">
      <CardHeader>
        <CardTitle>Meeting Notes</CardTitle>
        <CardDescription>
          Transcript from the meeting with the client.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <p>
          Client requested dashboard redesign with focus on mobile
          responsiveness.
        </p>
        <ol className="list-inside list-decimal space-y-2">
          <li>New analytics widgets for daily/weekly metrics</li>
          <li>Simplified navigation menu</li>
          <li>Dark mode support</li>
          <li>Timeline: 6 weeks</li>
          <li>Follow-up meeting scheduled for next Tuesday</li>
        </ol>
      </CardContent>
      <CardFooter>
        <div className="flex -space-x-2">
          {attendees.map((attendee, index) => (
            <Avatar className="border-background border-2" key={index}>
              <AvatarImage alt={attendee.name} src={attendee.avatar} />
              <AvatarFallback>
                {attendee.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
          ))}
        </div>
      </CardFooter>
    </Card>
  );
}
