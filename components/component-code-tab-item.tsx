'use client'

import { useCodeCopyStore } from "@/store/useCopyCode";
import { TabsTrigger } from "@/components/ui/tabs";

type Props = {file: {name: string, path: string}, code: string}

export default function ComponentCodeTabItem({file, code}: Props) {
  const { setCode } = useCodeCopyStore();

  const handleClick = (code: string) => {
    setCode(code);
  };

  return (
    <TabsTrigger
      onClick={() => handleClick(code)}
      className="inline-flex font-normal text-sm rounded-md border-none text-white/50 hover:text-white/90 data-[state=active]:text-white/90! data-[state=active]:bg-white/15 dark:data-[state=active]:text-black/90 dark:data-[state=active]:bg-secondary"
      value={file.name}>
      {file.name}
    </TabsTrigger>
  );
}
