import { db } from "../auth";
import { doc, updateDoc, arrayUnion, getDoc, setDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const body = await request.json();
        console.log("Received data:", body);

        const { uid, id, name, price, imageUrl, size, item } = body;

        if (!uid || !id || !name || !price || !imageUrl || !size) {
            return NextResponse.json({ error: "Missing fields in request" }, { status: 400 });
        }

        const userRef = doc(db, "users", uid);
        const userSnap = await getDoc(userRef);

        const cartItem = {
            id,
            name,
            price,
            imageUrl,
            item,
            size,
            addedAt: new Date().toISOString(),
        };

        if (userSnap.exists()) {
            // Append to cart using arrayUnion
            await updateDoc(userRef, {
                cart: arrayUnion(cartItem),
            });
        } else {
            // Create user doc with cart array if not found
            await setDoc(userRef, {
                cart: [cartItem],
            });
        }

        return NextResponse.json({ message: "Item added to cart successfully." });
    } catch (error) {
        console.error("Error adding to cart:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
