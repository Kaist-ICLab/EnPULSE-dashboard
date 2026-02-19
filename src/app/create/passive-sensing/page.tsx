"use client"
import PassiveSensingForm from "@/components/configuration/form/PassiveSensingForm";
import { useRouter } from "next/navigation";
import PrevNextNavigation from "@/components/configuration/PrevNextNavigation";
import { useValidConfigState } from "@/hooks/configuration/useValidConfigState";

const Page: React.FC = () => {
    const router = useRouter();
    const { isPassiveSensingValid } = useValidConfigState();

    return (
        <>
            <PassiveSensingForm />
            <PrevNextNavigation
                onPrevClick={() => router.push("/create/name")}
                onNextClick={() => router.push("/create/active-sensing")}
                disabled={!isPassiveSensingValid}
            />
        </>
    );
}

export default Page;