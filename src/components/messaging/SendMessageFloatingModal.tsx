import React, { useState } from 'react';

const SendMessageFloatingModal: React.FC<{
    sendTo: string,
    onClose: () => void;
    onSendButtonClick: () => void;
}> = ({ sendTo = '', onClose, onSendButtonClick }) => {
    const [messageType, setMessageType] = useState<'chat' | 'announcement'>('chat');

    return (
        <div className="fixed bottom-6 right-6 w-full sm:w-[500px] h-[500px] bg-white shadow-lg rounded-t-lg border border-gray-200 flex flex-col">
            <div className="p-3 bg-gray-100 rounded-t-lg flex justify-between items-center">
                <h3 className="font-semibold">New Message</h3>
                <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                    ×
                </button>
            </div>
            <div className="p-4 flex-1 flex flex-col">
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="To"
                        defaultValue={sendTo}
                        className="w-full p-2 border border-gray-300 rounded-md"
                    />
                </div>
                {messageType === 'announcement' && (
                    <div className="mb-4">
                        <input
                            type="text"
                            placeholder="Title"
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                )}
                <div className="flex-1">
                    <textarea
                        placeholder="Message"
                        className="w-full h-full p-2 border border-gray-300 rounded-md resize-none"
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
                        onClick={onSendButtonClick}
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SendMessageFloatingModal; 