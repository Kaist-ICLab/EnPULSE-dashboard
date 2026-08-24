import { useCampaignConfigEdit } from "@/providers/CampaignConfigEditStoreProvider";
import { useParams, useRouter } from "next/navigation";
import { Button, Select } from "flowbite-react";

export default function AddQuestionHeader() {
  const params = useParams();
  const router = useRouter();
  const currentSurveyIndex = parseInt(params.index as string);
  const { surveys, addSurveyQuestion } = useCampaignConfigEdit((state) => state);

  const handleSurveySelect = (index: number) => {
    router.push(`./${index}`);
  };

  return (
    <div className="flex w-full items-center">
      <Select
        value={currentSurveyIndex}
        onChange={(e) => handleSurveySelect(parseInt(e.target.value))}
        className="ml-auto w-40 font-bold"
      >
        {surveys.map((survey, index) => (
          <option key={index} value={index}>
            {survey.title}
          </option>
        ))}
      </Select>
      <Button color="blue" onClick={() => addSurveyQuestion(currentSurveyIndex, [])} className="ml-4">
        <span className="icon-[tabler--plus] mr-2"></span> Add Question
      </Button>
    </div>
  );
}
