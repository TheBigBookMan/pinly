import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Account = () => {
  return (
    <Card className="mt-8 flex flex-1 flex-col overflow-hidden">
      <CardHeader>
        <CardTitle>Account</CardTitle>
        <CardDescription>
          Personal account details.
        </CardDescription>
      </CardHeader>
    </Card>
  )
}

export default Account;