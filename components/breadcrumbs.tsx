import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"
import { BreadcrumbJsonLd } from "@/app/jsonld"

export interface BreadcrumbItem {
    name: string
    url: string
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[]
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
    const allItems = [{ name: "Home", url: "/" }, ...items]

    return (
        <>
            <BreadcrumbJsonLd items={allItems} />
            <nav aria-label="Breadcrumb" className="mb-6">
                <ol className="flex items-center gap-2 text-sm text-muted-foreground">
                    {allItems.map((item, index) => {
                        const isLast = index === allItems.length - 1

                        return (
                            <li key={item.url} className="flex items-center gap-2">
                                {index === 0 ? (
                                    <Link
                                        href={item.url}
                                        className="flex items-center gap-1 hover:text-primary transition-colors"
                                    >
                                        <Home className="w-4 h-4" />
                                        <span className="sr-only">{item.name}</span>
                                    </Link>
                                ) : isLast ? (
                                    <span className="text-foreground font-medium">{item.name}</span>
                                ) : (
                                    <Link
                                        href={item.url}
                                        className="hover:text-primary transition-colors"
                                    >
                                        {item.name}
                                    </Link>
                                )}
                                {!isLast && <ChevronRight className="w-4 h-4 text-muted-foreground/50" />}
                            </li>
                        )
                    })}
                </ol>
            </nav>
        </>
    )
}
