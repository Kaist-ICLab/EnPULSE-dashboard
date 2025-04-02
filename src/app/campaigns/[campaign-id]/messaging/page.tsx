import Card from "@/components/Card";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import React from "react";

const Messaging: React.FC = () => {
  return (
    <div className="w-full min-h-full bg-gray-50 flex flex-row ">
      <Sidebar />
      <div className="flex flex-col w-full">
        <Header />
        <main className="flex flex-col w-full items-stretch p-4 grow">
          <Card>
            <p>This is the messaging page.</p>
          </Card>
        </main>
      </div>
    </div>
  );
}
export default Messaging;