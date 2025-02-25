import LiveBlocksProvider from "@/components/LiveBlocks/LiveBlocksProvider";

function PageLayout({ children }: { children: React.ReactNode }) {
	return <LiveBlocksProvider>{children}</LiveBlocksProvider>;
}
export default PageLayout;
