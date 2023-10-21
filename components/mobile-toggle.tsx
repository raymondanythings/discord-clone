import { Menu } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import NavigationSidebar from '@/components/navigation/navigation-sidebar'
import ServerSidebar from '@/components/server/server-sidebar'

interface MobileToggleProps {
	serverId: string
	profileId: string
}
const MobileToggle = ({ profileId, serverId }: MobileToggleProps) => {
	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button variant="ghost" size="icon" className="md:hidden">
					<Menu />
				</Button>
			</SheetTrigger>
			<SheetContent className="p-0 flex gap-0" side="left">
				<div className="w-[72px]">
					<NavigationSidebar />
				</div>
				<ServerSidebar serverId={serverId} profileId={profileId} />
			</SheetContent>
		</Sheet>
	)
}

export default MobileToggle
