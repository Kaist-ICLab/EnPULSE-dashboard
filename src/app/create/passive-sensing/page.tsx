"use client"
import { useRouter } from "next/navigation";

import PassiveSensingForm from "@/components/configuration/form/PassiveSensingForm";
import PrevNextNavigation from "@/components/configuration/PrevNextNavigation";

const Page: React.FC = () => {
    const router = useRouter();
    return (
        <>
            <PassiveSensingForm />
            <PrevNextNavigation
                onPrevClick={() => router.push("/create/active-sensing")}
                onNextClick={() => router.push("/campaigns")}
            />
        </>
    );
}

export default Page;