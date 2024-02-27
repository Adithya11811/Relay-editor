import { LoginButton } from "@/components/auth/login-button";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="h-full flex flex-col items-center justify-center">
      <div className="space-y-6 text-center">
          <h1>
            Home Page
          </h1>
          <LoginButton>
          <Button size="lg">
            SignIn
          </Button>
          </LoginButton>
      </div>
    </main>
  );
}
