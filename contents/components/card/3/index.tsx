import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Share2 } from "lucide-react";

const CardTopImageDemo = () => {
  return (
    <Card className="max-w-sm shadow-none pt-0">
      <CardContent className="px-0">
        <img
          src="https://images.unsplash.com/photo-1743105351262-3f9e6944920a?q=80&w=500&auto=format&fit=crop&ixlib=rb-4.1.0"
          alt="Blog banner"
          className="aspect-video h-70 rounded-t-xl object-cover"
        />
      </CardContent>
      <CardHeader>
        <CardTitle className="leading-snug">How to Create Stunning Gradients for Your Website</CardTitle>
        <CardDescription>
          Discover pro techniques for blending colors and adding dynamic swirls to your backgrounds
          with simple CSS tricks.
        </CardDescription>
      </CardHeader>
      <CardFooter className="gap-3 max-sm:flex-col max-sm:items-stretch">
        <Button>Read More</Button>
        <Button variant={"outline"} size="icon">
          <Share2 aria-hidden="true" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CardTopImageDemo;
