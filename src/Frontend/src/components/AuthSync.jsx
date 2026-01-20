//import { useEffect } from "react";
//import { useAuth } from "@clerk/clerk-react";

//export default function AuthSync() {
//    const { isSignedIn, getToken } = useAuth();

//    useEffect(() => {
//        if (!isSignedIn) return;

//        const sendTokenToBackend = async () => {
//            try {
//                const token = await clerk.user.getToken({ template: "backend" });

//                const response = await fetch("https://localhost:7177/api/Account/sync", {
//                    method: "POST",
//                    headers: {
//                        Authorization: `Bearer ${token}`,
//                        "Content-Type": "application/json",
//                    },
//                    body: JSON.stringify({ timestamp: Date.now() }),
//                });

//                if (!response.ok) {
//                    console.error("Backend sync failed:", response.statusText);
//                } else {
//                    console.log("Token sent successfully!");
//                }
//            } catch (error) {
//                console.error("Auth sync failed:", error);
//            }
//        };

//        sendTokenToBackend();
//    }, [isSignedIn, getToken]);

//    return null;
//}
import { useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";

export default function AuthSync() {
    const { isSignedIn, getToken } = useAuth();

    useEffect(() => {
        if (!isSignedIn) return;

        const sync = async () => {
            const token = await getToken();

            await fetch("https://localhost:7177/api/Account/sync", {


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