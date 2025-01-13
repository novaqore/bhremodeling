import Header from "@/components/Header/Header";




export default function Layout({children}){
    return(
        <div>
            <Header />
            {children}
        </div>
    )
}