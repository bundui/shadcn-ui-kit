import Image from "next/image";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemTitle,
} from "@/components/ui/item";

const models = [
  {
    name: "v0-1.5-sm",
    description: "Everyday tasks and UI generation.",
    image:
      "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=640&auto=format&fit=crop",
    credit: "Codioful (formerly Gradienta) on Unsplash",
  },
  {
    name: "v0-1.5-lg",
    description: "Advanced thinking or reasoning.",
    image:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=640&auto=format&fit=crop",
    credit: "Milad Fakurian on Unsplash",
  },
];

export default function ItemComponent() {
  return (
    <ItemGroup className="grid grid-cols-2 max-w-sm gap-4">
      {models.map((model) => (
        <Item key={model.name} variant="outline">
          <ItemHeader>
            <Image
              src={model.image}
              alt={model.name}
              width={128}
              height={128}
              className="aspect-square w-full rounded-sm object-cover"
            />
          </ItemHeader>
          <ItemContent>
            <ItemTitle>{model.name}</ItemTitle>
            <ItemDescription>{model.description}</ItemDescription>
          </ItemContent>
        </Item>
      ))}
    </ItemGroup>
  );
}
