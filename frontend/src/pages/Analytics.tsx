import { CardTitle, CardDescription, CardHeader, CardContent, Card } from "@/components/ui/card"
import { ResponsiveLine } from "@nivo/line"

export default function Component() {
  return (
    <div className="grid min-h-screen lg:block w-full lg:grid-cols-[280px_1fr]">
      <div className="flex flex-col">
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
          <div className="flex items-center gap-4">
            <h1 className="font-semibold text-lg md:text-xl">Summary</h1>
          </div>
          <div className="flex justify-around gap-4">
            <Card className="flex-grow">
              <CardHeader>
                <CardTitle>Shortened URLs</CardTitle>
                <CardDescription>The total number of shortened URLs.</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center">
                <div className="text-4xl font-semibold">69</div>
              </CardContent>
            </Card>
            <Card className="flex-grow">
              <CardHeader>
                <CardTitle>Clicks</CardTitle>
                <CardDescription>The total number of clicks.</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center">
                <div className="text-4xl font-semibold">6,999</div>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
              <CardDescription>The time plot of the clicks.</CardDescription>
            </CardHeader>
            <CardContent>
              <CurvedlineChart className="w-full aspect-[3/2]" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Top Referrers</CardTitle>
              <CardDescription>The top referrers of the clicks.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="flex items-center">
                <div>google.com</div>
                <div className="font-semibold ml-auto">3K</div>
              </div>
              <div className="flex items-center">
                <div>twitter.com</div>
                <div className="font-semibold ml-auto">1.2K</div>
              </div>
              <div className="flex items-center">
                <div>youtube.com</div>
                <div className="font-semibold ml-auto">1.1K</div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}

function CurvedlineChart(props: any) {
  return (
    <div {...props}>
      <ResponsiveLine
        data={[
          {
            id: "Desktop",
            data: [
              { x: "Jan", y: 43 },
              { x: "Feb", y: 137 },
              { x: "Mar", y: 61 },
              { x: "Apr", y: 145 },
              { x: "May", y: 26 },
              { x: "Jun", y: 154 },
            ],
          },
        ]}
        margin={{ top: 10, right: 10, bottom: 40, left: 40 }}
        xScale={{
          type: "point",
        }}
        yScale={{
          type: "linear",
          min: 0,
          max: "auto",
        }}
        curve="monotoneX"
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 0,
          tickPadding: 16,
        }}
        axisLeft={{
          tickSize: 0,
          tickValues: 5,
          tickPadding: 16,
        }}
        colors={["black"]}
        pointSize={6}
        useMesh={true}
        gridYValues={6}
        theme={{
          tooltip: {
            chip: {
              borderRadius: "9999px",
            },
            container: {
              fontSize: "12px",
              textTransform: "capitalize",
              borderRadius: "6px",
            },
          },
          grid: {
            line: {
              stroke: "#f3f4f6",
            },
          },
        }}
        role="application"
      />
    </div>
  )
}