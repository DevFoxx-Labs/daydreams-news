import { LegalPage, legalMetadata } from "@/components/legal/legal-page";

export const metadata = legalMetadata("about");

export default function Page() {
  return <LegalPage slug="about" />;
}
