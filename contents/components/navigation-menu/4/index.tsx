"use client";

import * as React from "react";
import Link from "next/link";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  BagIcon,
  BeltIcon,
  HatIcon,
  JewelryIcon,
  OtherIcon,
  SunglassesIcon,
} from "./icons";

type ListItemType = {
  title: string;
  href?: string;
  description?: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

const accessoriesMenuItems: ListItemType[] = [
  {
    title: "Bags",
    href: "#",
    icon: BagIcon,
  },
  {
    title: "Jewelry",
    href: "#",
    icon: JewelryIcon,
  },
  {
    title: "Sunglasses",
    href: "#",
    icon: SunglassesIcon,
  },
  {
    title: "Hats & Beanies",
    href: "#",
    icon: HatIcon,
  },
  {
    title: "Belts",
    href: "#",
    icon: BeltIcon,
  },
  {
    title: "All Accessories",
    href: "#",
    icon: OtherIcon,
  },
];

const collectionItems = [
  {
    title: "Trends",
    href: "#",
    description: "Discover this summer's trendy products.",
  },
  {
    title: "Best Sellers",
    href: "#",
    description: "We've collected the best-selling products for you.",
  },
  {
    title: "New Arrivals",
    href: "#",
    description: "Discover the most favorited products.",
  },
];

export default function NavigationMenuDemo() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Collections</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-1 md:w-[400px] lg:w-[600px] lg:grid-cols-2">
              {collectionItems.map((item, i) => (
                <li key={i}>
                  <NavigationMenuLink
                    asChild
                    className="flex-col items-start gap-1"
                  >
                    <Link
                      href={item.href ?? "#"}
                      onClick={(e) => e.preventDefault()}
                    >
                      <div className="text-sm leading-none font-medium">
                        {item.title}
                      </div>
                      <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
                        {item.description}
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </li>
              ))}
              <li className="col-start-2 row-span-3 row-start-1">
                <NavigationMenuLink
                  asChild
                  className="h-full flex-col items-start gap-2"
                >
                  <Link href="#" onClick={(e) => e.preventDefault()}>
                    <img
                      src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=600&q=80"
                      alt="Clothes on a rack"
                      className="aspect-4/3 w-full rounded-md object-cover"
                    />
                    <div className="space-y-1">
                      <div className="text-sm leading-none font-medium">
                        Timeless Classics
                      </div>
                      <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
                        Elevate your style with essentials
                      </p>
                    </div>
                  </Link>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Accessories</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] grid-cols-2 gap-1 lg:w-[300px]">
              {accessoriesMenuItems.map((item, i) => (
                <li key={i}>
                  <NavigationMenuLink
                    asChild
                    className="flex-col items-center gap-2 p-4 text-center"
                  >
                    <Link
                      href={item.href ?? "#"}
                      onClick={(e) => e.preventDefault()}
                    >
                      {item.icon ? (
                        <item.icon className="text-muted-foreground size-8" />
                      ) : null}
                      <span className="text-sm leading-none font-medium">
                        {item.title}
                      </span>
                    </Link>
                  </NavigationMenuLink>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link
              href="#"
              className={navigationMenuTriggerStyle()}
              onClick={(e) => e.preventDefault()}
            >
              Women
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <Link
              href="#"
              className={navigationMenuTriggerStyle()}
              onClick={(e) => e.preventDefault()}
            >
              Men
            </Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
