import Link from "next/link";
import { SiteHeader } from "@/components/SiteChrome";
export default function NotFound() { return <><SiteHeader /><main id="main-content" className="route-state"><p className="eyebrow">Not found</p><h1>We could not find that learning page.</h1><p>The course or lesson address may be incomplete. Return to the verified catalogue to choose an available course.</p><Link href="/courses" className="button primary inline-button">Browse all courses</Link></main></>; }
