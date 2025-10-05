"use client"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card"
import { Building2, TrendingUp } from "lucide-react"
import Link from "next/link"

export type Technology = {
    id: string
    title: string
    excerpt: string
    university?: {
        name: string
        email: string
    }
    trl: string | number
    tags: string[]
    compatibility?: number
}

interface TechnologyCardProps {
    technology: Technology
    onAskToContact?: () => void
    showCompatibility?: boolean
}

export function TechnologyCard({ technology, showCompatibility = false }: TechnologyCardProps) {
    const universityName = typeof technology.university === 'string'
        ? technology.university
        : technology.university?.name || 'Universidade'

    const getTRLColor = (trl: string | number) => {
        const trlNum = typeof trl === 'string' ? parseInt(trl) : trl
        if (trlNum >= 7) return "bg-secondary text-secondary-foreground"
        if (trlNum >= 4) return "bg-primary/10 text-primary"
        return "bg-muted text-muted-foreground"
    }

    return (
        <Link href={`/technology/${technology.id}`}>
            <Card className="group hover:shadow-glow transition-all duration-300 hover:scale-[1.02] cursor-pointer border-border/50 bg-gradient-card h-full flex flex-col">
                <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors line-clamp-2">
                            {technology.title}
                        </h3>
                        {showCompatibility && technology.compatibility && (
                            <Badge className="bg-gradient-hero text-white shrink-0 font-semibold">
                                {technology.compatibility}% Match
                            </Badge>
                        )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                        {technology.excerpt}
                    </p>
                </CardHeader>

                <CardContent className="pb-3 flex-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                        <Building2 className="h-4 w-4" />
                        <span className="truncate">{universityName}</span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {technology.tags.slice(0, 3).map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                            </Badge>
                        ))}
                    </div>
                </CardContent>

                <CardFooter className="pt-0 mt-auto">
                    <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-primary" />
                        <Badge className={getTRLColor(technology.trl)}>
                            TRL {technology.trl}
                        </Badge>
                    </div>
                </CardFooter>
            </Card>
        </Link>
    )
}