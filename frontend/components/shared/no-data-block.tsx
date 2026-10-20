import { InboxIcon } from "lucide-react";

export const NoDataBlock = ({
  heading,
  subtext,
}: {
  heading: string;
  subtext: string;
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-3 py-10 text-center">
      <div className="h-10 w-10 rounded-full bg-muted/60 flex items-center justify-center">
        <InboxIcon className="h-5 w-5 text-muted-foreground/60" />
      </div>
      <div>
        <p className="text-xs font-semibold text-foreground">{heading}</p>
        <p className="text-[10px] text-muted-foreground mt-0.5">{subtext}</p>
      </div>
    </div>
  );
};
