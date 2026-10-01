import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Travel = () => {
  return (
    <Card className="mt-8 flex flex-1 flex-col overflow-hidden">
      <CardHeader>
        <CardTitle>Travel Stats</CardTitle>
        <CardDescription>
          What you have done.
        </CardDescription>
      </CardHeader>
    </Card>
  )
}

export default Travel;