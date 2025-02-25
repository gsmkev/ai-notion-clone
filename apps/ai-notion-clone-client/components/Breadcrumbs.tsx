"use client";

import { usePathname } from "next/navigation";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

function Breadcrumbs() {
	const path = usePathname();
	const segments = path.split("/").filter((segment) => segment !== "");
	return (
		<div>
			<Breadcrumb>
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink href="/">Home</BreadcrumbLink>
						{segments.length > 0 && <BreadcrumbSeparator />}
					</BreadcrumbItem>

					{segments.map((segment, index) => {
						const isLast = index === segments.length - 1;
						return (
							<BreadcrumbItem key={segment}>
								<BreadcrumbPage>{segment}</BreadcrumbPage>
								{!isLast && <BreadcrumbSeparator />}
							</BreadcrumbItem>
						);
					})}
				</BreadcrumbList>
			</Breadcrumb>
		</div>
	);
}
export default Breadcrumbs;
