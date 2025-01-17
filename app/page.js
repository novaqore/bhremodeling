"use client"
import Dashboard from "@/components/Dashboard/Dashboard"
import Loading from "@/components/Loading/Loading"
import Login from "@/components/Login/Login"
import { useAuth } from "@/contexts/auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function Home() {
  const router = useRouter()
  const { user, loading } = useAuth()

  if(loading) return <Loading />
  if(!user) return <Login />
  if(user) return <Dashboard />
}