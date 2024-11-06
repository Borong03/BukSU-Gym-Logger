import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios"; // Assuming you want to send the passkey to your backend

const Passkey = () => {
  const { email } = useParams(); // React Router v6 way of accessing route params

  useEffect(() => {
    const createPasskey = async () => {
      // Fetch a challenge from your backend (ideally)
      const challengeResponse = await axios.get("/webauthn/challenge");
      const challenge = challengeResponse.data.challenge;

      const publicKey = {
        challenge: Uint8Array.from(challenge), // Replace with a backend-generated challenge
        rp: {
          name: "Your Website Name",
        },
        user: {
          id: new TextEncoder().encode(email),
          name: email,
          displayName: email,
        },
        pubKeyCredParams: [{ type: "public-key", alg: -7 }], // ECDSA with SHA-256
      };

      try {
        const credential = await navigator.credentials.create({ publicKey });
        // Send credential to your backend for storage
        await axios.post("/webauthn/store-passkey", { credential, email });
      } catch (error) {
        console.error("Error creating passkey:", error);
      }
    };

    createPasskey();
  }, [email]);

  return (
    <div>
      <h1>Create Passkey</h1>
      <p>Please follow the prompts to create your passkey.</p>
    </div>
  );
};

export default Passkey;
