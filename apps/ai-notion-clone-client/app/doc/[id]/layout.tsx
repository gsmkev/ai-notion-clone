import RoomProvider from "@/components/LiveBlocks/RoomProvider";
import { auth } from "@clerk/nextjs/server";

async function DocumentLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: { id: string };
}) {
	const { id } = params;
	auth.protect();
	return <RoomProvider roomId={id}>{children}</RoomProvider>;
}

export default DocumentLayout;
