"use client"
import { Button } from "flowbite-react";
import PassiveSensingForm from "@/components/create/Form/PassiveSensingForm";
import { useRouter } from "next/navigation";

const Page: React.FC = () => {
    const router = useRouter();
    return (
        <>
            <PassiveSensingForm />
            <div className="w-full gap-4 flex my-5 pb-5">
                <Button className="grow" size="lg" color="gray" onClick={() => router.push("/create/active-sensing")}>
                    Previous
                </Button>
                <Button className="grow" size="lg" onClick={() => router.push("/campaigns")}>
                    Next
                </Button>
            </div>
        </>
    );
}

export default Page;