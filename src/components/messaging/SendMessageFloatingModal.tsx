
import useSendMessage from '@/hooks/messaging/useSendMessage';
import { useCampaignStore } from '@/providers/CampaignStoreProvider';
import { CampaignParticipant } from '@/types/campaign';
import { Button } from 'flowbite-react';
import React, { useState } from 'react';
import EmailAutocompleteInput from './EmailAutocompleteInput';

const SendMessageFloatingModal: React.FC<{
    initialSendTo: CampaignParticipant[],
    onClose: () => void;
}> = ({ initialSendTo = [], onClose }) => {
    const { selectedCampaignId } = useCampaignStore((state) => state);
    const [sendTo, setSendTo] = useState(initialSendTo);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [messageType, setMessageType] = useState<'chat' | 'announcement'>('chat');
    const { sendMessageByUuid } = useSendMessage({ title, content, message_type: messageType, sender_type: 'admin' });

    return (
        <div className="fixed bottom-6 right-6 w-full sm:w-[500px] h-[500px] bg-white shadow-lg rounded-t-lg border border-gray-200 flex flex-col">
            <div className="p-3 bg-gray-100 rounded-t-lg flex justify-between items-center">
                <h3 className="font-semibold">New Message</h3>
                <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                    <span className="icon-[humbleicons--times] w-5 h-5 cursor-pointer"></span>
                </button>
            </div>
            <div className="p-4 flex-1 flex flex-col">
                <div className="mb-4">
                    <EmailAutocompleteInput
                        sendTo={sendTo}
                        setSendTo={setSendTo}
                    />
                </div>
                {messageType === 'announcement' && (
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Title"
                            value={title}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                )}
                <div className="flex-1">
                    <textarea
                        placeholder="Message"
                        value={content}
                        className="w-full h-full p-2 border border-gray-300 rounded-md resize-none"
                        onChange={(e) => setContent(e.target.value)}
                    />
                </div>
                <div className="mt-4 flex justify-end gap-2">
                    <Button color={`${messageType === 'chat' ? 'blue' : 'yellow'}`} size="md" className="flex flex-row gap-1 text-base px-3" onClick={() => setMessageType(messageType === 'chat' ? 'announcement' : 'chat')}>
                        {messageType === 'chat' ? 'Chat' : 'Announcement'}
                    </Button>
                    <Button color={`${messageType === 'chat' ? 'blue' : 'yellow'}`} size="md" className="flex flex-row gap-1 text-base px-3" onClick={async () => {
                        await sendMessageByUuid(sendTo.map(v => v.uuid), selectedCampaignId!);
                        onClose();
                    }}>
                        <span className="w-5 h-5 mt-0.5 icon-[material-symbols--send]"></span> Send
                    </Button>
                </div>
            </div>
        </div >
    );
};

export default SendMessageFloatingModal; 