"use client";

import { useEffect } from "react";
import { auth, db } from "@/utils/firebase";
import {
  setPersistence,
  browserLocalPersistence,
  EmailAuthProvider,
  GoogleAuthProvider,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

// Don't import firebaseui at the top — import it inside the useEffect!
import "firebaseui/dist/firebaseui.css";

const FirebaseAuthClient = () => {
  useEffect(() => {
    const runAuthUI = async () => {
      if (typeof window !== "undefined") {
        const firebaseui = await import("firebaseui");

        await setPersistence(auth, browserLocalPersistence);

        const ui =
          firebaseui.auth.AuthUI.getInstance() ||
          new firebaseui.auth.AuthUI(auth);

        const uiConfig = {
          signInFlow: "popup",
          signInSuccessUrl: "/explore",
          signInOptions: [
            {
              provider: GoogleAuthProvider.PROVIDER_ID,
              customParameters: {
                prompt: "select_account",
              },
            },
            EmailAuthProvider.PROVIDER_ID,
          ],
          callbacks: {
            signInSuccessWithAuthResult: async (authResult) => {
              const user = authResult.user;
              const userRef = doc(db, "users", user.uid);
              const snap = await getDoc(userRef);
            
              let profileData = {};
              if (!snap.exists()) {
                profileData = {
                  name: user.displayName || "",
                  email: user.email || "",
                  bio: "",
                  avatar: user.photoURL || "",
                };
                await setDoc(userRef, profileData);
              } else {
                profileData = snap.data();
              }
            
              // Store both `id` and data in localStorage
              const fullProfile = { id: user.uid, ...profileData };
              localStorage.setItem("userProfile", JSON.stringify(fullProfile));
            
              return true;
            },
            
            uiShown: () => {
              const loader = document.getElementById("loader");
              if (loader) loader.style.display = "none";
            },
          },
        };

        ui.start("#firebaseui-auth-container", uiConfig);
      }
    };

    runAuthUI();
  }, []);

  return (
    <>
      <div id="firebaseui-auth-container" />
      <div id="loader">Loading...</div>
    </>
  );
};

export default FirebaseAuthClient;
