"use client";
import axios from "axios";
import { useRouter } from "next/navigation";

// Define the props interface for the LogoutButton component
interface LogoutButtonProps {
    children?: React.ReactNode; // Children elements
}

// LogoutButton component for handling user logout
export const LogoutButton = ({
    children // Destructure children prop
}: LogoutButtonProps) => {
    const router = useRouter(); // Next.js router hook for navigation

    // Function to handle logout
    const onClick = () => {
        // Send a POST request to the logout API endpoint
        axios.post("/api/auth/logout")
            .then((data) => {
                // Redirect to the login page after successful logout
                // console.log(data)
                router.push("/auth/login");
            })
            .catch((error) => {
                // Handle any errors that occur during the logout process
                console.log(error);
            });
    }

    // Render the LogoutButton with onClick event handler
    return (
        <span onClick={onClick} className="cursor-pointer">
            {children} {/* Render children elements */}
        </span>
    )
}
