"use client";

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
import Spinner from "./ui/spinner";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import * as Y from "yjs";
import { BotIcon, MessageCircleCode } from "lucide-react";
import { extractTextFromRichText } from "@/lib/clean";

function AIChat({ doc }: { doc: Y.Doc }) {
	const [isOpen, setIsOpen] = useState(false);
	const [isThinking, startTransition] = useTransition();
	const [question, setQuestion] = useState("");
	const [summary, setSummary] = useState("");

	const handleQuestion = async (e: FormEvent) => {
		e.preventDefault();

		setSummary("");
		startTransition(async () => {
			const data = extractTextFromRichText(doc.get("document-store").toJSON());
			console.log(data);
			const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/chat`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ data, question }),
			});

			console.log(res);

			if (res.ok) {
				const response = await res.json();
				const answer = response.response || "No answer found.";
				setSummary(answer);
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
						setQuestion("");
					}
				}}
			>
				<DialogTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2">
					<MessageCircleCode />
					AI Chat
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Chat to the document with AI</DialogTitle>
						<DialogDescription>
							Ask any questions to the AI and get the answers in real-time
						</DialogDescription>
					</DialogHeader>
					<form className="flex gap-2" onSubmit={handleQuestion}>
						<Input
							type="text"
							placeholder="i.e. what is this about?"
							className="w-full"
							value={question}
							onChange={(e) => setQuestion(e.target.value)}
						/>
						<Button
							type="submit"
							disabled={question.trim() === "" || isThinking}
						>
							{isThinking ? <Spinner /> : "Ask"}
						</Button>
					</form>
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
export default AIChat;
