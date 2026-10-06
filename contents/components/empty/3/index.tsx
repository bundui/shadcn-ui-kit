import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export default function EmptyComponent() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia>
          <img
            className="w-40 grayscale dark:invert"
            src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iODExLjQ1MyIgaGVpZ2h0PSIzMTEuMzcyIiB2aWV3Qm94PSIwIDAgODExLjQ1MyAzMTEuMzcyIiByb2xlPSJpbWciIGFydGlzdD0iS2F0ZXJpbmEgTGltcGl0c291bmkiIHNvdXJjZT0iaHR0cHM6Ly91bmRyYXcuY28vIj48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtNDExLjk3NSAtMzU3LjUwMSkiPjxwYXRoIGQ9Ik04MzEuOTM4LDI0My43ODJhNDguMjE0LDQ4LjIxNCwwLDAsMSw0OC4xNDctNDUuNjk0YzEuNDY1LDAsMi45MTIuMDc2LDQuMzQ0LjJhNjQuMDU4LDY0LjA1OCwwLDAsMSwxMTAuNzMzLS4wNTJjMS4yMDgtLjA5MSwyLjQyNC0uMTUyLDMuNjU2LS4xNTJhNDguMjE0LDQ4LjIxNCwwLDAsMSw0OC4xNDcsNDUuNjkzIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtNDE5Ljk2MiAyMDcuNTU4KSIgZmlsbD0iI2YyZjJmMiIvPjxwYXRoIGQ9Ik04NDQuNTY5LDIzOS4xMTdhNDguMjE0LDQ4LjIxNCwwLDAsMSw0OC4xNDctNDUuNjk0YzEuNDY1LDAsMi45MTIuMDc2LDQuMzQ0LjJhNjQuMDU4LDY0LjA1OCwwLDAsMSwxMTAuNzMzLS4wNTJjMS4yMDgtLjA5MSwyLjQyNC0uMTUyLDMuNjU2LS4xNTJhNDguMjE0LDQ4LjIxNCwwLDAsMSw0OC4xNDcsNDUuNjkzIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtNDIyLjU1MiAyMDguNTE1KSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjM2YzZDU2IiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHN0cm9rZS13aWR0aD0iMSIvPjxwYXRoIGQ9Ik0xNTUuOTg4LDUzOS40NzNBMTU5LjU3NywxNTkuNTc3LDAsMCwxLDMxNS4zNDQsMzg4LjIzNmM0Ljg1LDAsOS42MzkuMjUzLDE0LjM3OS42NzdhMjEyLjAxNywyMTIuMDE3LDAsMCwxLDM2Ni41LS4xNzNjNC0uMyw4LjAyNC0uNSwxMi4xLS41QTE1OS41NzcsMTU5LjU3NywwLDAsMSw4NjcuNjc5LDUzOS40NzMiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDMyMi4wMTMgODYuODM1KSIgZmlsbD0iI2YyZjJmMiIvPjxwYXRoIGQ9Ik0xOTcuNzk0LDUyNC4wMzNBMTU5LjU3NywxNTkuNTc3LDAsMCwxLDM1Ny4xNSwzNzIuOGM0Ljg1LDAsOS42MzkuMjUzLDE0LjM3OS42NzdhMjEyLjAxNywyMTIuMDE3LDAsMCwxLDM2Ni41LS4xNzNjNC0uMyw4LjAyNC0uNSwxMi4xLS41QTE1OS41NzcsMTU5LjU3NywwLDAsMSw5MDkuNDg1LDUyNC4wMzMiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDMxMy40NDQgOTApIiBmaWxsPSJub25lIiBzdHJva2U9IiMzZjNkNTYiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgc3Ryb2tlLXdpZHRoPSIxIi8+PHBhdGggZD0iTTg0Ljk2MiwyMTIuNzQxYTY1LjIzNiw2NS4yMzYsMCwwLDEsNjUuMTQ2LTYxLjgyN2MxLjk4MywwLDMuOTQuMSw1Ljg3OC4yNzdhODYuNjc0LDg2LjY3NCwwLDAsMSwxNDkuODI3LS4wNzFjMS42MzUtLjEyMywzLjI4LS4yMDYsNC45NDYtLjIwNmE2NS4yMzYsNjUuMjM2LDAsMCwxLDY1LjE0Niw2MS44MjUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDQ5My45ODUgNDU2LjEzMykiIGZpbGw9IiM2YzYzZmYiLz48cGF0aCBkPSJNMTAyLjA1MywyMDYuNDI4QTY1LjIzNiw2NS4yMzYsMCwwLDEsMTY3LjIsMTQ0LjZjMS45ODMsMCwzLjk0LjEsNS44NzguMjc3YTg2LjY3NCw4Ni42NzQsMCwwLDEsMTQ5LjgyOC0uMDcxYzEuNjM1LS4xMjMsMy4yOC0uMjA2LDQuOTQ2LS4yMDZBNjUuMjM2LDY1LjIzNiwwLDAsMSwzOTMsMjA2LjQyNyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNDkwLjQ4MiA0NTcuNDI3KSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjM2YzZDU2IiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHN0cm9rZS13aWR0aD0iMSIvPjwvZz48L3N2Zz4="
            alt=""
          />
        </EmptyMedia>
        <EmptyTitle>Cloud Storage Empty</EmptyTitle>
        <EmptyDescription>
          Upload files to your cloud storage to access them anywhere.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="outline" size="sm">
          Upload Files
        </Button>
      </EmptyContent>
    </Empty>
  );
}
