import RoomProvider from "@/components/LiveBlocks/RoomProvider";
import { auth } from "@clerk/nextjs/server";

async function DocumentLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: Promise<{ id: string }>;
}) {
	auth.protect();
	const { id } = await params;
	return <RoomProvider roomId={id}>{children}</RoomProvider>;
}

export default DocumentLayout;
