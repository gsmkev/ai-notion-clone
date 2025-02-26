"use client";

import { MenuIcon } from "lucide-react";
import NewDocumentButton from "./NewDocumentButton";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
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
import SidebarOption from "./SidebarOption";

interface RoomDocument extends DocumentData {
	createdAt: string;
	role: "owner" | "editor";
	roomId: string;
	userId: string;
}

function Sidebar() {
	const { user } = useUser();
	const [groupedData, setGroupedData] = useState<{
		owner: RoomDocument[];
		editor: RoomDocument[];
	}>({ owner: [], editor: [] });
	const [data, loading, error] = useCollection(
		user &&
			query(
				collectionGroup(db, "rooms"),
				where("userId", "==", user.emailAddresses[0].toString())
			)
	);

	useEffect(() => {
		if (!data) return;

		const grouped = data.docs.reduce<{
			owner: RoomDocument[];
			editor: RoomDocument[];
		}>(
			(acc, doc) => {
				const room = doc.data() as RoomDocument;
				acc[room.role].push({
					id: doc.id,
					...room,
				});
				return acc;
			},
			{ owner: [], editor: [] }
		);
		setGroupedData(grouped);
	}, [data]);

	const menuOptions = (
		<>
			<NewDocumentButton />
			<div className="flex py-4 flex-col space-y-4 md:max-w-36">
				{/* My Documents */}
				<h2 className="text-gray-500 font-semibold text-sm">My Documents</h2>
				<hr className="border-t border-gray-300 my-4" />
				{groupedData.owner.length === 0 ? (
					<h2 className="text-gray-500 font-semibold text-sm">
						You don{`'`}t have any documents.
					</h2>
				) : (
					groupedData.owner.map((doc) => (
						<SidebarOption
							key={doc.id}
							id={doc.id}
							href={`/doc/${doc.roomId}`}
						/>
					))
				)}

				{/* Shared with me */}
				<h2 className="text-gray-500 font-semibold text-sm">Shared with me</h2>
				<hr className="border-t border-gray-300 my-4" />
				{groupedData.editor.length === 0 ? (
					<h2 className="text-gray-500 font-semibold text-sm">
						No documents shared with you.
					</h2>
				) : (
					groupedData.editor.map((doc) => (
						<SidebarOption
							key={doc.id}
							id={doc.id}
							href={`/doc/${doc.roomId}`}
						/>
					))
				)}
			</div>
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
