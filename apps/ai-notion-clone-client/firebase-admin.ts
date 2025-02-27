import { initializeApp, getApps, App, getApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

let app: App;

if (getApps().length === 0) {
	app = initializeApp({
		credential: cert(
			JSON.parse(
				Buffer.from(process.env.GOOGLE_CREDENTIALS || "", "base64").toString(
					"utf-8"
				)
			)
		),
	});
} else {
	app = getApp();
}

const adminDb = getFirestore(app);

export { app as adminApp, adminDb };
