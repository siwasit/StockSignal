import { ChevronRight } from 'lucide-react';

interface NewsCardProps {
  timestamp: string;
  source: string;
  title: string;
  link: string;
  favicon?: string;
}

const NewsCard = ({ timestamp, source, title, link, favicon }: NewsCardProps) => {
  return (
    <>
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col w-full rounded-xl transition-all duration-200 hover:p-1 hover:bg-[rgba(93,98,117,0.5)] hover:shadow-lg"
      >
        <div className="flex px-2 flex-col items-start justify-between space-x-1 w-full">
          {/* วงกลม 2 วง */}
          <div className="flex items-center gap-1 relative">
            <div className="w-4 h-4 rounded-full bg-[#868686] border border-black overflow-hidden">
              <img src={favicon} alt="favicon" className="w-full h-full object-cover rounded-full" />
            </div>
            <p className="whitespace-nowrap">
              {source}
            </p>
          </div>

          {/* ข้อความชิดขวา */}
          <div className="flex items-center gap-2 justify-between text-sm text-[#868686]">
            <p>
              {timestamp}
            </p>
          </div>
        </div>

        <p className="text-[#F4F3F2] my-2 px-2">{title}</p>

        <div className="text-[#6870FA] cursor-pointer items-center gap-2 flex group transition-colors duration-200 hover:text-[#4B5BFA]">
          <div className="pb-1 px-4 transition-transform duration-200 group-hover:translate-x-1">
            อ่านต่อ
          </div>
          <ChevronRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
        </div>
      </a>
      {/* <hr className='border-b-1 border-[#868686]'/> */}
    </>

  );
};

export default NewsCard;
