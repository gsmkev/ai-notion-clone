import { ArrowLeftCircle } from "lucide-react";

export default function Page() {
	return (
		<main className="flex space-x-2 items-center animate-pulse">
			<ArrowLeftCircle size={36} />
			<h1 className="font-bold">Get started by creating a new document</h1>
		</main>
	);
}
