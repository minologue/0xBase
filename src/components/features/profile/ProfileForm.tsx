"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState, useTransition } from "react";
import { saveProfileAction } from "@/features/profile/actions";

type ProfileFormProps = {
	name: string | null;
	email: string;
	image: string | null;
};

function Avatar({
	name,
	image,
}: {
	name: string | null;
	image: string | null;
}) {
	if (image) {
		return (
			<Image
				src={image}
				alt={name ?? ""}
				width={72}
				height={72}
				className="rounded-full object-cover shrink-0"
			/>
		);
	}

	const initial = name ? name[0].toUpperCase() : "?";
	return (
		<div className="size-[72px] rounded-full bg-accent text-background flex items-center justify-center font-display text-[2rem] font-bold shrink-0 select-none">
			{initial}
		</div>
	);
}

/**
 * Client component for viewing and editing the user's profile.
 * Calls saveProfileAction server action; never sends userId in the form data.
 */
export function ProfileForm({ name, email, image }: ProfileFormProps) {
	const t = useTranslations("profile");
	const tc = useTranslations("common");
	const [isPending, startTransition] = useTransition();
	const [nameValue, setNameValue] = useState(name ?? "");
	const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

	const handleSave = () => {
		startTransition(async () => {
			const result = await saveProfileAction(nameValue);
			setStatus(result.success ? "success" : "error");
		});
	};

	return (
		<div className="grid gap-8">
			<Avatar name={name} image={image} />

			<div className="grid gap-4">
				<label className="grid gap-[0.4rem]">
					<span className="font-body text-[0.7rem] text-secondary uppercase tracking-widest">
						{t("name")}
					</span>
					<input
						type="text"
						value={nameValue}
						onChange={(e) => {
							setNameValue(e.target.value);
							setStatus("idle");
						}}
						className="bg-surface border border-border rounded-md px-[0.9rem] py-[0.65rem] text-foreground font-body text-[0.9rem] outline-none w-full"
					/>
				</label>

				<label className="grid gap-[0.4rem]">
					<span className="font-body text-[0.7rem] text-secondary uppercase tracking-widest">
						{t("email")}
					</span>
					<input
						type="email"
						value={email}
						readOnly
						className="bg-surface border border-border rounded-md px-[0.9rem] py-[0.65rem] text-muted font-body text-[0.9rem] outline-none w-full cursor-default"
					/>
				</label>
			</div>

			<div className="flex items-center gap-4">
				<button
					type="button"
					onClick={handleSave}
					disabled={isPending}
					className={`bg-accent text-background border-0 rounded-md px-6 py-[0.65rem] font-body text-[0.85rem] leading-none ${isPending ? "opacity-60 cursor-default" : "cursor-pointer"}`}
				>
					{tc("save")}
				</button>

				{status === "success" && (
					<span className="text-accent font-body text-[0.8rem]">
						{t("saveSuccess")}
					</span>
				)}
				{status === "error" && (
					<span className="text-secondary font-body text-[0.8rem]">
						{t("saveError")}
					</span>
				)}
			</div>
		</div>
	);
}
