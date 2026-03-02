import CreateOpportunity from "@/app/components/loggedIn/createOpportunity/createOpportunity"

interface Props {
  params: Promise<{ id: string }>;
}

export default async function createOpportunityPage({ params }: Props) {
  const { id } = await params;
  return <CreateOpportunity clientId={id} />;
}