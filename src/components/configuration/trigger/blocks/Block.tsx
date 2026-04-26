// Block primitives for the trigger editor's Scratch / Blockly-like rendering.
// `Block` is a single colored block (header strip + optional white body).
// `BlockSlot` is the "C-shape" indented region that holds child blocks of a container block.
//
// Tailwind v4 cannot detect dynamically composed classes (e.g. `bg-${palette}-400`),
// so each palette is a fixed object literal whose strings are statically present.

const PALETTES = {
    amber: { border: "border-amber-500", header: "bg-amber-500", accent: "border-amber-500" },
    blue: { border: "border-blue-700", header: "bg-blue-700", accent: "border-blue-700" },
    green: { border: "border-green-500", header: "bg-green-500", accent: "border-green-500" },
} as const;

export type BlockPalette = keyof typeof PALETTES;

export const Block: React.FC<{
    palette: BlockPalette;
    label: React.ReactNode;
    headerControls?: React.ReactNode;
    children?: React.ReactNode;
}> = ({ palette, label, headerControls, children }) => {
    const p = PALETTES[palette];
    return (
        <div className={`rounded-md shadow-sm border ${p.border} overflow-hidden bg-white`}>
            <div className={`flex items-center gap-2 px-3 py-1 ${p.header} text-white text-sm font-semibold`}>
                <span className="grow">{label}</span>
                {headerControls && <div className="flex items-center gap-1 flex-wrap">{headerControls}</div>}
            </div>
            {children !== undefined && (
                <div className="px-3 py-2 flex flex-col gap-2">{children}</div>
            )}
        </div>
    );
};

export const BlockSlot: React.FC<{
    palette: BlockPalette;
    children: React.ReactNode;
}> = ({ palette, children }) => {
    const p = PALETTES[palette];
    return (
        <div className={`pl-3 ml-2 border-l-4 ${p.accent} flex flex-col gap-2`}>
            {children}
        </div>
    );
};

// A small chip-style button rendered inside a block's header strip. Uses a soft
// translucent background so it stays legible on every palette.
export const BlockHeaderButton: React.FC<{
    onClick: () => void;
    children: React.ReactNode;
    danger?: boolean;
}> = ({ onClick, children, danger }) => (
    <button
        type="button"
        onClick={onClick}
        className={`flex items-center justify-center h-5 cursor-pointer text-xs font-semibold px-2 rounded-md transition-colors ${danger
            ? "bg-white/20 hover:bg-red-600 text-white"
            : "bg-white/20 hover:bg-white/40 text-white"
            }`}
    >
        {children}
    </button>
);