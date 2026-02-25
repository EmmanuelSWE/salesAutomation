import Image from "next/image";
import Link from "next/link";


export default function Home() {
  return (
 <main style={{backgroundColor : 'white'}}>
    <h1> Hello world</h1>
   <Link href='login'> login</Link>
      <Link href='signup'> signup</Link>
 </main>
  );
}
