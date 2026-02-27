"use client";

import { useParams } from "next/navigation";
import { useClientState } from "../../../../lib/providers/provider";
import SubmitProposal from "../../../../components/loggedIn/submitProposal/submitProposal";

const CreateProposalPage = () => {
  const params   = useParams();
  const clientId = params.id as string;

  const { client } = useClientState();

  /* The <ClientProviders> wrapper on the overview layout already fetched
     the client — we can safely read client?.name from context here.     */
  const clientName = client?.name ?? "";

  return (
    <SubmitProposal
      prefillClientId={clientId}
      prefillClientName={clientName}
    />
  );
};

export default CreateProposalPage;
