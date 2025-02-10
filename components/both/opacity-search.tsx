import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Search } from "lucide-react"
import { Input } from "../ui/input"


export default function OpacityGlobalSearch() {
    return (
        <AlertDialog>
            <AlertDialogTrigger>
                <div className="relative cursor-pointer">
                    <Search size={22} fontWeight={800} />
                </div>
            </AlertDialogTrigger>
            <AlertDialogContent className="top-32">
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">  <Search size={22} fontWeight={800} /> Pesquisar</AlertDialogTitle>
                    {/* <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your account
                        and remove your data from our servers.
                    </AlertDialogDescription> */}
                </AlertDialogHeader>
                <div>
                    <Input placeholder="Faça sua busca aqui..." />
                </div>
                {/* <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction>Continue</AlertDialogAction>
                </AlertDialogFooter> */}
            </AlertDialogContent>
        </AlertDialog>
    )
}