import { db } from "../auth"; 
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";

export async function POST(request) {
  try {
    const updatedData = await request.json();
    const { email } = updatedData;

    if (!email) {
      return new Response(JSON.stringify({ error: "Email is required for update." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return new Response(JSON.stringify({ error: "User not found with given email." }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const userDoc = snapshot.docs[0];
    const userDocRef = doc(db, "users", userDoc.id);
    await updateDoc(userDocRef, updatedData);

    return new Response(JSON.stringify({ message: "User updated successfully." }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error updating user:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}