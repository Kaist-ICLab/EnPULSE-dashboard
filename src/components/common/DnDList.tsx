"use client";
import { DndContext, closestCenter, useSensor, useSensors, PointerSensor, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import React, { createContext, useContext } from "react";

export const DnDProvider: React.FC<{
  items: string[];
  onItemsChange: (items: string[]) => void;
  children: React.ReactNode;
}> = ({ items, onItemsChange, children }) => {
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.indexOf(active.id as string);
    const newIndex = items.indexOf(over.id as string);
    const newOrder = arrayMove(items, oldIndex, newIndex);
    onItemsChange(newOrder);
  };


  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        {children}
      </SortableContext>
    </DndContext>
  );
};

const DnDItemContext = createContext<{ listeners: any; attributes: any } | null>(null);
const useDnDItemContext = () => {
  const ctx = useContext(DnDItemContext);
  if (!ctx) throw new Error("DragHandle must be used within a DnDItem");
  return ctx;
};

export const DnDItem: React.FC<{
  id: string;
  className?: string;
  children: React.ReactNode;
}> = ({ id, className, children }) => {
  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
      }}
      className={`relative ${className || ""}`}
    >
      <DnDItemContext.Provider value={{ listeners, attributes }}>{children}</DnDItemContext.Provider>
    </div>
  );
};

export const DragHandle: React.FC<{
  className?: string;
  children: React.ReactNode;
}> = ({ className, children }) => {
  const { listeners } = useDnDItemContext();
  return (
    <div className={`cursor-grab ${className || ""}`} {...listeners}>
      {children}
    </div>
  );
};
