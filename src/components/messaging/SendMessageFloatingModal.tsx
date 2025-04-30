import useCampaign from '@/hooks/useCampaign';
import useSendMessage from '@/hooks/messaging/sendMessage';
import React, { useState } from 'react';

const SendMessageFloatingModal: React.FC<{
    initialSendTo: string,
    onClose: () => void;
}> = ({ initialSendTo = '', onClose }) => {
    const { selectedCampaignId } = useCampaign();
    const [sendTo, setSendTo] = useState(initialSendTo);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [messageType, setMessageType] = useState<'chat' | 'announcement'>('chat');
    const { sendMessageByEmail } = useSendMessage({ title, content, message_type: messageType, sender_type: 'admin' });

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
                    <input
                        type="text"
                        placeholder="To"
                        value={sendTo}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        onChange={(e) => setSendTo(e.target.value)}
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
                    <button
                        className={`px-4 py-2 rounded-md transition-colors ${messageType === 'chat'
                            ? 'bg-blue-500 text-white'
                            : 'bg-yellow-500 text-white'
                            }`}
                        onClick={() => setMessageType(messageType === 'chat' ? 'announcement' : 'chat')}
                    >
                        {messageType === 'chat' ? 'Chat' : 'Announcement'}
                    </button>
                    <button
                        className={`px-4 py-2 text-white rounded-md hover:opacity-90 transition-colors ${messageType === 'chat' ? 'bg-blue-500' : 'bg-yellow-500'
                            }`}
                        onClick={async () => {
                            await sendMessageByEmail(sendTo.split(',').map(v => v.trim()), selectedCampaignId!);
                            onClose();
                        }}
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SendMessageFloatingModal; 