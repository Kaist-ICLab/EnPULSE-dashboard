"use client"
import { useRouter } from "next/navigation";

import ActiveSensingForm from "@/components/configuration/form/ActiveSensingForm";
import PrevNextNavigation from "@/components/configuration/PrevNextNavigation";

const Page: React.FC = () => {
    const router = useRouter();
    return (
        <>
            <ActiveSensingForm />
            <PrevNextNavigation
                onPrevClick={() => router.push("/create/passive-sensing")}
                onNextClick={() => router.push("/create/confirm")}
            />
        </>
    );
}

export default Page;