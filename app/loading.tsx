import { BrandLogo } from "@/components/BrandLogo";
export default function Loading() { return <main className="route-state" aria-busy="true" aria-label="Loading DigiLearn"><BrandLogo /><span className="sr-only">Loading DigiLearn</span><div className="state-skeleton wide" /><div className="state-skeleton" /><div className="state-skeleton short" /></main>; }
