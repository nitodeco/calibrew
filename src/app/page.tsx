import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ModeToggle } from "@/components/mode-toggle";
import { FaGithub } from "react-icons/fa";

export default function Home() {
  return (
    <div className="grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-screen pb-8 gap-8 sm:p-2 font-[family-name:var(--font-geist-sans)]">
      <header className="w-full max-w-6xl flex items-center justify-between p-4">
        <h1 className="text-2xl font-bold">calibrew</h1>
        <div className="flex items-center gap-4">
          <ModeToggle />
          <a
            href="https://github.com/nitodeco/calibrew"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-60"
          >
            <FaGithub className="w-5 h-5" />
          </a>
        </div>
      </header>

      <main className="flex flex-col gap-4 items-center w-full max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="space-y-2">
                  <Label>Roast</Label>
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select roast level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Grind Size</Label>
                  <Input type="number" placeholder="e.g. 15" />
                </div>

                <div className="space-y-2">
                  <Label>Dose (g)</Label>
                  <Input type="number" placeholder="e.g. 18" />
                </div>

                <div className="space-y-2">
                  <Label>Brew Time (sec)</Label>
                  <Input type="number" placeholder="e.g. 30" />
                </div>

                <div className="space-y-2">
                  <Label>Yield (g)</Label>
                  <Input type="number" placeholder="e.g. 36" />
                </div>

                <div className="space-y-2">
                  <Label>Taste</Label>
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select taste" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bitter">Bitter</SelectItem>
                      <SelectItem value="balanced">Balanced</SelectItem>
                      <SelectItem value="sour">Sour</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button className="w-full mt-2" variant="outline">
                  Calibrate
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <p className="text-muted-foreground">
                  Your calibration results will appear here.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
