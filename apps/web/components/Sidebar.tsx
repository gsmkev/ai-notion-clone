import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@workspace/ui/components/sheet";
import NewDocumentButton from "./NewDocumentButton";
import { MenuIcon } from "lucide-react";

function Sidebar() {
	const menuOptions = (
		<>
			<NewDocumentButton />

			{/* My Documents */}
			{/* List... */}

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
