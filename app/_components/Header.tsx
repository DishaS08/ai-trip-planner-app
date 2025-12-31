"use client"
import Image from 'next/image'
import { Button } from "@/components/ui/button";
import Link from 'next/link'
import { UserButton, useUser, SignInButton, SignedIn, SignedOut } from '@clerk/nextjs';
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
    <div className='sticky top-0 z-50 flex justify-between items-center p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800'>
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
      {/* Get Started Button */}
      <div className='flex gap-5 items-center'>
        <SignedOut>
          <SignInButton mode="modal">
            <Button>Get Started</Button>
          </SignInButton>
        </SignedOut>

        <SignedIn>
          {path == "/create-new-trip" ? (
            <Button className="rounded-full bg-gradient-to-r from-primary to-blue-600 text-white hover:opacity-90 transition-opacity" asChild>
              <Link href={'/my-trips'}>My Trips</Link>
            </Button>
          ) : (
            <Button className="rounded-full" asChild>
              <Link href={'/create-new-trip?mode=create'}>Create New Trip</Link>
            </Button>
          )}
          <UserButton />
        </SignedIn>
      </div>
    </div>
  )
}

export default Header
