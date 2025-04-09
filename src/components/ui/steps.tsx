
import * as React from "react";
import { cn } from "@/lib/utils";

export interface StepsProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Steps({ children, className, ...props }: StepsProps) {
  const childrenArray = React.Children.toArray(children);
  const stepsCount = childrenArray.length;

  return (
    <div className={cn("space-y-4", className)} {...props}>
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return null;

        return React.cloneElement(child as React.ReactElement<StepProps>, {
          stepNumber: index + 1,
          totalSteps: stepsCount,
          isLastStep: index === stepsCount - 1,
        });
      })}
    </div>
  );
}

export interface StepProps extends React.HTMLAttributes<HTMLDivElement> {
  stepNumber?: number;
  totalSteps?: number;
  isLastStep?: boolean;
}

export function Step({ 
  children, 
  className, 
  stepNumber, 
  isLastStep = false,
  ...props 
}: StepProps) {
  return (
    <div className={cn("relative", className)} {...props}>
      <div className="flex items-start">
        <div className="flex flex-col items-center mr-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-full border bg-background text-sm font-medium">
            {stepNumber}
          </div>
          {!isLastStep && <div className="h-full w-px bg-border mt-2" />}
        </div>
        <div className="flex-1 pb-6">{children}</div>
      </div>
    </div>
  );
}
