import { Account} from '@prisma/client'
import { AvatarProps } from '@radix-ui/react-avatar'

// import { Icons } from '@/components/Icons'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import Image from 'next/image'

interface UserAvatarProps extends AvatarProps {
  user: Pick<Account, 'profileImage' | 'username'>
}

export function UserAvatar({ user, ...props }: UserAvatarProps) {
  return (
    <Avatar {...props}>
      {user.profileImage
       ? (
        <div className="relative aspect-square h-full w-full">
          <Image
            fill
            src={user.profileImage}
            alt="profile picture"
            referrerPolicy="no-referrer"
          />
        </div>
      ) : (
        <AvatarFallback>
          <span className="sr-only">{user?.username}</span>
          {/* <Icons.user className="h-4 w-4" /> */}
        </AvatarFallback>
      )}
    </Avatar>
  )
}
