"use client"
import { useApp } from "@/contexts/AppContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function Dashboard() {
const router = useRouter()
const { user } = useApp()

  useEffect(()=>{
    if(!user) router.push('/login')
  }, [user])

  return (
    <div className="py-12">
      <h1 className="text-3xl font-bold">dashboard</h1>
    </div>
  )
}