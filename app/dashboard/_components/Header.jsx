"use client";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import React, { useEffect } from "react";

function Header() {
  const path = usePathname();
  const router = useRouter();

  useEffect(() => {
    console.log(path);
  }, []);

  const handleUpgradeClick = () => {
    router.push("/dashboard/upgrade");
  };

  return (
    <div className="flex items-center justify-between p-4 bg-secondary shadow-sm">
      <div className="flex items-center">
        <Image src={"/logo.svg"} width={60} height={60} alt="logo" />
        <span className="ml-4 text-2xl font-bold">Interview Ally</span>
      </div>
      <ul className="hidden gap-6 md:flex">
        <li
          className={`cursor-pointer transition-all hover:text-primary hover:font-bold ${
            path === "/dashboard" && "text-primary font-bold"
          }`}
        >
          <Link href="/dashboard">Dashboard</Link>
        </li>
        <li
          className={`cursor-pointer transition-all hover:text-primary hover:font-bold ${
            path === "/dashboard/questions" && "text-primary font-bold"
          }`}
        >
          <Link href="/questions">Questions</Link>
        </li>
        <li
          className={`cursor-pointer transition-all hover:text-primary hover:font-bold ${
            path === "/dashboard/upgrade" && "text-primary font-bold"
          }`}
        >
          <button onClick={handleUpgradeClick}>Upgrade</button>
        </li>
        <li
          className={`cursor-pointer transition-all hover:text-primary hover:font-bold ${
            path === "/howitworks" && "text-primary font-bold"
          }`}
        >
          <Link href="/howitworks">How it Works?</Link>
        </li>
      </ul>
      <UserButton />
    </div>
  );
}

export default Header;
