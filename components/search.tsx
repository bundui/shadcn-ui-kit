"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { SearchIcon } from "lucide-react";
import { Button } from "./ui/button";

const SearchDialog = dynamic(() => import("./search-dialog"), { ssr: false });

export default function Search() {
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  useEffect(() => {
    if (open) setLoaded(true);
  }, [open]);

  return (
    <div>
      <div className="relative">
        <Button
          size="icon"
          variant="ghost"
          onClick={() => setOpen(true)}
          aria-label="Search"
        >
          <SearchIcon />
        </Button>
      </div>
      {loaded && <SearchDialog open={open} setOpen={setOpen} />}
    </div>
  );
}
