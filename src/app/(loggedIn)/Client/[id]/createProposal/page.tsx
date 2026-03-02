"use client";

import { useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useClientState, useClientAction } from "../../../../lib/providers/provider";
import SubmitProposal from "../../../../components/loggedIn/submitProposal/submitProposal";

const CreateProposalPage = () => {
  const params       = useParams();
  const searchParams = useSearchParams();
  const clientId     = params.id as string;

  const { client }       = useClientState();
  const { getOneClient } = useClientAction();

  // Fetch the client on mount so clientName is always populated (handles direct navigation)
  useEffect(() => {
    if (clientId) getOneClient(clientId);
  }, [clientId]); // eslint-disable-line react-hooks/exhaustive-deps

  const clientName    = client?.name ?? "";
  const opportunityId = searchParams.get("opportunityId") ?? "";

  return (
    <SubmitProposal
      prefillClientId={clientId}
      prefillClientName={clientName}
      prefillOpportunityId={opportunityId}
    />
  );
};

export default CreateProposalPage;
