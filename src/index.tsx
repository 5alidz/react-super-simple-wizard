import * as React from 'react';

type StepProps<T> = {
  next(): void;
  prev(): void;
  goto(key: keyof T | 'initial'): void;
  hasNext: boolean;
  hasPrev: boolean;
  id: keyof T;
};

type StepRenderer<T> = (stepProps: StepProps<T>) => JSX.Element;

type WizardProps<T extends Record<string, unknown>> = {
  [Key in keyof T]: Key extends 'initial'
  ? Exclude<keyof T, 'initial'>
  : StepRenderer<T>;
};

// eslint-disable-next-line comma-spacing
const objKeys = <O,>(obj: O): (keyof O)[] => Object.keys(obj) as (keyof O)[];

/**
 *
 * @example
 * type WizardProps = WizardStepProps<'stepOne' | 'stepTwo'>
 *
 * const StepOne = (props: WizardProps) => <div>...</div>
 * const StepTwo = (props: WizardProps) => <div>...</div>
 *
 * // render
 * <Wizard initial="stepOne" stepOne={StepOne} stepTwo={StepTwo} />
 *
 */
export function Wizard<T extends Record<string, unknown>>(
  props: WizardProps<T> & { initial: keyof T }
) {
  const [currentStep, setCurrentStep] = React.useState(() => props.initial);
  const stepsList = React.useMemo(
    () => objKeys(props).filter((key): key is keyof T => key !== 'initial'),
    [props]
  );
  const componentsRef = React.useMemo(
    () => new Map(stepsList.map((key) => [key, props[key]] as const)),
    [stepsList]
  );
  const nextStep = React.useMemo(() => {
    const nextIndex = stepsList.indexOf(currentStep) + 1;
    if (nextIndex === 0 || !stepsList[nextIndex]) return null;
    return stepsList[nextIndex];
  }, [stepsList, currentStep]);

  const prevStep = React.useMemo(() => {
    const prevIndex = stepsList.indexOf(currentStep) - 1;
    if (prevIndex === -2 || !stepsList[prevIndex]) return null;
    return stepsList[prevIndex];
  }, [stepsList, currentStep]);

  const renderStep =
    componentsRef.get(
      currentStep === 'initial' ? props.initial : currentStep
    );
  const hasNext = nextStep !== null;
  const hasPrev = prevStep !== null;

  if (!renderStep || typeof currentStep == 'symbol')
    throw new Error(`invalid wizard step ${String(currentStep)}`);

  return renderStep({
    goto: (stepKey) => {
      setCurrentStep(stepKey === 'initial' ? props.initial : stepKey)
    },
    next: () => hasNext && setCurrentStep(nextStep),
    prev: () => hasPrev && setCurrentStep(prevStep),
    hasNext,
    hasPrev,
    id: currentStep
  });
}

export type WizardStepProps<
  T extends string,
  WP = WizardProps<Record<T | 'initial', unknown>>
  > = StepProps<WP>;
