import CRMManager from "@/components/crm/CRMManager";

export const metadata = {
  title: "Leads CRM & Contact Inquiries | WorknAI Admin",
};

export default function ContactAdminPage() {
  return (
    <CRMManager
      title="Leads CRM & Contact Inquiries"
      subtitle="Admin review of inbound client project requests, phone numbers, requirements, and deal pipelines."
    />
  );
}
