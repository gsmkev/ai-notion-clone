import { adminDb } from "@/firebase-admin";
import liveblocks from "@/lib/liveblocks";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	auth.protect();

	const { sessionClaims } = await auth();

	let body;
	try {
		body = await req.json();
	} catch {
		return NextResponse.json(
			{ message: "Invalid JSON input" },
			{ status: 400 }
		);
	}

	const { room } = body;

	if (!room) {
		return NextResponse.json(
			{ message: "Room ID is required" },
			{ status: 400 }
		);
	}

	const session = liveblocks.prepareSession(sessionClaims?.email!, {
		userInfo: {
			name: sessionClaims?.fullName!,
			email: sessionClaims?.email!,
			avatar: sessionClaims?.image!,
		},
	});

	const usersInRoom = await adminDb
		.collectionGroup("rooms")
		.where("userId", "==", sessionClaims?.email)
		.get();

	const userInRoom = usersInRoom.docs.find((doc) => doc.data().roomId === room);

	if (userInRoom?.exists) {
		session.allow(room, session.FULL_ACCESS);
		const { body, status } = await session.authorize();
		return new Response(body, { status });
	} else {
		return NextResponse.json(
			{ message: "You are not allowed to access this room" },
			{ status: 403 }
		);
	}
}
