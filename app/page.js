"use client"
import { useApp } from "@/contexts/AppContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function Home() {
const router = useRouter()
const { user } = useApp()

  useEffect(()=>{
    if(!user) router.push('/login')
    if(user) router.push('/dashboard')
  }, [])

  return (
    <div className="py-12">
      {/* <h1 className="text-3xl font-bold">Welcome to the Home Page</h1> */}
    </div>
  )
}