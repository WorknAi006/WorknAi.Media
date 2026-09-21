import CRMManager from "@/components/crm/CRMManager";

export const metadata = {
  title: "CRM Leads & Pipeline | WorknAI Dashboard",
};

export default function CRMPage() {
  return (
    <CRMManager
      title="Client CRM & Deal Pipeline"
      subtitle="Orchestrate enterprise brand accounts, live inbound project directives, and deal pipelines."
    />
  );
}
