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
    label: string;
    switchOptions?: { label: string; value: string }[];
    onLabelChange?: (value: string) => void;
    wrapControl?: React.ReactNode;
    headerControls?: React.ReactNode;
    children?: React.ReactNode;
}> = ({ palette, label, switchOptions, onLabelChange, wrapControl, headerControls, children }) => {
    const p = PALETTES[palette];
    return (
        <div className={`rounded-md shadow-sm border ${p.border} overflow-hidden bg-white`}>
            <div className={`flex items-center gap-2 px-2 py-1 ${p.header} text-white font-semibold`}>
                {(switchOptions && switchOptions.length > 0) ?
                    <select className="border-none bg-transparent text-sm font-bold w-fit outline-none py-0.5" value={label} onChange={(e) => onLabelChange?.(e.target.value)}>{
                        switchOptions.map((option) => <option className="text-black" key={option.value} value={option.value}>{option.label}</option>)}
                    </select> :
                    <span className="text-sm pl-1">{label}</span>
                }
                <span className="grow"></span>

                {wrapControl && <>
                    <span className="text-xs ml-auto">wrap with:</span>
                    <div className="flex items-center gap-1 flex-wrap">{wrapControl}</div>
                    {headerControls && <div className="h-5 w-1 ml-1 border-white border-l-1"></div>}
                </>}
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