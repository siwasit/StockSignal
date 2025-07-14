import { ChevronRight } from 'lucide-react';

interface NewsCardProps {
  timestamp: string;
  source: string;
  title: string;
}

const NewsCard = ({ timestamp, source, title }: NewsCardProps) => {
  return (
    <div className="flex flex-col w-full rounded-xl transition-all duration-200 hover:p-2 hover:bg-[rgba(93,98,117,0.5)] hover:shadow-lg">
      <div className="flex items-center justify-between w-full">
        {/* วงกลม 2 วง */}
        <div className="flex items-center relative">
          <div className="w-4 h-4 rounded-full bg-[#868686] border border-black" />
          <div className="absolute left-3 w-4 h-4 rounded-full bg-[#868686] border border-black" />
        </div>

        {/* ข้อความชิดขวา */}
        <p className="text-[#868686] text-sm text-end whitespace-nowrap">
          {timestamp} · {source}
        </p>
      </div>

      <p className="text-[#F4F3F2] my-2">
        {title}
      </p>

      <div className="text-[#6870FA] cursor-pointer items-center gap-2 flex group transition-colors duration-200 hover:text-[#4B5BFA]">
        <div className="pb-1 transition-transform duration-200 group-hover:translate-x-1">
          อ่านต่อ
        </div>
        <ChevronRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
      </div>
    </div>
  );
};

export default NewsCard;
