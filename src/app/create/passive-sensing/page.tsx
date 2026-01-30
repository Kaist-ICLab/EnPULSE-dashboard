"use client"
import PassiveSensingForm from "@/components/configuration/form/PassiveSensingForm";
import { useRouter } from "next/navigation";
import PrevNextNavigation from "@/components/configuration/PrevNextNavigation";

const Page: React.FC = () => {
    const router = useRouter();
    return (
        <>
            <PassiveSensingForm />
            <PrevNextNavigation
                onPrevClick={() => router.push("/create/name")}
                onNextClick={() => router.push("/create/active-sensing")}
            />
        </>
    );
}

export default Page;