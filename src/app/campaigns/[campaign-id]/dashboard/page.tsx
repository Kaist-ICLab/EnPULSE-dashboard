import Card from "@/components/Card";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

const Dashboard: React.FC = () => {
    return (
        <div className="w-full min-h-full bg-gray-50 flex flex-row ">
            <Sidebar />
            <div className="flex flex-col w-full">
            <Header />
            <main className="flex flex-col w-full items-stretch p-4 grow">
                <Card>
                <p>This is the dashboard page.</p>
                </Card>
            </main>
            </div>
        </div>
    );
}
export default Dashboard;