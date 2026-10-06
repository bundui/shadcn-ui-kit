import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Newsletter1() {
  return (
    <section className="w-full bg-linear-to-r py-16 lg:py-24">
      <div className="container mx-auto flex flex-col items-center justify-center space-y-6 px-4 text-center md:px-6">
        <div className="max-w-xl">
          <h2 className="text-3xl font-bold leading-tight md:text-4xl">Join Our Community</h2>
          <p className="text-muted-foreground mt-4 md:text-lg">
            Subscribe to our newsletter to get the latest updates, exclusive
            content, and special offers directly in your inbox.
          </p>
        </div>
        <div className="w-full max-w-md">
          <Card className="w-full max-w-md shadow-none">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">
                Subscribe to our Newsletter
              </CardTitle>
              <CardDescription>
                Stay up-to-date with our latest news and exclusive offers.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <Input id="email" type="email" placeholder="you@example.com" />
            </CardContent>
            <CardFooter>
              <Button className="w-full">Subscribe</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  );
}
