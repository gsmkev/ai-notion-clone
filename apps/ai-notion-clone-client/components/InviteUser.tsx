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
import { FormEvent, useState, useTransition } from "react";
import Spinner from "./ui/spinner";
import { usePathname, useRouter } from "next/navigation";
import { deleteDocument, inviteUserToDocument } from "@/actions/actions";
import { toast } from "sonner";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

function InviteUser() {
	const [isOpen, setIsOpen] = useState(false);
	const [isInviting, startTransition] = useTransition();
	const [email, setEmail] = useState("");
	const path = usePathname();
	const router = useRouter();

	const handleInvite = async (e: FormEvent) => {
		e.preventDefault();

		const roomId = path.split("/").pop();
		if (!roomId) return;

		startTransition(async () => {
			const { success } = await inviteUserToDocument(roomId, email);
			if (success) {
				setIsOpen(false);
				setEmail("");
				toast.success("User invited successfully");
			} else {
				toast.error("Failed to invite user");
			}
		});
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2">
				Invite
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Invite a usert to collaborate</DialogTitle>
					<DialogDescription>
						Enter the email of the user you want to invite
					</DialogDescription>
				</DialogHeader>
				<form className="flex gap-2" onSubmit={handleInvite}>
					<Input
						type="email"
						placeholder="Email"
						className="w-full"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>
					<Button type="submit" disabled={email.trim() === "" || isInviting}>
						{isInviting ? <Spinner /> : "Invite"}
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	);
}
export default InviteUser;
