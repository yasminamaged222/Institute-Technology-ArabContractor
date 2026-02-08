import { useEffect, useRef } from "react";
import { useAuth } from "@clerk/clerk-react";

export default function AuthSync() {
    const { isSignedIn, getToken } = useAuth();
    const called = useRef(false);

    useEffect(() => {
        if (!isSignedIn) return;
        if (called.current) return;

        called.current = true;

        const sync = async () => {
            const token = await getToken({ template: "backend" });

            console.log("CLERK TOKEN:", token);

            await fetch("https://acwebsite-icmet-test.azurewebsites.net/api/Account/sync", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        };

        sync();
    }, [isSignedIn]);

    return null;
}
