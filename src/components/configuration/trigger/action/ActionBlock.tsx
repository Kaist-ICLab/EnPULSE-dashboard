'use client'

import {
    TRIGGER_ACTION_KIND_LABEL,
    TriggerAction,
} from "@/types/trigger";
import { Block, BlockHeaderButton } from "../blocks/Block";
import BroadcastAction from "./BroadcastAction";
import SurveyAction from "./SurveyAction";
import NotificationAction from "./NotificationAction";

// One action rendered as a green block. The body content depends on the action kind.
const ActionBlock: React.FC<{
    action: TriggerAction;
    onChange: (next: TriggerAction) => void;
    onRemove: () => void;
}> = ({ action, onChange, onRemove }) => {
    return (
        <Block
            palette="green"
            label={TRIGGER_ACTION_KIND_LABEL[action.kind]}
            headerControls={<BlockHeaderButton danger onClick={onRemove}><span className="icon-[humbleicons--times] w-3 h-3"></span></BlockHeaderButton>}
        >
            {action.kind === "broadcast" ? (
                <BroadcastAction action={action} onChange={onChange} />
            ) : action.kind === "notification" ? (
                <NotificationAction action={action} onChange={onChange} />
            ) : (
                <SurveyAction action={action} onChange={onChange} />
            )}
        </Block>
    );
};

export default ActionBlock;
