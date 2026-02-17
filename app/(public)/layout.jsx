import { Header } from "@/shared/components/layout/Header.jsx";
import { SyncUser } from "@/features/auth/components/SyncUser.jsx";

export default function PublicLayout({ children }) {
    return (
        <SyncUser>
            <Header />
            {children}
        </SyncUser>
    );
}
