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
import { Fragment } from "react";

function Breadcrumbs() {
	const path = usePathname();
	const segments = path.split("/").filter((segment) => segment !== "");
	return (
		<div>
			<Breadcrumb>
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink href="/">Home</BreadcrumbLink>
					</BreadcrumbItem>
					{segments.map((segment, index) => (
						<Fragment key={index}>
							<BreadcrumbSeparator />
							<BreadcrumbItem>
								{index === segments.length - 1 ? (
									<BreadcrumbPage>{segment}</BreadcrumbPage>
								) : (
									<BreadcrumbLink>{segment}</BreadcrumbLink>
								)}
							</BreadcrumbItem>
						</Fragment>
					))}
				</BreadcrumbList>
			</Breadcrumb>
		</div>
	);
}
export default Breadcrumbs;
