"use cliient";

import { 
    Card,
    CardContent,
    CardFooter,
    CardHeader
} from "@/components/ui/card";
import { Header } from "@/components/auth/header";
import { BackButton } from "@/components/auth/back-button";
interface CardWrapperProps{
    children:React.ReactNode;
    headerLabel: string;
    backButtonLabel: string;
    backButtonHref: string;
    showSocial?: boolean;
    bg?:'dark'
}

export const CardWrapper = ({
  children,
  headerLabel,
  backButtonHref,
  backButtonLabel,
  bg
}: CardWrapperProps) => {
  return (
    <Card
      className={`w-[400px] shadow-md ${bg === 'dark' ? 'bg-gray-800/60' : ''}`}
    >
      <CardHeader>
        <Header label={headerLabel} bg={bg} />
      </CardHeader>
      <CardContent>{children}</CardContent>
      {/* Conditionally render the CardFooter only if backButtonLabel is not empty */}
      {backButtonLabel !== '' && (
        <CardFooter>
          <BackButton label={backButtonLabel} href={backButtonHref} />
        </CardFooter>
      )}
    </Card>
  )
}
