import { Header } from "@/shared/components/layout/Header.jsx";
import { SyncUser } from "@/features/auth/components/SyncUser.jsx";
import { Footer } from "@/features/landing/ui/Footer.jsx";

export default function PublicLayout({ children }) {
    return (
        <SyncUser>
            <Header />
            <main>{children}</main>
            <Footer />
        </SyncUser>
    );
}
