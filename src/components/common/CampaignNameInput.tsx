// import { TextInput, Button } from "flowbite-react";
// import Section from "@/components/common/Section";
// import { Dispatch, SetStateAction } from "react";

// const NameCampaign: React.FC<{
//     name: string,
//     setName: Dispatch<SetStateAction<string>>,
//     status: { success: boolean; message: string } | null,
//     label: string,
//     onClick: () => void,
// }> = ({ name, setName, status, label, onClick }) => {

//     return (
//         <Section title="General">
//             <div>
//                 <h6 className="text-base font-medium text-gray-900 mb-2">
//                     Campaign name
//                 </h6>
//                 <div className="flex gap-2">
//                     <TextInput
//                         type="text"
//                         value={name}
//                         onChange={(e) => setName(e.target.value)}
//                         className="w-[421px]"
//                     />
//                     <Button
//                         color="gray"
//                         onClick={onClick}
//                         className="text-gray-900 font-medium bg-gray-50 border border-gray-300 hover:bg-gray-100 h-[42px]"
//                     >
//                         {label}
//                     </Button>
//                 </div>
//                 {status && (
//                     <div className={`mt-2 text-sm ${status.success ? 'text-green-600' : 'text-amber-600'}`}>
//                         {status.message}
//                     </div>
//                 )}
//             </div>
//         </Section>
//     );
// };

// export default NameCampaign; 