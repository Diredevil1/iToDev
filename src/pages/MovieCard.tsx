import type { FC } from "react";

interface Props {
  title: string;
  crawl: string;
}

export const MovieCard: FC<Props> = ({ title, crawl }) => {
  const truncate = (text: string, maxLength = 128): string => {
    return text.length > maxLength
      ? text.slice(0, maxLength).trimEnd() + "..."
      : text;
  };

  return (
    <div className="bg-zinc-900 rounded-2xl p-5 flex flex-col gap-5 hover:cursor-pointer outline-none">
      <h2 className="text-3xl font-stretch-extra-expanded">{title}</h2>
      <p className="text-lg">{truncate(crawl)}</p>
    </div>
  );
};
