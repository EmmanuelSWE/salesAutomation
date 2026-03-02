import CreateRenewal from "@/app/components/loggedIn/createRenewal/createRenewal";

interface Props { params: { contractId: string } }

export default function Page({ params }: Readonly<Props>) {
  return <CreateRenewal contractId={params.contractId} />;
}
