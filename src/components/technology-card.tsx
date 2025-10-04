"use client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"


export type Technology = {
    id: string
    title: string
    summary: string
    university: string
    trl: number
    tags: string[]
}


export function TechnologyCard({ technology, onAskToContact }: { technology: Technology; onAskToContact?: () => void }) {
    return (
        <Card className="hover:shadow-lg transition-all">
            <CardHeader>
                <CardTitle className="text-lg">{technology.title}</CardTitle>
                <CardAction>
                    <Badge variant="outline">TRL {technology.trl}</Badge>
                </CardAction>
                <CardDescription>
                    {technology.university}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground line-clamp-3">{technology.summary}</p>
                <div className="flex flex-wrap gap-2">
                    {technology.tags.slice(0, 4).map((t) => (
                        <Badge key={t} variant="secondary">{t}</Badge>
                    ))}
                </div>
            </CardContent>
            <CardFooter>
                <Button variant="outline" className="w-full" onClick={onAskToContact}>Quero entrar em contato</Button>
            </CardFooter>
        </Card>
    )
}