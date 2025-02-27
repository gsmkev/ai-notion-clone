"use client";

import { FormEvent, useEffect, useState, useTransition } from "react";
import { Input } from "./ui/input";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { useDocumentData } from "react-firebase-hooks/firestore";
import Editor from "./Editor";
import useOwner from "@/lib/useOwner";
import DeleteDocument from "./DeleteDocument";
import InviteUser from "./InviteUser";
import ManageUsers from "./ManageUsers";
import Avatars from "./Avatars";

function Document({ id }: { id: string }) {
	const [data, ,] = useDocumentData(doc(db, "documents", id));
	const [input, setInput] = useState("");
	const [, startTransition] = useTransition();
	const isOwner = useOwner();

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
		<div className="flex-1 bg-white p-5">
			<div className="flex max-w-6xl mx-auto flex-col md:flex-row justify-between pb-5">
				<div className="flex flex-col md:flex-row flex-1 space-y-2 md:space-y-0 md:space-x-2">
					<Input
						value={input}
						onMouseLeave={updateTitle}
						onChange={(e) => setInput(e.target.value)}
					/>
					<div className="flex justify-center space-x-2 md:space-x-2 md:flex-row md:items-center">
						{isOwner && (
							<>
								<ManageUsers />
								<InviteUser />
								<DeleteDocument />
							</>
						)}
					</div>
				</div>
			</div>

			<div className="flex max-w-6xl mx-auto justify-between items-center mb-5">
				<Avatars />
			</div>

			<Editor />
		</div>
	);
}
export default Document;
