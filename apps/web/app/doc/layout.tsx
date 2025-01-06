import LiveBlockProvider from "@/components/LiveBlockProvider";

function PageLayout({ children }: { children: React.ReactNode }) {
	return <LiveBlockProvider>{children}</LiveBlockProvider>;
}
export default PageLayout;
