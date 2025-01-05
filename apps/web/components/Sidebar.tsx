"use client";

import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@workspace/ui/components/sheet";
import NewDocumentButton from "./NewDocumentButton";
import { MenuIcon } from "lucide-react";
import { useCollection } from "react-firebase-hooks/firestore";
import { useUser } from "@clerk/nextjs";
import {
	collectionGroup,
	DocumentData,
	query,
	where,
} from "firebase/firestore";
import { db } from "@/firebase";
import { useEffect, useState } from "react";

interface RoomDocument extends DocumentData {
	createdAt: string;
	role: "owner" | "editor";
	roomId: string;
	userId: string;
}

function Sidebar() {
	const { user } = useUser();
	const [groupedData, setGroupData] = useState<{
		owner: RoomDocument[];
		editor: RoomDocument[];
	}>({
		owner: [],
		editor: [],
	});
	const [data, loading, error] = useCollection(
		user &&
			query(
				collectionGroup(db, "rooms"),
				where("userId", "==", user.emailAddresses[0]?.toString())
			)
	);

	useEffect(() => {
		if (!data) return;

		const grouped = data.docs.reduce<{
			owner: RoomDocument[];
			editor: RoomDocument[];
		}>(
			(acc, doc) => {
				const roomData = doc.data() as RoomDocument;
				if (roomData.role === "owner") {
					acc.owner.push({
						id: doc.id,
						...roomData,
					});
				} else {
					acc.editor.push({
						id: doc.id,
						...roomData,
					});
				}
				return acc;
			},
			{ owner: [], editor: [] }
		);
		setGroupData(grouped);
	}, [data]);

	const menuOptions = (
		<>
			<NewDocumentButton />

			<div className="flex py-4 flex-col space-y-4 md:max-w-36">
				{groupedData.owner.length === 0 ? (
					<h2 className="text-gray-500 font-semibold text-sm">
						No documents found
					</h2>
				) : (
					<>
						<h2 className="text-gray-500 font-semibold text-sm">
							My documents
						</h2>
						{groupedData.owner.map((doc) => (
							<p key={doc.id}>{doc.roomId}</p>
						))}
					</>
				)}
			</div>

			{/* Shared with me */}
			{/* List... */}
		</>
	);

	return (
		<div className="p-2 md:p-5 bg-gray-200 relative">
			<div className="md:hidden">
				<Sheet>
					<SheetTrigger>
						<MenuIcon className="p-2 hover:opacity-30 rounded-lg" size={40} />
					</SheetTrigger>
					<SheetContent side="left">
						<SheetHeader>
							<SheetTitle>Menu</SheetTitle>
							<div>{menuOptions}</div>
						</SheetHeader>
					</SheetContent>
				</Sheet>
			</div>
			<div className="hidden md:inline">{menuOptions}</div>
		</div>
	);
}
export default Sidebar;
