"use client";

import * as Y from "yjs";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { FormEvent, useState, useTransition } from "react";
import { Button } from "./ui/button";
import Spinner from "./ui/spinner";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { ArrowRight, BotIcon, LanguagesIcon } from "lucide-react";
import { validateHeaderName } from "http";
import { extractTextFromRichText } from "@/lib/clean";

type Language =
	| "english"
	| "spanish"
	| "french"
	| "german"
	| "italian"
	| "portuguese"
	| "russian"
	| "japanese"
	| "korean"
	| "chinese";

const languages: Language[] = [
	"english",
	"spanish",
	"french",
	"german",
	"italian",
	"portuguese",
	"russian",
	"japanese",
	"korean",
	"chinese",
];

function AITranslation({ doc }: { doc: Y.Doc }) {
	const [isOpen, setIsOpen] = useState(false);
	const [isThinking, startTransition] = useTransition();
	const [summary, setSummary] = useState("");
	const [question, setQuestion] = useState("");
	const [source, setSource] = useState<Language | null>(null);
	const [target, setTarget] = useState<Language | null>(null);

	const handleAITranslation = async (e: FormEvent) => {
		e.preventDefault();
		setSummary("");
		startTransition(async () => {
			const data = extractTextFromRichText(doc.get("document-store").toJSON());
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_BASE_API_URL}/translate`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ data, source, target }),
				}
			);

			if (res.ok) {
				const { translated_text } = await res.json();
				setSummary(translated_text);
			}
		});
	};

	return (
		<div>
			<Dialog
				open={isOpen}
				onOpenChange={(isOpen) => {
					setIsOpen(isOpen);
					if (!isOpen) {
						setSummary("");
						setSource(null);
						setTarget(null);
					}
				}}
			>
				<DialogTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2">
					<LanguagesIcon />
					Translate
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Translate and Summarize usign AI</DialogTitle>
						<DialogDescription>
							Please select the source and target languages
						</DialogDescription>
					</DialogHeader>

					<form
						className="flex flex-col gap-4 items-center"
						onSubmit={handleAITranslation}
					>
						<div className="flex flex-col sm:flex-row gap-2 w-full justify-center">
							<Select
								value={source || undefined}
								onValueChange={(value) => setSource(value as Language)}
							>
								<SelectTrigger className="w-full sm:w-[180px]">
									<SelectValue placeholder="Source" />
								</SelectTrigger>
								<SelectContent>
									{languages.map((language) => (
										<SelectItem key={language} value={language}>
											{language.charAt(0).toUpperCase() + language.slice(1)}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<Select
								value={target || undefined}
								onValueChange={(value) => setTarget(value as Language)}
							>
								<SelectTrigger className="w-full sm:w-[180px]">
									<SelectValue placeholder="Target" />
								</SelectTrigger>
								<SelectContent>
									{languages.map((language) => (
										<SelectItem key={language} value={language}>
											{language.charAt(0).toUpperCase() + language.slice(1)}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<Button type="submit" disabled={!source || !target || isThinking}>
								{isThinking ? <Spinner /> : "Translate"}
							</Button>
						</div>
					</form>
					{question && (
						<DialogFooter>
							<p className="mt-5 text-gray-500">{question}</p>
						</DialogFooter>
					)}
					{summary && (
						<DialogFooter>
							<div className="flex flex-col items-start max-h-96 overflow-y-scroll gap-2 p-5 bg-gray-100">
								<div className="flex">
									<BotIcon className="w-10 flex-shrink-0" />
									<p className="font-bold">AI says:</p>
								</div>
								<p className="mt-5 text-gray-500">{summary}</p>
							</div>
						</DialogFooter>
					)}
				</DialogContent>
			</Dialog>
		</div>
	);
}
export default AITranslation;
