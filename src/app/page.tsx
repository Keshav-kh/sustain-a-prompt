import { Suspense } from "react";
import { HomeClient } from "./HomeClient";

export default function Home() {
  return (
    <Suspense fallback={<div className="container mx-auto px-6 py-12">Loading...</div>}>
      <HomeClient />
    </Suspense>
  );
}