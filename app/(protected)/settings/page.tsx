import { auth, signOut } from "@/auth";

const SettingsPage = async() =>{
    const session = await auth();

    return(
        <div className="h-full flex flex-col items-center justify-center p-52">
            <form action={async()=>{
                "use server";
                await signOut();
            }}>
                <button type="submit">
                    SignOut
                </button>
            </form>
        </div>
    )
}

export default SettingsPage;