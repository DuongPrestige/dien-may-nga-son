import { CircleCheck } from "lucide-react";

type PolicyListProps = {
  title: string;
  lines: string[];
  headingLevel?: "h2" | "h3";
};

/** Owner-entered policy lines (warranty, installation package); renders nothing when empty. */
export function PolicyList({
  title,
  lines,
  headingLevel: Heading = "h2",
}: PolicyListProps) {
  if (lines.length === 0) {
    return null;
  }

  return (
    <div>
      <Heading className="text-xl font-bold text-[#111827] sm:text-2xl">
        {title}
      </Heading>
      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
        {lines.map((line) => (
          <li
            key={line}
            className="flex items-start gap-2 text-sm font-medium leading-6 text-[#374151]"
          >
            <CircleCheck
              aria-hidden="true"
              className="mt-1 h-4 w-4 shrink-0 text-[#16A34A]"
            />
            {line}
          </li>
        ))}
      </ul>
    </div>
  );
}
