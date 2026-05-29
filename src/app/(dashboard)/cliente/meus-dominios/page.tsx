"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RedirectToMenu() {
  const router = useRouter();
  useEffect(() => { router.replace("/sales/dominios"); }, [router]);
  return null;
}
