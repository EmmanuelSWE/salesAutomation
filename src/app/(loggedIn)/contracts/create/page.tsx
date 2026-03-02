import { Suspense } from "react";
import CreateContract from "@/app/components/loggedIn/createContract/createContract";

const CreateContractPage = () => (
  <Suspense>
    <CreateContract />
  </Suspense>
);

export default CreateContractPage;
