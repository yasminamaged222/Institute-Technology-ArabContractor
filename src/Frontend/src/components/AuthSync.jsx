import { useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";

export default function AuthSync() {
    const { isSignedIn, getToken } = useAuth();

    useEffect(() => {
        if (!isSignedIn) return;

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
    }, [isSignedIn, getToken]);

    return null;
}