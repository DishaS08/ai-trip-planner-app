"use client"
import Image from 'next/image'
import { Button } from "@/components/ui/button";
import Link from 'next/link'
import { UserButton, useUser } from '@clerk/nextjs';
import React from 'react'
import { SignInButton } from '@clerk/nextjs';
import { usePathname } from 'next/navigation';

const menuOptions = [
  {
    name: "Home",
    path: '/'
  },
  {
    name: 'Pricing',
    path: '/pricing'
  },
  {
    name: 'About us',
    path: '/about-us'
  }
];

function Header() {
  const { user } = useUser();
  const path = usePathname();
  // console.log(path);

  return (
    <div className='flex justify-between items-center p-4'>
      {/* Logo */}
      <div className='flex items-center'>
        <Image src={"/logo.svg"} alt='logo' width={30} height={30} />
        <h2 className='font-bold text-2xl'>AI Trip Planner</h2>
      </div>

      {/* Menu Options */}
      <div className='flex gap-8 items-center'>
        {menuOptions.map((menu) => (
          <Link key={menu.path} href={menu.path}>
            <h2 className='text-lg hover:scale-105 transition-all hover:text-primary'>{menu.name}</h2>
          </Link>
        ))}
      </div>

      {/* Get Started Button */}
      <div className='flex gap-5 items-center'>
        {!user ? (
          <SignInButton mode="modal">
            <Button asChild>
              <span>Get Started</span>
            </Button>
          </SignInButton>
        ) : path == "/create-new-trip" ? (
          <Link href={'/my-trips'}>
            <Button>My Trips</Button>
          </Link>
        ) : (
          <Link href={'/create-new-trip'}>
            <Button>Create New Trip</Button>
          </Link>
        )}
        <UserButton />
      </div>
    </div>
  )
}

export default Header
