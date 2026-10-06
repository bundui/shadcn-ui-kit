import Link from "next/link";
import { Button } from "./ui/button";
import { FooterLinks, FooterTop } from "./footer-container";
import { ExternalLink } from "lucide-react";
import { Product, products, ProductTypeEnum } from "@/lib/products";
import { Logo } from "@/components/logo";
import { getGroupedComponentCategories } from "@/lib/data-contents";
import { componentCategories } from "@/app/(landing)/components/component-categories";
import { categories as blocksCategories } from "@/app/(landing)/blocks/categories";
import { categories as examplesCategories } from "@/app/(landing)/examples/categories";
import { dashboardData } from "./sections/dashboard-data";
import {
  Attachment,
  AttachmentMedia,
  AttachmentAction,
  AttachmentContent,
  AttachmentTitle,
  AttachmentDescription,
  AttachmentActions,
} from "./ui/attachment";

const featuredComponentSlugs = [
  "button",
  "card",
  "input",
  "select",
  "combobox",
  "checkbox",
  "radio-group",
  "switch",
  "textarea",
  "calendar",
  "table",
  "data-table",
  "tabs",
  "dropdown-menu",
  "navigation-menu",
  "sheet",
  "breadcrumb",
  "pagination",
  "badge",
  "avatar",
  "accordion",
  "alert",
  "tooltip",
  "sonner-toast",
  "carousel",
];

