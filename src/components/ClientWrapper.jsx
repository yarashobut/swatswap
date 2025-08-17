"use client";
import { useEffect } from "react";
import { setupUserListener } from "@/utils/authUtils";

export default function ClientWrapper({ children }) {
	useEffect(() => {
		setupUserListener();  
	}, []);

	return <>{children}</>;
}
