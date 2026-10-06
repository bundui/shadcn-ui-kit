import Image from "next/image";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";

const music = [
  {
    title: "Midnight City Lights",
    artist: "Neon Dreams",
    album: "Electric Nights",
    duration: "3:45",
    image:
      "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=200&auto=format&fit=crop",
  },
  {
    title: "Coffee Shop Conversations",
    artist: "The Morning Brew",
    album: "Urban Stories",
    duration: "4:05",
    image:
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=200&auto=format&fit=crop",
  },
  {
    title: "Digital Rain",
    artist: "Cyber Symphony",
    album: "Binary Beats",
    duration: "3:30",
    image:
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=200&auto=format&fit=crop",
  },
];

export default function ItemComponent() {
  return (
    <ItemGroup className="w-full max-w-md gap-3">
      {music.map((song) => (
        <Item key={song.title} variant="outline" asChild role="listitem">
          <a href="#">
            <ItemMedia variant="image">
              <Image
                src={song.image}
                alt={song.title}
                width={40}
                height={40}
                className="aspect-square size-10 rounded-sm object-cover"
              />
            </ItemMedia>
            <ItemContent>
              <ItemTitle className="line-clamp-1">
                {song.title}
                <span className="ml-2 text-muted-foreground font-normal">
                  {song.album}
                </span>
              </ItemTitle>
              <ItemDescription>{song.artist}</ItemDescription>
            </ItemContent>
            <ItemContent className="flex-none text-right">
              <ItemDescription>{song.duration}</ItemDescription>
            </ItemContent>
          </a>
        </Item>
      ))}
    </ItemGroup>
  );
}
