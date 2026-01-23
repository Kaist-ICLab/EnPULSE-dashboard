"use client"
import ActiveSensingForm from "@/components/configuration/form/ActiveSensingForm";
import { useRouter } from "next/navigation";
import PrevNextNavigation from "@/components/configuration/PrevNextNavigation";

const Page: React.FC = () => {
    const router = useRouter();
    return (
        <>
            <ActiveSensingForm />
            <div className="w-full gap-4 flex my-5 pb-5">
                <PrevNextNavigation
                    onPrevClick={() => router.push("/create/name")}
                    onNextClick={() => router.push("/create/passive-sensing")}
                />
            </div>
        </>
    );
}

export default Page;