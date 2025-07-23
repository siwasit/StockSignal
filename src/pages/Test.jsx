import React, { useEffect, useState, useRef } from "react";
// Server-Sent Events (SSE) คืออะไร?
// SSE เป็นเทคนิคให้ server ส่งข้อมูลแบบ streaming (ส่งข้อมูลต่อเนื่อง) ไปยัง client ผ่าน HTTP connection เดียว

// เป็นการสื่อสารแบบ one-way คือ server → client เท่านั้น

// เหมาะกับการอัปเดตข้อมูลเรียลไทม์ เช่น ข่าวสาร, ข้อมูลหุ้น, ข้อความแจ้งเตือน

function Test() {
    const [favoriteStocks, setFavoriteStocks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const didFetch = useRef(false);

    const SET50 = [
        "ADVANC",
        "AOT",
        "AWC",
        "BANPU",
        "BBL",
        "BCP",
        "BDMS",
        "BEM",
        "BH",
        "BJC",
        "BTS",
        "CBG",
        "CCET",
        "COM7",
        "CPALL",
        "CPF",
        "CPN",
        "CRC",
        "DELTA",
        "EGCO",
        "GPSC",
        "GULF",
        "HMPRO",
        "IVL",
        "KBANK",
        "KKP",
        "KTB",
        "KTC",
        "LH",
        "MINT",
        "MTC",
        "OR",
        "OSP",
        "PTT",
        "PTTEP",
        "PTTGC",
        "RATCH",
        "SCB",
        "SCC",
        "SCGP",
        "TCAP",
        "TIDLOR",
        "TISCO",
        "TLI",
        "TOP",
        "TRUE",
        "TTB",
        "TU",
        "VGI",
        "WHA"
    ];

    function getRandomDate(start, end) {
        const timestamp = start.getTime() + Math.random() * (end.getTime() - start.getTime());
        return new Date(timestamp);
    }

    // useEffect(() => {
    //     const symbolsQuery = SET50.join(",");

    //     const eventSource = new EventSource(
    //         `http://127.0.0.1:3007/streamStockPrice?symbols=${symbolsQuery}`
    //     );

    //     eventSource.onmessage = (event) => {
    //         const data = JSON.parse(event.data);
    //         console.log("SSE received:", data);

    //         const statuses = ['Buy', 'Sell', 'Hold'];
    //         const reasons = ['Break EMA', 'Volume Surge', 'MACD Signal'];
    //         const randomDate = getRandomDate(new Date(2025, 6, 1), new Date(2025, 6, 13, 23, 59));

    //         const enrichedStock = {
    //             ...data,
    //             status: statuses[0],  // หรือสุ่ม
    //             reason: reasons[0],
    //             timeStamp: randomDate.toISOString(),
    //             isFavorite: true,
    //         };

    //         setFavoriteStocks((prev) => [...prev, enrichedStock]);
    //         setLoading(false);
    //     };

    //     eventSource.onerror = (err) => {
    //         console.error("SSE error:", err);
    //         setError("SSE connection error");
    //         setLoading(false);
    //         eventSource.close();
    //     };

    //     return () => {
    //         eventSource.close();
    //     };
    // }, []);

    const BATCH_SIZE = 5;

    useEffect(() => {
        if (didFetch.current) return;
        didFetch.current = true;

        async function fetchSET50InBatches() {
            setLoading(true);
            setError(null);

            try {
                setFavoriteStocks([]); // เคลียร์ก่อนเริ่ม

                let tempResults = [];

                for (let i = 0; i < SET50.length; i += BATCH_SIZE) {
                    const batch = SET50.slice(i, i + BATCH_SIZE);
                    const symbolQuery = batch.join(",");

                    const response = await fetch(`http://127.0.0.1:3007/StockData/${encodeURIComponent(symbolQuery)}`);
                    if (!response.ok) {
                        throw new Error(`Error ${response.status}: ${response.statusText}`);
                    }

                    const json = await response.json();
                    if (json.data) {
                        tempResults = [...tempResults, ...json.data];
                        setFavoriteStocks(prev => [...prev, ...json.data]);
                    }
                }

                console.log(tempResults)

                // ตรวจสอบข้อมูลหลังโหลดครบทุก batch
                const missingSymbols = tempResults
                    .filter(stock =>
                        !stock?.stockSymbol ||
                        stock?.stockPrice == null ||
                        stock?.changePct == null
                    )
                    .map(stock => stock?.stockSymbol)
                    .filter(Boolean); // กรอง symbol ที่เป็น null ออก

                if (missingSymbols.length > 0) {
                    console.warn("🔄 รีโหลดใหม่สำหรับ:", missingSymbols);

                    const retryQuery = missingSymbols.join(",");

                    const retryResponse = await fetch(`http://127.0.0.1:3007/StockData/${encodeURIComponent(retryQuery)}`);
                    if (retryResponse.ok) {
                        const retryJson = await retryResponse.json();
                        if (retryJson.data) {
                            setFavoriteStocks(prev => [...prev, ...retryJson.data]);
                        }
                    }
                }

            } catch (err) {
                setError(err.message || "Unknown error");
            } finally {
                setLoading(false);
            }
        }

        fetchSET50InBatches();
    }, []);

    // if (loading) return <div>Loading favorite stocks...</div>;
    // if (error) return <div>Error: {error}</div>;

    return (
        <div>
            {loading && <div>Loading favorite stocks...</div>}
            {error && <div className="text-red-600">Error: {error}</div>}
            <div className="p-4 font-sans">
                <h2 className="text-2xl font-bold mb-4">Favorite Stocks</h2>

                {/* Summary bar */}
                <div className="mb-4 inline-block bg-blue-600 text-white font-semibold rounded px-4 py-2 shadow">
                    Total Favorite Stocks: {favoriteStocks.length}
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse shadow-md">
                        <thead>
                            <tr className="bg-blue-600 text-white">
                                <th className="py-2 px-4 border border-blue-700">Symbol</th>
                                <th className="py-2 px-4 border border-blue-700">Company Name</th>
                                <th className="py-2 px-4 border border-blue-700">Price</th>
                                <th className="py-2 px-4 border border-blue-700">Change (%)</th>
                                <th className="py-2 px-4 border border-blue-700">Status</th>
                                <th className="py-2 px-4 border border-blue-700">Reason</th>
                                <th className="py-2 px-4 border border-blue-700">Time</th>
                                <th className="py-2 px-4 border border-blue-700">Favorite</th>
                            </tr>
                        </thead>
                        <tbody>
                            {favoriteStocks.map((stock, idx) => (
                                <tr
                                    key={stock.stockSymbol || idx}
                                    className="even:bg-gray-100 odd:bg-white border-b"
                                >
                                    <td className="py-2 px-4 border border-gray-300">{stock.stockSymbol}</td>
                                    <td className="py-2 px-4 border border-gray-300">
                                        {stock.ThaiCompanyName || stock.companyName}
                                    </td>
                                    <td className="py-2 px-4 border border-gray-300">{stock.stockPrice}</td>
                                    <td
                                        className={`py-2 px-4 border border-gray-300 ${parseFloat(stock.changePct) >= 0 ? "text-green-600" : "text-red-600"
                                            }`}
                                    >
                                        {stock.changePct}%
                                    </td>
                                    <td className="py-2 px-4 border border-gray-300">{stock.status}</td>
                                    <td className="py-2 px-4 border border-gray-300">{stock.reason}</td>
                                    <td className="py-2 px-4 border border-gray-300">
                                        {new Date(stock.timeStamp).toLocaleString()}
                                    </td>
                                    <td className="py-2 px-4 border border-gray-300">
                                        {stock.isFavorite ? "Yes" : "No"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

}

export default Test;
