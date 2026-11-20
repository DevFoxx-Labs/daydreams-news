import { LegalPage, legalMetadata } from "@/components/legal/legal-page";

export const metadata = legalMetadata("advertise");

export default function Page() {
  return <LegalPage slug="advertise" />;
}
