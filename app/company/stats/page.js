"use client"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"



export default function CompanyStats() {
    const router = useRouter()
    return(
        <div className="mx-auto px-6 pb-6 pt-20">
            <div className="flex flex-row items-center justify-between gap-2 pb-2">
                <div className="flex flex-row">
                    <button
                        onClick={() => router.back()}
                        className="inline-flex items-center text-gray-600 hover:text-gray-900"
                        >
                        <ArrowLeft className="h-5 w-5 mr-2" />
                    </button>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Stats</h1>
                </div>

                {/* <Link
                    href="/company/new"
                    className="flex-1 sm:flex-none bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center gap-2 text-sm"
                >
                    <PlusIcon size={18} />
                    <span>New Company</span>
                </Link> */}
            </div>
            <h1>Company Stats</h1>
        </div>
    )
}