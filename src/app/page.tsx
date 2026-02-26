import Image from "next/image";
import Link from "next/link";


export default function Home() {
  return (
 <main style={{backgroundColor : 'white'}}>
    <h1> Hello world</h1>
   <Link href='login'> login</Link>
      <Link href='signup'> signup</Link>
       <div style={{ padding: 32 }}>
      <h1>Create Pages</h1>
      <ul>
        <li><Link href="/pricingRequests/create">Create Pricing Request</Link></li>
        <li><Link href="/contracts/create">Create Contract</Link></li>
        <li><Link href="/contracts/EXAMPLE_CONTRACT_ID/createRenewal">Create Renewal (example)</Link></li>
        <li><Link href="/activities/create">Create Activity</Link></li>
        <li><Link href="/notes/create">Create Note</Link></li>
      </ul>
    </div>
    <div style={{ padding: 32 }}>
      <h1>List Pages</h1>
      <ul>
        <li><Link href="/clients">Clients List</Link></li>
        <li><Link href="/staff">Staff List</Link></li>
        <li><Link href="/activities">Activities List</Link></li>
      </ul>
    </div>
 </main>
  );
}
