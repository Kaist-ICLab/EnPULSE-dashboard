'use client';

import React, { useEffect, useState } from 'react';
import DnDList from '@/components/common/DnDList';


const Item: React.FC<{
  pinned: boolean;
  onPinChanged: () => void;
  id: string;
}> = ({ id, pinned, onPinChanged }) => {
  return (
    <div className='relative'>
      <span>{id}</span>
      <button className='absolute top-0 right-0' onClick={(e) => {
        e.stopPropagation();
        onPinChanged()}}>{pinned ? '📌 UnPin' : '📌 Pin'}</button>
    </div>
  );
};


const ExampleDnDUsage = () => {
  const [items, setItems] = useState([
    { id: 'a', label: '🍎 Apple', pinned: false },
    { id: 'b', label: '🍌 Banana', pinned: false },
    { id: 'c', label: '🍇 Grape', pinned: false },
  ]);

  useEffect(() => {
    console.log(items);
  }, [items]);

  const handleItemsChange = (ids: string[]) => {
    console.log('Items changed:', ids);
    const pinned = items.find(item => item.pinned);
    const unpinnedItems = items.filter(item => !item.pinned);
    const reorderedUnpinned = ids.map(id => unpinnedItems.find(item => item.id === id)!);
    setItems(pinned ? [pinned, ...reorderedUnpinned] : reorderedUnpinned);
  };

  const handlePin = (id: string) => {
    console.log('Pin changed:', id);  
    setItems(prev => {
      const updated = prev.map(item => ({
        ...item,
        pinned: item.id === id ? !item.pinned : false
      }));
      const pinnedItem = updated.find(i => i.pinned);
      const others = updated.filter(i => !i.pinned);
      return pinnedItem ? [pinnedItem, ...others] : others;
    });
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">📦 Drag & Drop List with Pin</h1>

      {items.filter(i => i.pinned).map(i => (
        <Item key={i.id} id={i.id} pinned={i.pinned} onPinChanged={() => {handlePin(i.id)}} />
      ))}
      <DnDList
        items={items.filter(i => !i.pinned).map(i => i.id)}
        onItemsChange={handleItemsChange}
      >
        {items.filter(i => !i.pinned).map(item => (
          <Item key={item.id} id={item.id} pinned={item.pinned} onPinChanged={() => {handlePin(item.id)}} />
        ))}
      </DnDList>
    </div>
  );
};

export default ExampleDnDUsage;
