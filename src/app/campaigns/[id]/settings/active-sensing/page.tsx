"use client"

import ActiveSensingForm from "@/components/configuration/form/ActiveSensingForm";
import { usePathname } from "next/navigation";

const Page: React.FC = () => {
    const pathname = usePathname();
    return <ActiveSensingForm baseUrl={pathname} />
}

export default Page;