export function Footer() {
  const filteredProducts = products
    .sort((a, b) => b.id - a.id)
    .filter((e) => e.type.key === ProductTypeEnum.Template && e.inTemplates);

  return (
    <footer>
      <FooterTop>
        <div className="grid gap-4 space-y-4 sm:grid-cols-2 sm:gap-12 sm:space-y-0 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
          <div className="max-w-sm shrink-0 space-y-4 md:col-span-4 lg:col-span-2">
            <Logo />
            <p className="text-muted-foreground text-sm leading-relaxed text-balance">
              Shadcn UI Kit is a complete collection of admin dashboards,
              components, blocks, website templates, and a Figma design system,
              built to help teams save time, reduce costs, and ship faster.
            </p>
            <p className="text-muted-foreground text-xs leading-relaxed text-balance">
              An independent product built on top of shadcn/ui. Not affiliated
              with the official shadcn/ui project.
            </p>
            <div className="flex gap-2">
              <Button variant="outline" className="rounded-full px-6" asChild>
                <Link href="https://x.com/tobybelhome" target="_blank">
                  <img
                    src="data:image/svg+xml,%3Csvg%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20viewBox%3D%220%200%2050%2050%22%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20width%3D%2250px%22%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20height%3D%2250px%22%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3E%3Cpath%20d%3D%22M%2011%204%20C%207.134%204%204%207.134%204%2011%20L%204%2039%20C%204%2042.866%207.134%2046%2011%2046%20L%2039%2046%20C%2042.866%2046%2046%2042.866%2046%2039%20L%2046%2011%20C%2046%207.134%2042.866%204%2039%204%20L%2011%204%20z%20M%2013.085938%2013%20L%2021.023438%2013%20L%2026.660156%2021.009766%20L%2033.5%2013%20L%2036%2013%20L%2027.789062%2022.613281%20L%2037.914062%2037%20L%2029.978516%2037%20L%2023.4375%2027.707031%20L%2015.5%2037%20L%2013%2037%20L%2022.308594%2026.103516%20L%2013.085938%2013%20z%20M%2016.914062%2015%20L%2031.021484%2035%20L%2034.085938%2035%20L%2019.978516%2015%20L%2016.914062%2015%20z%22%20%2F%3E%3C%2Fsvg%3E"
                    className="size-4"
                    alt=""
                  />
                  Follow
                </Link>
              </Button>
              <Button variant="outline" className="rounded-full px-6" asChild>
                <Link href="https://github.com/shadcn-ui-kit" target="_blank">
                  <img
                    src="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%20width%3D%22800px%22%20height%3D%22800px%22%20viewBox%3D%220%200%2020%2020%22%20version%3D%221.1%22%3E%3Ctitle%3Egithub%20%5B%23142%5D%3C%2Ftitle%3E%3Cdesc%3ECreated%20with%20Sketch.%3C%2Fdesc%3E%3Cdefs%3E%3C%2Fdefs%3E%3Cg%20id%3D%22Page-1%22%20stroke%3D%22none%22%20stroke-width%3D%221%22%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20id%3D%22Dribbble-Light-Preview%22%20transform%3D%22translate(-140.000000%2C%20-7559.000000)%22%20fill%3D%22%23000000%22%3E%3Cg%20id%3D%22icons%22%20transform%3D%22translate(56.000000%2C%20160.000000)%22%3E%3Cpath%20d%3D%22M94%2C7399%20C99.523%2C7399%20104%2C7403.59%20104%2C7409.253%20C104%2C7413.782%20101.138%2C7417.624%2097.167%2C7418.981%20C96.66%2C7419.082%2096.48%2C7418.762%2096.48%2C7418.489%20C96.48%2C7418.151%2096.492%2C7417.047%2096.492%2C7415.675%20C96.492%2C7414.719%2096.172%2C7414.095%2095.813%2C7413.777%20C98.04%2C7413.523%20100.38%2C7412.656%20100.38%2C7408.718%20C100.38%2C7407.598%2099.992%2C7406.684%2099.35%2C7405.966%20C99.454%2C7405.707%2099.797%2C7404.664%2099.252%2C7403.252%20C99.252%2C7403.252%2098.414%2C7402.977%2096.505%2C7404.303%20C95.706%2C7404.076%2094.85%2C7403.962%2094%2C7403.958%20C93.15%2C7403.962%2092.295%2C7404.076%2091.497%2C7404.303%20C89.586%2C7402.977%2088.746%2C7403.252%2088.746%2C7403.252%20C88.203%2C7404.664%2088.546%2C7405.707%2088.649%2C7405.966%20C88.01%2C7406.684%2087.619%2C7407.598%2087.619%2C7408.718%20C87.619%2C7412.646%2089.954%2C7413.526%2092.175%2C7413.785%20C91.889%2C7414.041%2091.63%2C7414.493%2091.54%2C7415.156%20C90.97%2C7415.418%2089.522%2C7415.871%2088.63%2C7414.304%20C88.63%2C7414.304%2088.101%2C7413.319%2087.097%2C7413.247%20C87.097%2C7413.247%2086.122%2C7413.234%2087.029%2C7413.87%20C87.029%2C7413.87%2087.684%2C7414.185%2088.139%2C7415.37%20C88.139%2C7415.37%2088.726%2C7417.2%2091.508%2C7416.58%20C91.513%2C7417.437%2091.522%2C7418.245%2091.522%2C7418.489%20C91.522%2C7418.76%2091.338%2C7419.077%2090.839%2C7418.982%20C86.865%2C7417.627%2084%2C7413.783%2084%2C7409.253%20C84%2C7403.59%2088.478%2C7399%2094%2C7399%22%20id%3D%22github-%5B%23142%5D%22%3E%3C%2Fpath%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E"
                    className="size-4"
                    alt=""
                  />
                  Github
                </Link>
              </Button>
            </div>

            <a
              href="https://gramotion.video/"
              target="_blank"
              title="Motion graphics editor"
            >
              <Attachment className="mt-10 w-full">
                <AttachmentMedia>
                  <svg
                    className="size-8 dark:invert"
                    xmlns="http://www.w3.org/2000/svg"
                    width="297"
                    height="191"
                    viewBox="0 0 297 191"
                    fill="none"
                  >
                    <path
                      d="M85.042 0.612274C74.3886 1.82816 64.6037 4.66519 54.3556 9.58659C19.79 26.1457 -1.69046 61.8113 0.104399 99.5614C1.55187 128.8 15.1581 154.334 38.7229 172.051C45.3234 176.972 57.9453 183.63 65.3564 186.062C106.812 199.668 151.915 184.325 176.001 148.312C208.251 100.14 190.244 34.7726 137.73 9.58659C121.113 1.59656 103.164 -1.41418 85.042 0.612274Z"
                      fill="black"
                    />
                    <path
                      d="M158.282 0.959793C158.63 1.24928 160.541 2.69676 162.625 4.14423C172.757 11.2658 182.716 21.6297 190.474 33.2094C215.834 70.9016 215.834 120.116 190.474 157.808C182.716 169.387 172.757 179.751 162.625 186.873C157.298 190.578 157.298 190.636 160.888 190.173C196.785 185.657 227.877 160.066 239.283 125.616C255.842 75.4756 228.861 21.5718 178.779 4.95482C170.731 2.29146 156.777 -0.429779 158.282 0.959793Z"
                      fill="black"
                      fillOpacity="0.72"
                    />
                    <path
                      d="M210.392 0.959793C210.739 1.24928 212.65 2.69676 214.734 4.14423C224.867 11.2658 234.825 21.6297 242.584 33.2094C267.943 70.9016 267.943 120.116 242.584 157.808C234.825 169.387 224.867 179.751 214.734 186.873C209.408 190.578 209.408 190.636 212.997 190.173C248.895 185.657 279.986 160.066 291.392 125.616C307.951 75.4756 280.971 21.5718 230.888 4.95482C222.84 2.29146 208.886 -0.429779 210.392 0.959793Z"
                      fill="black"
                      fillOpacity="0.49"
                    />
                  </svg>
                </AttachmentMedia>
                <AttachmentContent>
                  <AttachmentTitle>Gramotion Video</AttachmentTitle>
                  <AttachmentDescription>
                    Create a launch video for your project.
                  </AttachmentDescription>
                </AttachmentContent>
                <AttachmentActions>
                  <span className="text-muted-foreground text-xs">Sponsor</span>
                  <AttachmentAction aria-label="Remove message-renderer.tsx">
                    <ExternalLink />
                  </AttachmentAction>
                </AttachmentActions>
              </Attachment>
            </a>
          </div>
          <div>
            <div className="mb-4 font-sans font-bold">Products</div>
            <ul className="[&_a]:text-muted-foreground [&_a]:hover:text-foreground flex flex-col gap-4 [&_a]:block [&_a]:text-sm [&_a]:hover:underline">
              <li>
                <Link href="/admin-dashboard">Admin Dashboards</Link>
              </li>
              <li>
                <Link href="/components">Components</Link>
              </li>
              <li>
                <Link href="/blocks">Blocks</Link>
              </li>
              <li>
                <Link href="/examples">Examples</Link>
              </li>
              <li>
                <Link href="/templates">Templates</Link>
              </li>
              <li>
                <Link href="https://shadcnuikit.com/mcp">MCP Server</Link>
              </li>
            </ul>
          </div>
          <div>
            <div className="mb-4 font-sans font-bold">Templates</div>
            <ul className="[&_a]:text-muted-foreground [&_a]:hover:text-foreground flex flex-col gap-4 [&_a]:block [&_a]:text-sm [&_a]:hover:underline">
              {filteredProducts.length && (
                <>
                  {filteredProducts.map((product: Product) => (
                    <li key={product.id}>
                      <Link href={`/template/${product.slug}`}>
                        {product.title}
                      </Link>
                    </li>
                  ))}
                </>
              )}
            </ul>
          </div>
        </div>
      </FooterTop>

      <FooterLinks>
        <div>
          <div className="mb-4 font-sans font-bold">Shadcn Components</div>
          <ul className="[&_a]:text-muted-foreground [&_a]:hover:text-foreground flex flex-col gap-4 [&_a]:block [&_a]:text-sm [&_a]:hover:underline">
            {[
              ...getGroupedComponentCategories({ withoutAll: true }).map(
                (category) => ({
                  href: `/components/${category.href}`,
                  title:
                    category.title.charAt(0).toUpperCase() +
                    category.title.slice(1),
                }),
              ),
              ...featuredComponentSlugs
                .map((slug) =>
                  componentCategories.find(
                    (component) => component.href === `/components/${slug}`,
                  ),
                )
                .filter((component) => component !== undefined)
                .map((component) => ({
                  href: component.href,
                  title: component.title,
                })),
            ].map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.title}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="mb-4 font-sans font-bold">Shadcn Blocks</div>
          <ul className="[&_a]:text-muted-foreground [&_a]:hover:text-foreground flex flex-col gap-4 [&_a]:block [&_a]:text-sm [&_a]:hover:underline">
            {[
              ...blocksCategories.map((category) => ({
                href: category.href,
                title: category.title,
              })),
              ...blocksCategories
                .flatMap((category) => category.items)
                .map((block) => ({
                  href: block.href,
                  title: block.sidebarTitle,
                })),
            ].map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.title}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="mb-4 font-sans font-bold">Shadcn Examples</div>
          <ul className="[&_a]:text-muted-foreground [&_a]:hover:text-foreground flex flex-col gap-4 [&_a]:block [&_a]:text-sm [&_a]:hover:underline">
            {[
              ...examplesCategories.map((category) => ({
                href: category.href,
                title: category.title,
              })),
              ...examplesCategories
                .flatMap((category) => category.items)
                .map((example) => ({
                  href: example.href,
                  title: example.sidebarTitle,
                })),
            ].map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.title}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-4 lg:space-y-8">
          <div className="mb-4 font-sans font-bold">Admin Dashboard Kit</div>
          <ul className="[&_a]:text-muted-foreground [&_a]:hover:text-foreground flex flex-col gap-4 [&_a]:block [&_a]:text-sm [&_a]:hover:underline">
            {dashboardData.dashboards.map((item, key: number) => (
              <li key={key}>
                <Link href={item.url} target="_blank">
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mb-4 font-sans font-bold">Dashboard Web Apps</div>
          <ul className="[&_a]:text-muted-foreground [&_a]:hover:text-foreground flex flex-col gap-4 [&_a]:block [&_a]:text-sm [&_a]:hover:underline">
            {dashboardData.apps.map((item, key: number) => (
              <li key={key}>
                <Link href={item.url} target="_blank">
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mb-4 font-sans font-bold">Dashboard AI Apps</div>
          <ul className="[&_a]:text-muted-foreground [&_a]:hover:text-foreground flex flex-col gap-4 [&_a]:block [&_a]:text-sm [&_a]:hover:underline">
            {dashboardData.aiApps.map((item, key: number) => (
              <li key={key}>
                <Link href={item.url} target="_blank">
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </FooterLinks>

      <div className="border-t">
        <div className="container flex flex-col items-center justify-center space-y-4 border-x p-4 lg:flex-row lg:justify-between lg:space-y-0">
          <span className="text-xs text-gray-500 sm:text-center dark:text-gray-400">
            © {new Date().getFullYear()}{" "}
            <a
              href="https://bundui.io"
              className="hover:underline"
              target="_blank"
            >
              Bundui
            </a>
            . All Rights Reserved.
          </span>
          <ul className="*:text-muted-foreground flex flex-row flex-wrap gap-4 *:text-xs">
            <li>
              <Link
                href="https://shadcnuikit.com/terms-conditions"
                className="hover:text-foreground hover:underline"
              >
                Terms &amp; Conditions
              </Link>
            </li>
            <li>
              <Link
                href="https://shadcnuikit.com/privacy-policy"
                className="hover:text-foreground hover:underline"
              >
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
