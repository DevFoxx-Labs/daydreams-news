import { LegalPage, legalMetadata } from "@/components/legal/legal-page";

export const metadata = legalMetadata("ethics");

export default function Page() {
  return <LegalPage slug="ethics" />;
}
