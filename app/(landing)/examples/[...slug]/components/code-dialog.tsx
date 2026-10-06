import { CodeIcon } from "lucide-react";
import { extractCodeFromFilePath, getFilesInDirectory } from "@/lib/code";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import CodeRenderer from "@/components/code-renderer";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import ComponentCodeTabItem from "@/components/component-code-tab-item";
import CodeBlock from "@/components/code-renderer";
import CopyToClipboard from "@/components/copy-to-clipboard";
import { CopyPnpmInstallButton } from "@/components/copy-pnpm-install-button";

type Props = { filePath: string; comp: any };

export default function CodeDialog({ filePath, comp }: Props) {
  const fileContent = extractCodeFromFilePath(`${filePath}/index.tsx`);
  const files = filePath.includes("/index")
    ? getFilesInDirectory(filePath.replace("/index", ""))
    : null;

  const registryAddBase = `@shadcnuikit/${comp.registryName}`;
  const packageManagers = [
    {
      name: "npm",
      code: `npx shadcn@latest add ${registryAddBase}`,
    },
    {
      name: "pnpm",
      code: `pnpm dlx shadcn@latest add ${registryAddBase}`,
    },
    {
      name: "yarn",
      code: `yarn dlx shadcn@latest add ${registryAddBase}`,
    },
    {
      name: "bun",
      code: `bunx --bun shadcn@latest add ${registryAddBase}`,
    },
  ];

  return (
    <div className="flex items-center gap-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">
            <CodeIcon /> Get the Code
          </Button>
        </DialogTrigger>
      <DialogContent className="border-0 p-0 md:min-w-2xl">
        <div className="min-w-0 space-y-4 p-4">
          <h3 className="text-lg font-heading font-semibold leading-none">Install via Registry</h3>
          <div className="rounded-md bg-zinc-950!">
            <Tabs
              defaultValue={"npm"}
              className="relative w-full gap-0 border-none"
            >
              <div className="border-b-border/20 border-b p-2">
                <TabsList className="h-auto gap-2 bg-transparent">
                  {packageManagers.map((item, key) => (
                    <TabsTrigger
                      key={key}
                      className="dark:data-[state=active]:bg-secondary inline-flex rounded-md border-none text-sm font-normal text-white/50 data-[state=active]:bg-white/15 data-[state=active]:text-white/90! dark:data-[state=active]:text-black/90"
                      value={item.name}
                    >
                      {item.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
              {packageManagers.map((item, key) => {
                return (
                  <TabsContent
                    key={key}
                    value={item.name}
                    className="mt-0 border-none"
                  >
                    <div className="absolute end-2 top-2">
                      <CopyToClipboard text={item.code} />
                    </div>
                    <CodeBlock code={item.code} lang="bash" />
                  </TabsContent>
                );
              })}
            </Tabs>
          </div>
          <h3 className="text-lg font-heading font-semibold leading-none">Code</h3>
          <div className="rounded-md bg-zinc-950!">
            {files && files.length ? (
              <Tabs
                defaultValue={files[0].name}
                className="w-full gap-0 border-none"
              >
                <div className="border-b-border/20 border-b p-2">
                  <TabsList className="h-auto gap-2 bg-transparent">
                    {files &&
                      files.map((file, key) => {
                        const fileContent = extractCodeFromFilePath(file.path);
                        return (
                          <ComponentCodeTabItem
                            file={file}
                            code={fileContent}
                            key={key}
                          />
                        );
                      })}
                  </TabsList>
                </div>
                {files &&
                  files.map((file, key) => {
                    const fileContent = extractCodeFromFilePath(file.path);
                    return (
                      <TabsContent
                        key={key}
                        value={file.name}
                        className="relative mt-0 border-none"
                      >
                        <div className="absolute end-2 top-2">
                          <CopyToClipboard text={fileContent} />
                        </div>
                        <CodeRenderer code={fileContent} lang="tsx" />
                      </TabsContent>
                    );
                  })}
              </Tabs>
            ) : (
              <div className="relative">
                <div className="absolute end-2 top-2">
                  <CopyToClipboard text={fileContent} />
                </div>
                <CodeRenderer code={fileContent} lang="tsx" />
              </div>
            )}
          </div>
        </div>
      </DialogContent>
      </Dialog>
      <CopyPnpmInstallButton commands={packageManagers} />
    </div>
  );
}
