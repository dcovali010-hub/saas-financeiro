"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function WebsiteMensalUsuariosPage() {
  const router = useRouter();
  useEffect(() => { router.replace("/sales/usuarios"); }, [router]);
  return (
    <div className="flex items-center justify-center min-h-64">
      <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
