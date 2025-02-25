"use client";

import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { useState, useTransition } from "react";
import { Button } from "./ui/button";
import Spinner from "./ui/spinner";
import { usePathname, useRouter } from "next/navigation";
import { deleteDocument } from "@/actions/actions";
import { toast } from "sonner";

function DeleteDocument() {
	const [isOpen, setIsOpen] = useState(false);
	const [isDeleting, startTransition] = useTransition();
	const path = usePathname();
	const router = useRouter();

	const HandleDelete = async () => {
		const roomId = path.split("/").pop();
		if (!roomId) return;

		startTransition(async () => {
			const { success } = await deleteDocument(roomId);
			if (success) {
				setIsOpen(false);
				router.replace("/");
				toast.success("Document deleted successfully");
			} else {
				toast.error("Failed to delete document");
			}
		});
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-destructive text-primary-foreground shadow hover:bg-destructive/90 h-9 px-4 py-2">
				Delete
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Are you absolutely sure?</DialogTitle>
					<DialogDescription>
						This action cannot be undone. This will permanently delete your
						document and remove it from our servers.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter className="sm:justify-end gap-2">
					<DialogTrigger
						onClick={HandleDelete}
						disabled={isDeleting}
						className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-destructive text-primary-foreground shadow hover:bg-destructive/90 h-9 px-4 py-2"
					>
						{isDeleting ? <Spinner /> : "Delete"}
					</DialogTrigger>
					<DialogClose className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2">
						Cancel
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
export default DeleteDocument;
