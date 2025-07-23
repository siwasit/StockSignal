import React from 'react';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';
import { StarIcon as StarOutline } from '@heroicons/react/24/outline';

function StockBullet({ stockSymbol, status, logo, reason, timeStamp, isFavorite, onToggleFavorite, onClick, price }) {
    const statusColor = {
        Buy: 'text-green-400',
        Hold: 'text-yellow-400',
        Sell: 'text-red-400',
    }[status] || 'text-gray-400';

    function StatusIcon({ status }) {
        if (status === 'Buy') return <div className="w-2 h-2 rounded-full bg-green-400" />;
        if (status === 'Hold') return <div className="w-2 h-2 rounded-full bg-yellow-400" />;
        if (status === 'Sell') return <div className="w-2 h-2 rounded-full bg-red-400" />;
        return null;
    }

    return (
        <div
            onClick={onClick}
            className="flex items-center justify-between w-full py-2 px-4 border-b border-gray-700 hover:bg-[#5D6275] cursor-pointer transition"
        >
            {/* Logo */}
            <img
                src={logo}
                alt={stockSymbol}
                className="w-8 h-8 rounded-full object-cover mr-4 border border-gray-500"
            />

            {/* Symbol + Status */}
            <div className="flex items-center gap-4 min-w-[180px]">
                <div className="font-bold text-white text-lg">{stockSymbol}</div>
                <div className={`font-semibold ${statusColor}`}>{status}</div>
                <StatusIcon status={status} />
            </div>

            {/* Price */}
            <div className="text-white min-w-[100px] text-end">
                {price != null ? `${price} บาท` : '- บาท'}
            </div>

            {/* Reason */}
            <div className="text-gray-300 flex-1 px-4 truncate">{reason}</div>

            {/* Time */}
            <div className="text-sm text-[#CDCDCD] min-w-[200px] text-end">{timeStamp}</div>

            {/* Favorite Button */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite();
                }}
                className="ml-4"
            >
                {isFavorite ? (
                    <StarSolid className="w-5 h-5 text-yellow-300" />
                ) : (
                    <StarOutline className="w-5 h-5 text-gray-500" />
                )}
            </button>
        </div>

    );
}

export default StockBullet;
