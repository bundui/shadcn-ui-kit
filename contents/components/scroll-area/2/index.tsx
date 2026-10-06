import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";

export default function SheetComponent() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">With Sheet</Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col lg:max-w-lg">
        <ScrollArea className="min-h-0 flex-1">
          <div>
            <SheetHeader>
              <SheetTitle>Privacy Policy</SheetTitle>
              <SheetDescription>
                Please review our privacy policy to understand how we handle your data.
              </SheetDescription>
            </SheetHeader>
            <div className="space-y-1 p-4 text-sm">
              <p className="mb-2 font-medium">Last Updated: January 15, 2025</p>

              <h3>1. Overview</h3>
              <p>
                This Privacy Policy describes how we collect, use, and protect your personal
                information when you use our application. We are committed to protecting your
                privacy and ensuring transparency about our data practices.
              </p>

              <h3>2. Information We Collect</h3>
              <p>
                We collect information that you provide directly to us, including your name, email
                address, and any other information you choose to provide. We also automatically
                collect certain information about your device and how you interact with our
                services.
              </p>

              <h3>3. How We Use Your Information</h3>
              <p>
                We use the information we collect to provide, maintain, and improve our services, to
                process transactions, to communicate with you, and to personalize your experience.
                We may also use your information for analytics and to prevent fraud.
              </p>

              <h3>4. Data Sharing and Disclosure</h3>
              <p>
                We do not sell your personal information. We may share your information with service
                providers who assist us in operating our platform, with your consent, or as required
                by law. We take measures to ensure these parties protect your information.
              </p>

              <h3>5. Data Security</h3>
              <p>
                We implement appropriate technical and organizational measures to protect your
                personal information against unauthorized access, alteration, disclosure, or
                destruction. However, no method of transmission over the internet is 100% secure.
              </p>

              <h3>6. Your Rights and Choices</h3>
              <p>You have the right to:</p>
              <ul>
                <li>Access and receive a copy of your personal data</li>
                <li>Request correction of inaccurate information</li>
                <li>Request deletion of your personal data</li>
                <li>Opt-out of certain data processing activities</li>
              </ul>

              <h3>7. Cookies and Tracking Technologies</h3>
              <p>
                We use cookies and similar tracking technologies to track activity on our platform
                and hold certain information. You can instruct your browser to refuse all cookies or
                to indicate when a cookie is being sent.
              </p>

              <h3>8. Third-Party Services</h3>
              <p>
                Our platform may contain links to third-party websites or services. We are not
                responsible for the privacy practices of these third parties. We encourage you to
                read their privacy policies.
              </p>

              <h3>9. Children&apos;s Privacy</h3>
              <p>
                Our services are not intended for children under the age of 13. We do not knowingly
                collect personal information from children. If you believe we have collected
                information from a child, please contact us immediately.
              </p>

              <h3>10. International Data Transfers</h3>
              <p>
                Your information may be transferred to and maintained on computers located outside
                of your state, province, country, or other governmental jurisdiction where data
                protection laws may differ from those in your jurisdiction.
              </p>

              <h3>11. Data Retention</h3>
              <p>
                We retain your personal information for as long as necessary to fulfill the purposes
                outlined in this policy, unless a longer retention period is required or permitted
                by law.
              </p>

              <h3>12. Changes to This Policy</h3>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any
                changes by posting the new policy on this page and updating the &quot;Last
                Updated&quot; date.
              </p>

              <h3>13. Contact Us</h3>
              <p>If you have any questions about this Privacy Policy, please contact us at:</p>
              <p>Email: privacy@example.com</p>
              <p>Address: 123 Privacy Street, Data City, DC 12345</p>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
