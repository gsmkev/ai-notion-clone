"use client";

import { FormEvent, useEffect, useState, useTransition } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { useDocumentData } from "react-firebase-hooks/firestore";

function Document({ id }: { id: string }) {
	const [data, loading, error] = useDocumentData(doc(db, "documents", id));
	const [input, setInput] = useState("");
	const [isUpdating, startTransition] = useTransition();

	useEffect(() => {
		if (data) setInput(data.title);
	}, [data]);

	const updateTitle = (e: FormEvent) => {
		e.preventDefault();
		if (input.trim()) {
			startTransition(async () => {
				await updateDoc(doc(db, "documents", id), {
					title: input,
				});
			});
		}
	};

	return (
		<div>
			<div className="flex max-w-6xl mx-auto justify-between pb-5">
				<form className="flex flex-1 space-x-2 " onSubmit={updateTitle}>
					{/* Update title */}
					<Input value={input} onChange={(e) => setInput(e.target.value)} />
					<Button disabled={isUpdating} type="submit">
						{isUpdating ? (
							<div className="animate-spin">
								<Loader2 size={40} />
							</div>
						) : (
							"Update"
						)}
					</Button>

					{/* if isOwner then inviteSection and deleteSection */}
				</form>
			</div>

			<div>
				{/* ManageUsers */}

				{/* Avatars */}
			</div>

			{/* Collaborative Editor */}
		</div>
	);
}
export default Document;
