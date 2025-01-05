import { Geist, Geist_Mono } from "next/font/google";

import "@workspace/ui/globals.css";
import { Providers } from "@/components/providers";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

const fontSans = Geist({
	subsets: ["latin"],
	variable: "--font-sans",
});

const fontMono = Geist_Mono({
	subsets: ["latin"],
	variable: "--font-mono",
});

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased `}
			>
				<Providers>
					<Header />
					<div className="flex min-h-screen">
						<Sidebar />
					</div>
					<div className="flex-1 p-4 bg-gray-100 overflow-y-auto scrollbar-hidden">
						{children}
					</div>
				</Providers>
			</body>
		</html>
	);
}
