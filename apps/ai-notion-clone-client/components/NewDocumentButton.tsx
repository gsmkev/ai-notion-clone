"use client";

import { useTransition } from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { createNewDocument } from "@/actions/actions";

function NewDocumentButton() {
	const [isPending, startTransition] = useTransition();
	const router = useRouter();

	const handleCreateNewDocument = () => {
		startTransition(async () => {
			const { docId } = await createNewDocument();
			router.push(`/doc/${docId}`);
		});
	};

	return (
		<Button onClick={handleCreateNewDocument} disabled={isPending}>
			{isPending ? (
				<div className="animate-spin">
					<Loader2 size={40} />
				</div>
			) : (
				"New Document"
			)}
		</Button>
	);
}
export default NewDocumentButton;
