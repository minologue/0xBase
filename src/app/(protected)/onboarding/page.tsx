"use client";

import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { project } from "@/config/project";
import { completeOnboardingAction } from "@/features/onboarding/actions";

const STEP_COUNT = project.onboarding.steps;

type StepKey = "1" | "2" | "3" | "4" | "5";

/** Narrows a 1-based step number to the StepKey union; returns null if out of range. */
function toStepKey(n: number): StepKey | null {
	const valid = ["1", "2", "3", "4", "5"] satisfies StepKey[];
	const s = String(n);
	return (valid as string[]).includes(s) ? (s as StepKey) : null;
}

export default function OnboardingPage() {
	const t = useTranslations("onboarding");
	const [currentStep, setCurrentStep] = useState(0);
	const [responses, setResponses] = useState<Record<number, { question: string; answer: string }>>({});
	const [submitting, setSubmitting] = useState(false);

	// progress array is constant — computed once before any conditional returns
	const progress = useMemo(
		() => Array.from({ length: STEP_COUNT }, (_, i) => i),
		[],
	);

	const stepKey = toStepKey(currentStep + 1);
	if (!stepKey) return null;

	const question = t(`steps.${stepKey}.question`);
	const options = [
		t(`steps.${stepKey}.opt1`),
		t(`steps.${stepKey}.opt2`),
		t(`steps.${stepKey}.opt3`),
		t(`steps.${stepKey}.opt4`),
	];

	const handleSelect = async (value: string) => {
		const updatedResponses = { ...responses, [currentStep]: { question, answer: value } };
		setResponses(updatedResponses);

		if (currentStep < STEP_COUNT - 1) {
			setCurrentStep((prev) => prev + 1);
			return;
		}

		// Final step — persist responses and redirect
		setSubmitting(true);
		const result = await completeOnboardingAction(updatedResponses);
		if (result.success) {
			// Full reload so the new session reflects onboardingCompleted: true
			window.location.replace("/dashboard");
		} else {
			setSubmitting(false);
		}
	};

	return (
		<main className="min-h-screen flex justify-center items-center p-8 bg-background">
			<div className="w-full max-w-170 grid gap-6">
				<div className="flex gap-2">
					{progress.map((stepIndex) => {
						const active = stepIndex === currentStep;
						const complete = stepIndex < currentStep;
						return (
							<span
								key={stepIndex}
								className={`h-2 flex-1 rounded-full ${complete || active ? "bg-accent" : "bg-border"}`}
							/>
						);
					})}
				</div>
				<h1 className="font-display text-[2rem]">{question}</h1>
				<div className="grid gap-3">
					{options.map((option) => (
						<button
							key={option}
							type="button"
							onClick={() => handleSelect(option)}
							disabled={submitting}
							className={`px-4 py-[0.85rem] text-left rounded-md border border-border text-foreground font-sans cursor-pointer ${submitting ? "opacity-60 cursor-not-allowed" : ""} ${responses[currentStep]?.answer === option ? "bg-elevated" : "bg-surface"}`}
						>
							{option}
						</button>
					))}
				</div>
			</div>
		</main>
	);
}
