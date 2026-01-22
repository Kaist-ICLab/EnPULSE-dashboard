"use client"
import { Button } from "flowbite-react";
import ActiveSensingForm from "@/components/create/Form/ActiveSensingForm";
import { useRouter } from "next/navigation";

const Page: React.FC = () => {
    const router = useRouter();
    return (
        <>
            <ActiveSensingForm />
            <div className="w-full gap-4 flex my-5 pb-5">
                <Button className="grow" size="lg" color="gray" onClick={() => router.push("/create/name")}>
                    Previous
                </Button>
                <Button className="grow" size="lg" onClick={() => router.push("/create/passive-sensing")}>
                    Next
                </Button>
            </div>
        </>
    );
}

export default Page;