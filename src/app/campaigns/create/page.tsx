import { Card } from "flowbite-react";
import CampaignCreateForm from "@/components/create/CampaignCreateForm";

const Page: React.FC = () => {
    return (
        <div className="w-full min-h-screen bg-gray-50 flex flex-row ">
            <aside className="min-h-screen w-64 flex flex-col border-r border-gray-200">
                <div className="px-5 h-16 flex items-center text-black text-2xl font-bold">DataSentry</div>
            </aside>
            <div className="flex flex-col w-full p-4">
                <Card>
                    <CampaignCreateForm />
                </Card>
            </div>
        </div>
    );
}
export default Page;