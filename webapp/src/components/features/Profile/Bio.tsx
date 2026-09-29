import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Bio = () => {
  return (
    <Card className="mt-8 flex flex-1 flex-col overflow-hidden">
      <CardHeader>
        <CardTitle>Bio</CardTitle>
        <CardDescription>
          Tell the world who you are.
        </CardDescription>
      </CardHeader>
    </Card>
  )
}

export default Bio;