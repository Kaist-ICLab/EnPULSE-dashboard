"use client"
import { usePathname, useRouter } from "next/navigation";

import ActiveSensingForm from "@/components/configuration/form/ActiveSensingForm";
import PrevNextNavigation from "@/components/configuration/PrevNextNavigation";
import { useValidConfigState } from "@/hooks/configuration/useValidConfigState";

const Page: React.FC = () => {
    const pathname = usePathname();
    const router = useRouter();
    const { isActiveSensingValid } = useValidConfigState();

    return (
        <>
            <ActiveSensingForm baseUrl={pathname} />
            <PrevNextNavigation
                onPrevClick={() => router.push("/create/passive-sensing")}
                onNextClick={() => router.push("/create/confirm")}
                disabled={!isActiveSensingValid}
            />
        </>
    );
}

export default Page;