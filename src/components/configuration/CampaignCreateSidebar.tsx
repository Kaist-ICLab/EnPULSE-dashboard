"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { Button } from "flowbite-react";
import { Modal } from "@/components/common/Modal";
import { useValidConfigState } from "@/hooks/configuration/useValidConfigState";

const DashboardSidebar: React.FC = () => {
  const pathname = usePathname();
  const { isAccessible } = useValidConfigState();
  const [isStartOverOpen, setIsStartOverOpen] = useState(false);

  const steps = [
    { name: "Campaign Information", href: `/create/general` },
    { name: "Passive Sensing", href: `/create/passive-sensing` },
    { name: "Active Sensing", href: `/create/active-sensing` },
    { name: "Web App", href: `/create/webapp` },
    { name: "Triggers", href: `/create/triggers` },
    { name: "Confirm Configuration", href: `/create/confirm` },
  ];

  const currentStepIndex = (() => {
    if (pathname.includes("/general")) return 0;
    if (pathname.includes("/passive-sensing")) return 1;
    if (pathname.includes("/active-sensing")) return 2;
    if (pathname.includes("/webapp")) return 3;
    if (pathname.includes("/triggers")) return 4;
    if (pathname.includes("/confirm")) return 5;
    return 0;
  })();

  return (
    <div className="flex h-screen w-64 flex-col border-r border-gray-300 bg-gray-50 px-6 py-4">
      <h2 className="mb-8 text-lg font-semibold text-gray-800">Create Campaign</h2>
      <div className="relative flex flex-col">
        {/* Progress bar line */}
        <div className="absolute top-8 bottom-16 left-4 w-0.5 bg-gray-200">
          <div
            className="absolute top-0 left-0 w-full bg-blue-600 transition-all duration-300"
            style={{ height: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
          />
        </div>

        {steps.map((step, index) => {
          const isActive = index === currentStepIndex;
          // A checkmark means the step is passed AND valid (isAccessible[i + 1] is true only
          // when every step up to i is valid), not merely that it comes before the current one.
          const isCompleted = index < currentStepIndex && isAccessible[index + 1];
          const isLocked = !isAccessible[index] && !isActive;

          const content = (
            <>
              {/* Step number circle */}
              <div
                className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all duration-200 ${
                  isActive || isCompleted
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-gray-300 bg-white text-gray-400"
                }`}
              >
                {isCompleted ? (
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <span className="text-sm font-semibold">{index + 1}</span>
                )}
              </div>

              {/* Step content */}
              <div className="flex-1">
                <div
                  className={`text-sm font-medium transition-colors ${
                    isActive
                      ? "text-blue-600"
                      : isCompleted
                        ? "text-gray-700"
                        : isLocked
                          ? "text-gray-300"
                          : "text-gray-400 group-hover:text-gray-600"
                  }`}
                >
                  {step.name}
                </div>
              </div>
            </>
          );

          // Locked steps used to be a Link with href="", which looked clickable but did nothing.
          if (isLocked) {
            return (
              <div
                key={index}
                className="relative mb-8 flex cursor-not-allowed items-center gap-4"
                title="Complete the previous steps first"
                aria-disabled="true"
              >
                {content}
              </div>
            );
          }

          return (
            <Link
              key={index}
              href={step.href}
              className={`group relative mb-8 flex items-center gap-4 ${isActive ? "cursor-default" : "cursor-pointer"}`}
            >
              {content}
            </Link>
          );
        })}
      </div>

      {/* Lets the next person at a shared screen begin from an empty wizard. */}
      <Button color="light" size="sm" className="mt-auto" onClick={() => setIsStartOverOpen(true)}>
        <span className="icon-[tabler--refresh] mr-2 h-4 w-4"></span> Start over
      </Button>

      {isStartOverOpen && (
        <Modal onClose={() => setIsStartOverOpen(false)} title="Start over?" className="w-full max-w-md">
          <div className="flex flex-col gap-4 p-5">
            <p className="text-sm text-gray-700">This clears everything entered so far and starts a new campaign.</p>
            <div className="flex justify-end gap-2">
              <Button color="gray" onClick={() => setIsStartOverOpen(false)}>
                Cancel
              </Button>
              {/* A full reload creates a fresh wizard store (it lives in create/layout.tsx). */}
              <Button color="red" onClick={() => window.location.assign("/create/general")}>
                Start over
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default DashboardSidebar;
