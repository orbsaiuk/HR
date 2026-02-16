import { Header } from "@/shared/components/layout/Header.jsx";

export default function PublicLayout({ children }) {
    return (
        <>
            <Header />
            {children}
        </>
    );
}
