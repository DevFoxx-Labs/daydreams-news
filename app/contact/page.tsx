import { LegalPage, legalMetadata } from "@/components/legal/legal-page";

export const metadata = legalMetadata("contact");

export default function Page() {
  return <LegalPage slug="contact" />;
}
