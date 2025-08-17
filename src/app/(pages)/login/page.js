// "use client";

// import { useEffect } from "react";
// import { auth } from "@/utils/firebase";
// import "firebaseui/dist/firebaseui.css";

// // Firebase Auth imports  
// import {
//   setPersistence,
//   browserLocalPersistence,
//   EmailAuthProvider,
//   GoogleAuthProvider,
// } from "firebase/auth";

// let firebaseui;

// //login logic 
// const LoginPage = () => {
//   useEffect(() => {
//     //handle undefined window error
//     if (typeof window !== "undefined") {
//       firebaseui = require("firebaseui");

//       setPersistence(auth, browserLocalPersistence).catch((error) => {
//         console.error("Persistence error:", error);
//       });

//       //real login implementation -- connect to google sign in
//       const ui =
//         firebaseui.auth.AuthUI.getInstance() ||
//         new firebaseui.auth.AuthUI(auth);

//       const uiConfig = {
//         signInFlow: "popup",
//         signInSuccessUrl: "/explore",
//         signInOptions: [
//           {
//             provider: GoogleAuthProvider.PROVIDER_ID,
//             customParameters: {
//               prompt: "select_account",
//             },
//           },
//           EmailAuthProvider.PROVIDER_ID,
//         ],
//         callbacks: {
//           uiShown: () => {
//             const loader = document.getElementById("loader");
//             if (loader) loader.style.display = "none";
//           },
//         },
//       };

//       ui.start("#firebaseui-auth-container", uiConfig);
//     }
//   }, []);

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
//       <h1 className="text-2xl font-bold mb-2 text-maroon-900">Welcome to SwatSwap</h1>
//       <p className="text-sm mb-4 text-gray-700">
//         Log in to your account — or create one if you're new!
//       </p>
//       <div id="firebaseui-auth-container" />
//       <div id="loader">Loading...</div>
//     </div>
//   );
// };

// export default LoginPage;

import FirebaseAuthClient from "@/components/FirebaseAuthClient";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-2xl font-bold mb-2 text-maroon-900">Welcome to SwatSwap</h1>
      <p className="text-sm mb-4 text-gray-700">
        Log in to your account — or create one if you're new!
      </p>
      <FirebaseAuthClient />
    </div>
  );
}
