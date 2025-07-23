import { useEffect, useState, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, ChevronUpIcon, ChevronDownIcon, History, Search, LineChart } from 'lucide-react'; // optional icon set
import { HomeIcon, BellIcon, Cog6ToothIcon, UserIcon } from '@heroicons/react/24/solid';
import StockSignal from '../components/StockSignal';
import AllStock from '../components/AllStock';
import StockDetail from '../components/StockDetail';
import Setting from '../components/Setting';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
    const [isOverflowing, setIsOverflowing] = useState(false);
    const containerRef = useRef(null);
    const [collapsed, setCollapsed] = useState(false);
    const [activeMenu, setActiveMenu] = useState('dashboard');
    const [switchState, setSwitchState] = useState(true);
    const [stockDetail, setStockDetail] = useState('null');
    const [detailKey, setDetailKey] = useState(0);

    const [expanded, setExpanded] = useState(false);
    const navigate = useNavigate();

    function getRandomDate(start, end) {
        const timestamp = start.getTime() + Math.random() * (end.getTime() - start.getTime());
        return new Date(timestamp);
    }

    const companyNames = [
        'TechNova', 'GreenLeaf', 'Skyline Corp', 'Quantum Solutions', 'BlueWave',
        'Solaris Ltd', 'NextGen Tech', 'Apex Industries', 'Everest Systems', 'FusionWorks',
        'Nimbus', 'Luna Innovations', 'Atlas Group', 'Vertex Inc', 'Pinnacle',
        'Echo Enterprises', 'Zenith', 'NovaCore', 'Horizon Dynamics', 'PulseTech',
        'Infinity Edge', 'Crimson Technologies', 'TerraMind', 'CloudMatrix', 'BrightSpark Labs',
        'Orion Systems', 'Titanium Labs', 'Velox Technologies', 'Hyperlink Solutions', 'AstroSoft',
        'Nebula Systems', 'CoreVision', 'GlidePath Inc', 'DataForge', 'MetroLogic',
        'Synthex Corp', 'Oceanic Global', 'StratosTech', 'AetherWorks', 'FlareSoft',
        'HelioWave', 'Trinity Dynamics', 'Falcon Enterprises', 'ZenLab', 'VirtuNet',
        'NovaLink', 'GreenGrid Technologies', 'OmniCore', 'FireFly Systems', 'Magnetar Tech',
        'EchoGrid', 'Altura Solutions', 'CloudFabrik', 'MomentumX', 'SkyNetics',
        'Redline Systems', 'DigitalForge', 'EagleSoft', 'Cobalt Innovations', 'QuantumFlow',
        'SilverPeak Group', 'TerraNova Inc', 'Nexora', 'AlphaBridge', 'Vortex Solutions',
        'OptimaCorp', 'UrbanGrid', 'BrightForge', 'PulseDynamics', 'BlueOrbit Technologies',
        'VertexCore', 'InnoWave', 'NeoGenix', 'LuxeSoft', 'StormGrid',
        'SolarEdge Systems', 'InfiniCore', 'CloudCrest', 'Equinox Group', 'AegisWorks',
        'CodeVerge', 'ZenCore', 'VectorLogic', 'VantaLabs', 'HyperNova Corp',
        'KineticSoft', 'MaximaTech', 'SkyBridge Inc', 'PrismEdge', 'GreenNova',
        'Ascendia', 'OmegaEdge', 'IgniteLabs', 'Civitas Systems', 'BrightNet',
        'NextEra Solutions', 'HoloTech', 'LuminaCore', 'BlueStone Group', 'EclipseSoft'
    ];

    const generateRandomSymbol = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const numbers = '0123456789';

        const length = Math.floor(Math.random() * 2) + 2; // 2-3 ตัว

        let symbol = '';
        for (let i = 0; i < length; i++) {
            symbol += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        // สุ่ม 50% ว่าจะต่อท้ายด้วยตัวเลขหรือไม่
        if (Math.random() < 0.5) {
            symbol += numbers.charAt(Math.floor(Math.random() * numbers.length));
        }

        return symbol;
    };

    const favoriteIndexes = new Set();
    while (favoriteIndexes.size < 9) {
        favoriteIndexes.add(Math.floor(Math.random() * 90));
    }

    const mockStockData = Array.from({ length: 90 }, (_, index) => {
        const randomDate = getRandomDate(new Date(2025, 6, 1), new Date(2025, 6, 13, 23, 59));
        const companyName = companyNames[Math.floor(Math.random() * companyNames.length)];
        const stockPrice = Math.floor(Math.random() * (100 - 20 + 1)) + 20; // สุ่มระหว่าง 20 ถึง 100

        const changePct = (Math.random() * 10 - 5).toFixed(2);  // สุ่ม -5.00 ถึง +5.00

        return {
            stockSymbol: generateRandomSymbol(),
            companyName,
            status: ['Buy', 'Sell', 'Hold'][index % 3],
            reason: ['Break EMA', 'Volume Surge', 'MACD Signal'][index % 3],
            timeStamp: randomDate.toISOString(),
            isFavorite: favoriteIndexes.has(index),
            stockPrice,
            changePct: parseFloat(changePct),  // แปลงกลับเป็นตัวเลขจริง
        };
    });

    const [searchTerm, setSearchTerm] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [stocks, setStocks] = useState(mockStockData);





    // const favoriteStocks = stocks.filter(stock => stock.isFavorite);
    const [favoriteStocks, setFavoriteStocks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [signalKey, setSignalKey] = useState(0);
    const [AllStockData, setAllStock] = useState([]);
    // const [favoriteSideBarStocks, setFavoriteSideBarStocks] = useState([]);
    // useEffect(() => {
    //     const fetchFavoriteStocks = async () => {
    //         const randomDate = getRandomDate(new Date(2025, 6, 1), new Date(2025, 6, 13, 23, 59));
    //         try {
    //             setLoading(true);
    //             setError(null);

    //             const response = await fetch(
    //                 "http://127.0.0.1:3007/favoriteStock/PTT,CPALL,TPLAS,SCB,BBL,AOT,TRUE,ADVANC,KBANK"
    //             );

    //             if (!response.ok) {
    //                 throw new Error(`HTTP error! status: ${response.status}`);
    //             }

    //             const data = await response.json();

    //             // สมมติ favoriteIndexes เป็น Set ของ index ที่เป็น favorite

    //             const statuses = ['Buy', 'Sell', 'Hold'];
    //             const reasons = ['Break EMA', 'Volume Surge', 'MACD Signal'];

    //             const enrichedData = (data.data || []).map((stock, index) => ({
    //                 ...stock,
    //                 status: statuses[index % statuses.length],
    //                 reason: reasons[index % reasons.length],
    //                 timeStamp: randomDate.toISOString(),
    //                 isFavorite: true,
    //             }));

    //             setFavoriteStocks(enrichedData);
    //         } catch (err) {
    //             setError(err.message || "Unknown error");
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     fetchFavoriteStocks();
    //     // setSignalKey(prev => (prev === 0 ? 1 : 0));
    // }, []);
    // useEffect(() => {
    //     const eventSource = new EventSource(
    //         "http://127.0.0.1:3007/streamStockPrice?symbols=PTT,CPALL,TPLAS,SCB,BBL,AOT,TRUE,ADVANC,KBANK"
    //     );

    //     eventSource.onmessage = (event) => {
    //         const data = JSON.parse(event.data);
    //         console.log("SSE received:", data);
    //         const statuses = ['Buy', 'Sell', 'Hold'];
    //         const reasons = ['Break EMA', 'Volume Surge', 'MACD Signal'];
    //         const randomDate = getRandomDate(new Date(2025, 6, 1), new Date(2025, 6, 13, 23, 59));

    //         // สมมติ data เป็น object เดียว ไม่ใช่ data.data เป็น array
    //         // ถ้า backend ส่งทีละ stock object ก็แก้แบบนี้
    //         const enrichedStock = {
    //             ...data,
    //             status: statuses[Math.floor(Math.random() * statuses.length)],
    //             reason: reasons[Math.floor(Math.random() * reasons.length)],
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

    // const BATCH_SIZE = 5;
    const SET50 = [
        "ADVANC", "AOT", "AWC", "BANPU", "BBL", "BCP", "BDMS", "BEM", "BH", "BJC",
        "BTS", "CBG", "CCET", "COM7", "CPALL", "CPF", "CPN", "CRC", "DELTA", "EGCO",
        "GPSC", "GULF", "HMPRO", "IVL", "KBANK", "KKP", "KTB", "KTC", "LH", "MINT",
        "MTC", "OR", "OSP", "PTT", "PTTEP", "PTTGC", "RATCH", "SCB", "SCC", "SCGP",
        "TCAP", "TIDLOR", "TISCO", "TLI", "TOP", "TRUE", "TTB", "TU", "VGI", "WHA"
    ];

    const favoriteSymbols = [
        "PTT", "CPALL", "TPLAS", "SCB", "BBL",
        "AOT", "TRUE", "ADVANC", "KBANK"
    ];
    const didFetch = useRef(false);

    // useEffect(() => {
    //     if (didFetch.current) return;
    //     didFetch.current = true;

    //     function replaceOrAppendStocks(prevStocks, updatedStocks) {
    //         const updatedSymbols = updatedStocks.map(stock => stock.stockSymbol?.toUpperCase());

    //         const replacedStocks = prevStocks.map(existingStock => {
    //             const index = updatedSymbols.indexOf(existingStock.stockSymbol?.toUpperCase());
    //             return index !== -1 ? updatedStocks[index] : existingStock;
    //         });

    //         const newStocks = updatedStocks.filter(
    //             stock => !prevStocks.some(s => s.stockSymbol?.toUpperCase() === stock.stockSymbol?.toUpperCase())
    //         );

    //         return [...replacedStocks, ...newStocks];
    //     }

    //     let tempResults = [];
    //     // ย้ายออกมาเป็นฟังก์ชันระดับ useEffect (ไม่ซ้อน)
    //     async function fetchAndProcessSymbols(symbols) {
    //         for (let i = 0; i < symbols.length; i += BATCH_SIZE) {
    //             const batch = symbols.slice(i, i + BATCH_SIZE);
    //             const symbolQuery = batch.join(",");

    //             const response = await fetch(`http://127.0.0.1:3007/StockData/${encodeURIComponent(symbolQuery)}`);
    //             if (!response.ok) {
    //                 throw new Error(`Error ${response.status}: ${response.statusText}`);
    //             }

    //             const json = await response.json();
    //             const stocksArray = Array.isArray(json.data) ? json.data : [json.data];

    //             const enrichedBatch = stocksArray.map((stock) => {
    //                 const enrichedStock = {
    //                     ...stock,
    //                     status: ['Buy', 'Sell', 'Hold'][Math.floor(Math.random() * 3)],
    //                     reason: ['Break EMA', 'Volume Surge', 'MACD Signal'][Math.floor(Math.random() * 3)],
    //                     timeStamp: getRandomDate(new Date(2025, 6, 1), new Date(2025, 6, 13, 23, 59)).toISOString(),
    //                     isFavorite: favoriteSymbols.includes(stock?.stockSymbol?.toUpperCase())
    //                 };

    //                 return enrichedStock;
    //             });

    //             const favoriteBatch = enrichedBatch.filter(s => s.isFavorite);

    //             if (favoriteBatch.length > 0) {
    //                 setFavoriteStocks(prev => replaceOrAppendStocks(prev, favoriteBatch));
    //             }

    //             tempResults = [...tempResults, ...enrichedBatch];
    //             setSETAllStock(prev => replaceOrAppendStocks(prev, enrichedBatch));

    //             // ✅ หลังจบแต่ละ Batch → เซฟ localStorage ทันที
    //             localStorage.setItem('AllStock', JSON.stringify(tempResults));

    //             const favoriteOnly = tempResults.filter(s => s.isFavorite);
    //             localStorage.setItem('FavoriteStocks', JSON.stringify(favoriteOnly));

    //             console.log(`💾 Saved batch ${i / BATCH_SIZE + 1} to localStorage`);
    //         }
    //     }


    //     // ย้ายออกมาอยู่ข้างนอกเช่นกัน
    //     async function checkAndReloadMissing(results) {
    //         const missingSymbols = results
    //             .filter(stock =>
    //                 !stock?.stockSymbol ||
    //                 stock?.stockPrice == null ||
    //                 stock?.changePct == null
    //             )
    //             .map(stock => stock?.stockSymbol)
    //             .filter(Boolean);

    //         if (missingSymbols.length > 0) {
    //             console.warn("🔄 Reload missing stocks:", missingSymbols);
    //             await fetchAndProcessSymbols(missingSymbols);
    //         }
    //     }

    //     async function fetchStocksInTwoSteps() {
    //         setLoading(true);
    //         setError(null);

    //         try {
    //             setSETAllStock([]);
    //             setFavoriteStocks([]);

    //             // 1️⃣ โหลดหุ้น favorite ก่อน
    //             await fetchAndProcessSymbols(favoriteSymbols);

    //             // 2️⃣ โหลดหุ้น SET50 ที่เหลือจริง ๆ (ไม่เอา favoriteSymbols ซ้ำ)
    //             const nonFavoriteSymbols = SET50.filter(
    //                 symbol => !favoriteSymbols.includes(symbol)
    //             );

    //             await fetchAndProcessSymbols(nonFavoriteSymbols);

    //             console.log("✅ Loaded all stocks:", tempResults);

    //             await checkAndReloadMissing(tempResults);

    //             // // 3️⃣ เซฟ stocks ทั้งหมดลง AllStock
    //             // localStorage.setItem('AllStock', JSON.stringify(tempResults));

    //             // // 4️⃣ Filter เฉพาะหุ้นที่ favorite จริงๆ แล้วเซฟแยก
    //             // const favoriteOnly = tempResults.filter(s => s.isFavorite);
    //             // localStorage.setItem('FavoriteStocks', JSON.stringify(favoriteOnly));

    //         } catch (err) {
    //             setError(err.message || "Unknown error");
    //         } finally {
    //             setLoading(false);
    //         }
    //     }

    //     fetchStocksInTwoSteps();

    // }, []);

    useEffect(() => {
        if (didFetch.current) return;
        didFetch.current = true;

        function replaceOrAppendStocks(prevStocks, updatedStocks) {
            const updatedSymbols = updatedStocks.map(stock => stock.stockSymbol?.toUpperCase());

            const replacedStocks = prevStocks.map(existingStock => {
                const index = updatedSymbols.indexOf(existingStock.stockSymbol?.toUpperCase());
                return index !== -1 ? updatedStocks[index] : existingStock;
            });

            const newStocks = updatedStocks.filter(
                stock => !prevStocks.some(s => s.stockSymbol?.toUpperCase() === stock.stockSymbol?.toUpperCase())
            );

            return [...replacedStocks, ...newStocks];
        }

        let tempResults = [];

        async function fetchAndProcessAllStocks() {
            const response = await fetch(`http://127.0.0.1:3007/StockData`);
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            const json = await response.json();
            const stocksArray = Array.isArray(json.data) ? json.data : [json.data];

            const enrichedBatch = stocksArray.map((stock) => {
                const enrichedStock = {
                    ...stock,
                    status: ['Buy', 'Sell', 'Hold'][Math.floor(Math.random() * 3)],
                    reason: 'Not started yet',
                    timeStamp: getRandomDate(new Date(2025, 6, 1), new Date(2025, 6, 13, 23, 59)).toISOString(),
                    isFavorite: favoriteSymbols.includes(stock?.stockSymbol?.toUpperCase())
                };

                return enrichedStock;
            });

            const favoriteBatch = enrichedBatch.filter(s => s.isFavorite);

            if (favoriteBatch.length > 0) {
                setFavoriteStocks(prev => replaceOrAppendStocks(prev, favoriteBatch));
            }

            tempResults = [...tempResults, ...enrichedBatch];
            setAllStock(prev => replaceOrAppendStocks(prev, enrichedBatch));

            localStorage.setItem('AllStock', JSON.stringify(tempResults));

            const favoriteOnly = tempResults.filter(s => s.isFavorite);
            localStorage.setItem('FavoriteStocks', JSON.stringify(favoriteOnly));

            console.log(`💾 Saved all stocks to localStorage`);
        }

        async function checkAndReloadMissing(results) {
            const missingSymbols = results
                .filter(stock =>
                    !stock?.stockSymbol ||
                    stock?.stockPrice == null ||
                    stock?.changePct == null
                )
                .map(stock => stock?.stockSymbol)
                .filter(Boolean);

            if (missingSymbols.length > 0) {
                console.warn("🔄 Reload missing stocks:", missingSymbols);
                await fetchAndProcessAllStocks();  // ดึงใหม่ทั้งไฟล์ เพราะ endpoint ไม่มี filter
            }
        }

        async function fetchStocksOnce() {
            setLoading(true);
            setError(null);

            try {
                setAllStock([]);  // ยังใช้ชื่อนี้แต่หมายถึงหุ้นทั้งหมด
                setFavoriteStocks([]);

                await fetchAndProcessAllStocks();

                console.log("✅ Loaded all stocks:", tempResults);

                await checkAndReloadMissing(tempResults);

            } catch (err) {
                setError(err.message || "Unknown error");
            } finally {
                setLoading(false);
            }
        }

        fetchStocksOnce();

    }, []);



    const filteredStocks = AllStockData.filter((stock) =>
        stock.stockSymbol.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleFavoriteChange = (updatedFavorites) => {
        setFavoriteStocks(updatedFavorites);
        // console.log(updatedFavorites)
    };

    const handleSelect = (stock) => {
        setStockDetail(stock);
        setSwitchState(false);           // <- ส่ง false
        setSignalKey(prev => (prev === 0 ? 1 : 0));
        setShowDropdown(false);
    };

    useEffect(() => {
        const checkOverflow = () => {
            if (containerRef.current) {
                const contentHeight = containerRef.current.scrollHeight;
                const screenHeight = window.innerHeight;
                const overflowing = contentHeight > screenHeight;

                setIsOverflowing(overflowing);
            }
        };

        checkOverflow();
        window.addEventListener('resize', checkOverflow);
        return () => window.removeEventListener('resize', checkOverflow);
    }, [activeMenu]);

    // min-w-[99vw]' : 'w-[100vw]
    return (
        // <div
        //     ref={containerRef}
        //     className={`bg-[#202431] min-h-screen ${isOverflowing ? 'min-w-[99vw]' : 'w-[100vw]'
        //         }`}
        // >
        <div
            ref={containerRef}
            className={`bg-[#202431] min-h-screen min-w-[99vw] max-w-[100vw]`}
        >
            {/* Sidebar */}
            <div
                className={`fixed top-4 left-4 bg-[#2E3343] min-h-[96vh] rounded-xl text-white
                    transition-all duration-300 ease-in-out
                    ${collapsed ? 'w-20' : 'w-64'}
                `}
            >
                <div className={`flex items-start ${collapsed ? 'justify-center' : 'justify-between'} p-4`}>
                    <span className={`${collapsed && 'hidden'} cursor-pointer`} onClick={() => navigate('/')} >
                        <img src="/images/logo.png" alt="Logo" className="h-20" />
                    </span>
                    <div onClick={() => setCollapsed(!collapsed)} className="cursor-pointer hover:bg-gray-700 rounded-full transition-colors">
                        {collapsed ? (
                            <ChevronRight size={30} className="text-white" />
                        ) : (
                            <ChevronLeft size={30} className="text-white" />
                        )}
                    </div>

                </div>

                {/* <hr className={`border-[#868686] ${collapsed ? 'hidden' : 'block'} w-3/4 mx-auto`} /> */}

                {!collapsed && <div className='px-4 mt-4 mb-1 text-sm text-[#868686]'>MAIN MENU</div>}
                <nav className={`space-y-3 px-4 text-white ${collapsed ? 'mt-4' : ''}`}>
                    <div
                        onClick={() => {
                            setActiveMenu('dashboard');
                            setSwitchState(true);
                            setSignalKey(prev => (prev === 0 ? 1 : 0));
                        }}
                        className={`flex items-center ${collapsed ? 'justify-center' : ''} space-x-3 p-2 rounded cursor-pointer transition
                            ${activeMenu === 'dashboard' ? 'bg-[#5D6275] shadow-[0_0_8px_rgba(255,255,255,0.3)]' : 'hover:bg-[#5D6275]'}
                        `}
                    >
                        <HomeIcon className="w-6 h-6 text-white" />
                        {!collapsed && <span className="text-lg text-white">My Watchlist</span>}
                    </div>
                    <div
                        onClick={() => {
                            setActiveMenu('stock');
                            setSwitchState(true);
                            setSignalKey(prev => (prev === 0 ? 1 : 0));
                        }}
                        className={`flex items-center ${collapsed ? 'justify-center' : ''} space-x-3 p-2 rounded cursor-pointer transition
                            ${activeMenu === 'stock' ? 'bg-[#5D6275] shadow-[0_0_8px_rgba(255,255,255,0.3)]' : 'hover:bg-[#5D6275]'}
                        `}
                    >
                        <LineChart size={25} />
                        {!collapsed && <span className="text-lg text-white">หุ้น</span>}
                    </div>
                    {/* <div
                        onClick={() => setActiveMenu('history')}
                        className={`flex items-center ${collapsed ? 'justify-center' : ''} space-x-3 p-2 rounded cursor-pointer transition
                            ${activeMenu === 'history' ? 'bg-[#5D6275] shadow-[0_0_8px_rgba(255,255,255,0.3)]' : 'hover:bg-[#5D6275]'}
                        `}
                    >
                        <History size={25} className="text-white" />
                        {!collapsed && <span className="text-lg text-white">ประวัติสัญญาณ</span>}
                    </div> */}
                </nav>



                {!collapsed && <div className='px-4 mt-8 mb-1 text-sm text-[#868686]'>PREFERENCES</div>}
                <nav className={`space-y-3 px-4 text-white ${collapsed ? 'mt-4' : ''}`}>
                    {/* <div
                        onClick={() => setActiveMenu('notification')}
                        className={`flex items-center ${collapsed ? 'justify-center' : ''} space-x-3 p-2 rounded cursor-pointer transition
                            ${activeMenu === 'notification' ? 'bg-[#5D6275] shadow-[0_0_8px_rgba(255,255,255,0.3)]' : 'hover:bg-[#5D6275]'}
                        `}
                    >
                        <BellIcon className="w-6 h-6 text-white" />
                        {!collapsed && <span className="text-lg text-white">การแจ้งเตือน</span>}
                    </div> */}

                    <div
                        onClick={() => setActiveMenu('setting')}
                        className={`flex items-center ${collapsed ? 'justify-center' : ''} space-x-3 p-2 rounded cursor-pointer transition
                            ${activeMenu === 'setting' ? 'bg-[#5D6275] shadow-[0_0_8px_rgba(255,255,255,0.3)]' : 'hover:bg-[#5D6275]'}
                        `}
                    >
                        <Cog6ToothIcon className="w-6 h-6 text-white" />
                        {!collapsed && <span className="text-lg text-white">การตั้งค่า</span>}
                    </div>
                </nav>

                <hr className={`border-[#868686] my-2 ${collapsed ? 'hidden' : 'block'} w-4/5 mx-auto`} />

                {!collapsed &&
                    <div className="px-4 mt-8">
                        {/* Header with arrow */}
                        <div
                            className="flex items-center space-x-4 cursor-pointer select-none"
                            onClick={() => setExpanded(!expanded)}
                        >
                            {expanded ? (
                                <ChevronUpIcon className="w-5 h-5 text-[#868686]" />
                            ) : (
                                <ChevronDownIcon className="w-5 h-5 text-[#868686]" />
                            )}
                            <div className="text-sm text-[#868686] font-semibold">WATCHLIST</div>
                        </div>

                        {/* Content, toggle visibility */}
                        <div
                            className={`transition-all duration-200 transform origin-top
                                ${expanded ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0 pointer-events-none'}
                            `}
                        >
                            <nav className="mt-3 text-white max-h-65 overflow-y-auto">
                                {favoriteStocks.map((stock, index) => (
                                    <div key={index} className="flex items-center p-2 justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className={`w-6 h-6 rounded-full`}>
                                                <img
                                                    src={stock.logo}
                                                    alt={`${stock.stockSymbol} logo`}
                                                    className="w-6 h-6 rounded-full object-cover"
                                                />
                                            </div>
                                            <span className="text-lg text-white">{stock.stockSymbol}</span>
                                        </div>
                                        <div
                                            className={`${stock.status === 'Buy'
                                                ? 'text-[#41DC8E]'
                                                : stock.status === 'Sell'
                                                    ? 'text-[#FF8282]'
                                                    : 'text-[#E0B469]'
                                                }`}
                                        >
                                            {stock.changePct > 0 ? '+' : ''}
                                            {stock.changePct}%
                                        </div>
                                    </div>
                                ))}
                            </nav>
                        </div>

                    </div>
                }
            </div>

            {/* Content */}
            <div className={`flex-1 relative transition-all min-h-screen duration-300 ${collapsed ? 'ml-24' : 'ml-68'}`}>
                {/* border-b-1 w-[98%] border-[#868686] mb-4 mx-auto */}
                <header className="sticky top-0 z-50 flex flex-col items-center justify-between px-4 py-4 bg-[#1F2230] text-white shadow-md">
                    <div className='flex items-center justify-between w-full'>
                        <div className="relative w-full max-w-sm">
                            <input
                                type="text"
                                placeholder="ค้นหาหุ้น"
                                className="w-full pl-4 pr-10 py-2 rounded-lg bg-[#5D6275] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#41DC8E]"
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setShowDropdown(true);
                                }}
                                onFocus={() => setShowDropdown(true)}
                                onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                            />
                            <Search className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                            {showDropdown && searchTerm.trim() !== '' && filteredStocks.length > 0 && (
                                <div className="absolute z-10 mt-1 w-full bg-[#2E3343] border border-gray-600 rounded-lg shadow-lg max-h-80 overflow-y-auto">
                                    {filteredStocks.map((stock, index) => (
                                        <div
                                            key={index}
                                            className="px-4 py-2 cursor-pointer flex items-center hover:bg-[#3E4355] text-white"
                                            onClick={() => handleSelect(stock)}
                                        >
                                            <img
                                                src={stock.logo}            // ลิงก์โลโก้หุ้นจากข้อมูล stock
                                                alt={stock.stockSymbol}     // ใส่ชื่อหุ้นใน alt เพื่อ SEO / Accessibility
                                                className="w-10 h-10 rounded-full object-cover"
                                            />
                                            <div className='flex-1 px-4'>
                                                <div className="text-white text-sm font-medium">{stock.stockSymbol}</div>
                                                <div className="text-white text-xs">{stock.companyName}</div>
                                            </div>
                                            <div
                                                className={`text-sm font-medium ${stock.changePct > 0
                                                    ? 'text-green-300'
                                                    : stock.changePct < 0
                                                        ? 'text-red-400'
                                                        : 'text-gray-400'
                                                    }`}
                                            >
                                                {stock.changePct > 0
                                                    ? `+${stock.changePct}%`
                                                    : `${stock.changePct}%`}
                                            </div>

                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                                <div>Jonanathan Wong</div>
                                <div className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center">
                                    <UserIcon className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <hr className='w-full mx-auto border-b-1 mt-4 border-[#868686]' />
                </header>

                {activeMenu === 'dashboard' && (
                    <>
                        {favoriteStocks.length === 0 ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-100">
                                <img
                                    src="/icons/OliveSpinner.svg"
                                    alt="Loading..."
                                    className="w-15 h-15 animate-spin mb-2"
                                />
                                <div className="text-lg font-semibold text-gray-300">
                                    Loading favorite stocks...
                                </div>
                                {/* <div className="mt-1 text-xl font-bold text-green-400">
                                    Loaded: {favoriteStocks.length}
                                </div> */}
                            </div>
                        ) : error ? (
                            <div className="absolute inset-0 flex items-center justify-center text-red-600">
                                Error: {error}
                            </div>
                        ) : (
                            <StockSignal
                                key={`${signalKey}-${favoriteStocks.length}`}
                                onSwitchChange={switchState}
                                stock={stockDetail}
                                stockList={favoriteStocks}
                                onFavoriteChange={handleFavoriteChange}
                            />
                        )}
                    </>
                )}

                {activeMenu === 'stock' && (
                    <>
                        {AllStockData.length === 0 ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-100">
                                <img
                                    src="/icons/OliveSpinner.svg"
                                    alt="Loading..."
                                    className="w-15 h-15 animate-spin mb-2"
                                />
                                <div className="text-lg font-semibold text-gray-300">
                                    Loading favorite stocks...
                                </div>
                                {/* <div className="mt-1 text-xl font-bold text-green-400">
                                    Loaded: {AllStock.length} / {SET50.length}
                                </div> */}
                            </div>
                        ) : error ? (
                            <div className="absolute inset-0 flex items-center justify-center text-red-600">
                                Error: {error}
                            </div>
                        ) : (
                            <AllStock
                                key={`${signalKey}-${AllStock.length}`}  // ผสมทั้งรอบ trigger และจำนวน stocks
                                onSwitchChange={switchState}
                                stock={stockDetail}
                                // stockList={AllStock}
                                onFavoriteChange={handleFavoriteChange}
                            />
                        )}
                    </>
                )}

                {activeMenu === 'setting' && (
                    <Setting
                        key={signalKey}
                        onSwitchChange={switchState}
                        stock={stockDetail}
                    />
                )}
            </div>
        </div>
    )
}

export default Dashboard
