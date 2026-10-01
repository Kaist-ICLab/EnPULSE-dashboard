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
    <div className={`rounded-md border shadow-sm ${p.border} overflow-hidden bg-white`}>
      <div className={`flex items-center gap-2 px-2 py-1 ${p.header} font-semibold text-white`}>
        {switchOptions && switchOptions.length > 0 ? (
          <select
            className="w-fit border-none bg-transparent py-0.5 text-sm font-bold outline-none"
            value={label}
            onChange={(e) => onLabelChange?.(e.target.value)}
          >
            {switchOptions.map((option) => (
              <option className="text-black" key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <span className="pl-1 text-sm">{label}</span>
        )}
        <span className="grow"></span>

        {wrapControl && (
          <>
            <span className="ml-auto text-sm">wrap with:</span>
            <div className="flex flex-wrap items-center gap-1">{wrapControl}</div>
            {headerControls && <div className="ml-1 h-7 w-1 border-l border-white"></div>}
          </>
        )}
        {headerControls && <div className="flex flex-wrap items-center gap-1">{headerControls}</div>}
      </div>
      {children !== undefined && <div className="flex flex-col gap-2 px-3 py-2">{children}</div>}
    </div>
  );
};

export const BlockSlot: React.FC<{
  palette: BlockPalette;
  children: React.ReactNode;
}> = ({ palette, children }) => {
  const p = PALETTES[palette];
  return <div className={`ml-2 border-l-4 pl-3 ${p.accent} flex flex-col gap-2`}>{children}</div>;
};

// A chip-style button rendered inside a block's header strip. Uses a soft translucent
// background so it stays legible on every palette. Sized h-7/text-sm (was h-5/text-xs)
// so it is easy to hit on a booth trackpad or touchscreen.
export const BlockHeaderButton: React.FC<{
  onClick: () => void;
  children: React.ReactNode;
  danger?: boolean;
}> = ({ onClick, children, danger }) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex h-7 cursor-pointer items-center justify-center rounded-md px-2.5 text-sm font-semibold transition-colors ${
      danger ? "bg-white/20 text-white hover:bg-red-600" : "bg-white/20 text-white hover:bg-white/40"
    }`}
  >
    {children}
  </button>
);
