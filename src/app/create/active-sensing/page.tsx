"use client"
import ActiveSensingForm from "@/components/configuration/form/ActiveSensingForm";
import { useRouter } from "next/navigation";
import PrevNextNavigation from "@/components/configuration/PrevNextNavigation";

const Page: React.FC = () => {
    const router = useRouter();
    return (
        <>
            <ActiveSensingForm />
            <PrevNextNavigation
                onPrevClick={() => router.push("/create/name")}
                onNextClick={() => router.push("/create/passive-sensing")}
            />
        </>
    );
}

export default Page;