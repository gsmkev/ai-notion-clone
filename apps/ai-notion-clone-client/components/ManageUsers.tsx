"use client";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { useState, useTransition } from "react";
import Spinner from "./ui/spinner";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { useUser } from "@clerk/nextjs";
import useOwner from "@/lib/useOwner";
import { useRoom } from "@liveblocks/react";
import { useCollection } from "react-firebase-hooks/firestore";
import { collectionGroup, query, where } from "firebase/firestore";
import { db } from "@/firebase";
import { removeUserFromDocument } from "@/actions/actions";

function ManageUsers() {
	const { user } = useUser();
	const room = useRoom();
	const isOwner = useOwner();
	const [isOpen, setIsOpen] = useState(false);
	const [isUpdating, startTransition] = useTransition();

	const [usersInRoom] = useCollection(
		user && query(collectionGroup(db, "rooms"), where("roomId", "==", room.id))
	);

	const handleRemove = async (userId: string) => {
		startTransition(async () => {
			if (!user) return;

			const { success } = await removeUserFromDocument(room.id, userId);

			if (success) {
				toast.success("User removed successfully");
			} else {
				toast.error("Failed to remove user");
			}
		});
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2">
				Users ({usersInRoom?.docs.length})
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Users with access</DialogTitle>
					<DialogDescription>
						Below is a list of users with access to this document
					</DialogDescription>
				</DialogHeader>
				<hr className="my-2" />
				<div className="flex flex-col space-y-2">
					{usersInRoom?.docs.map((doc) => (
						<div
							key={doc.data().userId}
							className="flex items-center justify-between"
						>
							<p className="font-light">
								{doc.data().userId === user?.emailAddresses[0].toString()
									? `You (${doc.data().userId})`
									: doc.data().userId}
							</p>

							<div className="flex items-center gap-2">
								{isOwner &&
									doc.data().userId !== user?.emailAddresses[0].toString() && (
										<Button
											variant="destructive"
											onClick={() => handleRemove(doc.data().userId)}
											disabled={isUpdating}
											size="sm"
										>
											{isUpdating ? <Spinner /> : "x"}
										</Button>
									)}
								<Button variant="outline" size="sm" disabled>
									{doc.data().role}
								</Button>
							</div>
						</div>
					))}
				</div>
			</DialogContent>
		</Dialog>
	);
}
export default ManageUsers;
