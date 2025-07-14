import React, { useState } from 'react';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';
import { StarIcon as StarOutline } from '@heroicons/react/24/outline';

function StockCard({ stockSymbol, status, reason, timeStamp, isFavorite }) {

    const [isStar, setIsStar] = useState(isFavorite);

    const toggleFavorite = () => {
        setIsStar((prev) => !prev);
    };

    function StatusIcon({ status }) {
        if (status === 'Buy') {
            return (
                <div className="w-0 h-0 border-l-8 border-r-8 border-b-10 border-transparent border-b-[#41DC8E]"></div>
            );
        } else if (status === 'Hold') {
            return (
                <div className="w-4 h-4 rounded-full bg-[#E0B469]"></div>
            );
        } else if (status === 'Sell') {
            return (
                <div className="w-0 h-0 border-l-8 border-r-8 border-t-10 border-transparent border-t-[#FF8282]"></div>
            );
        } else {
            return null; // default case
        }
    }
    // สีตามสถานะ
    const statusColor = {
        Buy: 'text-green-400',
        Hold: 'text-yellow-400',
        Sell: 'text-red-400',
    }[status] || 'text-gray-400';

    return (
        <div
            className={`bg-[#3E4355] hover:bg-[#5D6275] rounded-xl p-6 text-white shadow-md flex flex-col h-full gap-2 border-2 ${status === 'Buy'
                ? 'border-[#41DC8E]'
                : status === 'Hold'
                    ? 'border-[#E0B469]'
                    : status === 'Sell'
                        ? 'border-[#FF8282]'
                        : 'border-transparent'
                }`}
        >
            <div className="flex-grow flex flex-col gap-2">
                <div className="flex justify-between items-center">
                    <div className="text-2xl font-bold text-[#9B76D3]">{stockSymbol}</div>
                    <div onClick={toggleFavorite} className="cursor-pointer">
                        {isStar ? (
                            <StarSolid className="w-6 h-6 text-yellow-300" />
                        ) : (
                            <StarOutline className="w-6 h-6 text-gray-500" />
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="text-lg">สถานะ:</div>
                    <div className={`text-lg font-bold ${statusColor}`}>{status}</div>
                    <StatusIcon status={status} />
                </div>

                <div className="flex gap-2">
                    <div className="text-lg">เหตุผล:</div>
                    <div className="text-lg text-gray-300">{reason}</div>
                </div>
            </div>

            <div className="text-sm text-end text-[#CDCDCD] mt-2">{timeStamp}</div>
        </div>

    );
}

export default StockCard;
