import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="flex items-center h-full p-16">
      <div className="container flex flex-col items-center justify-center px-5 mx-auto my-8">
        <div className="max-w-lg text-center">
          <p className="text-2xl font-semibold md:text-3xl">
            Sorry, we couldn't find this page.
          </p>
          <p className="mt-4 mb-8">
            But dont worry, you can find plenty of other things on our homepage.
          </p>
          <Link to="/">
            <Button variant={"link"}>Back to homepage</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
