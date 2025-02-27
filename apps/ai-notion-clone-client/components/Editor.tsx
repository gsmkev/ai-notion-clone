"use client";

import { useRoom, useSelf } from "@liveblocks/react/suspense";
import { useEffect, useState } from "react";
import * as Y from "yjs";
import { LiveblocksYjsProvider } from "@liveblocks/yjs";
import { Button } from "./ui/button";
import { MoonIcon, SunIcon } from "lucide-react";
import { BlockNoteEditor } from "@blocknote/core";
import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import "@blocknote/shadcn/style.css";

import stringToColor from "@/lib/stringToColor";
import AITranslation from "./AITranslation";
import AIChat from "./AIChat";

export type YJSDoc = Y.Doc;

type EditorProps = {
	doc: Y.Doc;
	provider: LiveblocksYjsProvider;
	darkMode: boolean;
};

function BlockNote({ darkMode, doc, provider }: EditorProps) {
	const userInfo = useSelf((me) => me.info);

	const editor: BlockNoteEditor = useCreateBlockNote({
		collaboration: {
			provider,
			fragment: doc.getXmlFragment("document-store"),
			user: {
				name: userInfo.name,
				color: stringToColor(userInfo.email),
			},
		},
	});

	return (
		<div className="relative mx-auto max-w-6xl">
			<BlockNoteView
				className="min-h-screen"
				editor={editor}
				theme={darkMode ? "dark" : "light"}
			/>
		</div>
	);
}

function Editor() {
	const room = useRoom();
	const [doc, setDoc] = useState<Y.Doc>();
	const [provider, setProvider] = useState<LiveblocksYjsProvider>();
	const [darkMode, setDarkMode] = useState(false);

	useEffect(() => {
		const yDoc = new Y.Doc();
		const yProvider = new LiveblocksYjsProvider(room, yDoc);
		setDoc(yDoc);
		setProvider(yProvider);

		return () => {
			yDoc.destroy();
			yProvider.destroy();
		};
	}, [room]);

	if (!doc || !provider) {
		return null;
	}

	return (
		<div className="max-w-6xl mx-auto">
			<div className="flex items-center gap-2 justify-between md:justify-end mb-10">
				<AITranslation doc={doc} />
				<AIChat doc={doc} />

				<Button
					className={` ${
						darkMode ? "text-white bg-black " : "text-black bg-white "
					}`}
					onClick={() => setDarkMode((prev) => !prev)}
				>
					{darkMode ? <MoonIcon /> : <SunIcon />}
				</Button>
			</div>

			<BlockNote doc={doc} provider={provider} darkMode={darkMode} />
		</div>
	);
}
export default Editor;
