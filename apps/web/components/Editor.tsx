"use client";
import { useEffect, useState } from "react";
import { BlockNoteEditor } from "@blocknote/core";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/shadcn";
import "@blocknote/shadcn/style.css";
import "@blocknote/core/style.css";
import * as Y from "yjs";
import { LiveblocksYjsProvider } from "@liveblocks/yjs";
import { useRoom, useSelf } from "@liveblocks/react/suspense";
import StringToColor from "@/lib/StringToColor";
import { Button } from "@workspace/ui/components/button";
import { MoonIcon, SunIcon } from "lucide-react";

type EditorProps = {
	doc: Y.Doc;
	provider: any;
};

function Editor() {
	const room = useRoom();
	const [doc, setDoc] = useState<Y.Doc>();
	const [provider, setProvider] = useState<any>();

	useEffect(() => {
		const yDoc = new Y.Doc();
		const yProvider = new LiveblocksYjsProvider(room, yDoc);
		setDoc(yDoc);
		setProvider(yProvider);
		return () => {
			yDoc?.destroy();
			yProvider?.destroy();
		};
	}, [room]);

	if (!doc || !provider) {
		return null;
	}
	return (
		<div className="max-w-6xl mx-auto">
			<div className="flex items-center gap-2 justify-end mb-10">
				{/* AI TranslateDocument */}
				{/* AI ChatToDocument */}
			</div>
			{/* BlockNote */}
			<BlockNote doc={doc} provider={provider} />
		</div>
	);
}

function BlockNote({ doc, provider }: EditorProps) {
	const userInfo = useSelf((me) => me.info);
	const editor: BlockNoteEditor = useCreateBlockNote({
		collaboration: {
			provider,
			fragment: doc.getXmlFragment("document-store"),
			user: {
				name: userInfo?.name,
				color: StringToColor(userInfo?.email),
			},
		},
	});
	return <BlockNoteView editor={editor} theme="light" />;
}
export default Editor;
