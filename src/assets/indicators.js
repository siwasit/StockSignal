// export const calculateEMA = (data, period = 10) => {
//     // EMA 10 เป็นค่าเฉลี่ยเคลื่อนที่ที่ไม่สั้นเกินไป (ซึ่งจะไวเกิน ทำให้สัญญาณเยอะและเสียงรบกวนมาก)
//     // และไม่ยาวเกินไป (ซึ่งจะตอบสนองช้า ไม่ทันกับการเปลี่ยนแปลงของราคาล่าสุด)
//     // ช่วยให้เห็นแนวโน้มระยะสั้นถึงกลางได้อย่างชัดเจน
//     let ema = [];
//     let multiplier = 2 / (period + 1);
//     let prevEMA = data[0]?.close;

//     data.forEach((d, i) => {
//         if (i === 0) {
//             ema.push({ time: d.time, value: d.close });
//         } else {
//             const currentEMA = (d.close - prevEMA) * multiplier + prevEMA;
//             ema.push({ time: d.time, value: currentEMA });
//             prevEMA = currentEMA;
//         }
//     });

//     return ema;
// };

// // EMA บอกอะไร?
// // EMA (Exponential Moving Average) คือเส้นค่าเฉลี่ยเคลื่อนที่แบบถ่วงน้ำหนักเชิงลึกที่ใช้วิเคราะห์แนวโน้มราคาหุ้นหรือสินทรัพย์ในตลาดการเงินครับ
// // บอกแนวโน้มราคา ว่าในช่วงเวลาที่กำหนด (เช่น 10 วัน) ราคากำลังมีทิศทางขึ้นหรือลง
// // โดยเน้นให้ น้ำหนักกับราคาล่าสุดมากกว่าราคาที่เก่ากว่า ทำให้ EMA ตอบสนองต่อการเปลี่ยนแปลงราคาล่าสุดได้ไวกว่า SMA (Simple Moving Average)
// // ใช้ช่วยตัดสินใจว่า “ตลาดกำลังเป็นขาขึ้น (bullish)” หรือ “ขาลง (bearish)”

// export const calculateVolume = (data) => {
//     // Volume บอกอะไร?
//     //     ความแรงของตลาด:
//     //      Volume สูงหมายความว่ามีการซื้อขายกันมาก แสดงว่าการเคลื่อนไหวราคานั้นน่าเชื่อถือและมีแรงสนับสนุน
//     //     ยืนยันแนวโน้ม:
//     //      ราคาขึ้นพร้อม Volume สูง = แนวโน้มขึ้นน่าจะต่อเนื่อง
//     //      ราคาขึ้นแต่ Volume ต่ำ = อาจเป็นการขึ้นแบบอ่อนแอ หรือหลอก
//     //     สัญญาณกลับตัว:
//     //      Volume พุ่งสูงในช่วงราคากลับตัว อาจบอกว่าผู้เล่นตลาดกำลังเปลี่ยนใจ
//     return data.map(d => ({
//         time: d.time,
//         value: d.volume || Math.floor(Math.random() * 1000) + 100, // ใช้ volume จริง หรือสุ่มถ้ายังไม่มี
//         color: d.close > d.open
//             ? 'rgba(38, 166, 154, 0.5)'   // '#26a69a' 50% transparent
//             : 'rgba(239, 83, 80, 0.5)',   // '#ef5350' 50% transparent
//     }));
// };

// export const calculateRSI = (data, period = 14) => {
//     let rsi = [];
//     let gains = 0;
//     let losses = 0;
//     // เหตุผลเชิงปฏิบัติ
//     // 14 วัน คือช่วงเวลาที่ช่วยกรอง “noise” หรือความผันผวนราคาที่เกิดขึ้นแบบสุ่มได้ดี
//     // ไม่สั้นเกินไปจนทำให้ RSI กระโดดขึ้นลงรุนแรงเกินควร
//     // ไม่ยาวเกินไปจนทำให้ RSI ตอบสนองต่อการเปลี่ยนแปลงราคาได้ช้า

//     for (let i = 1; i <= period; i++) {
//         const change = data[i].close - data[i - 1].close;
//         if (change >= 0) gains += change;
//         else losses -= change;
//     }

//     let avgGain = gains / period;
//     let avgLoss = losses / period;

//     for (let i = period + 1; i < data.length; i++) {
//         const change = data[i].close - data[i - 1].close;
//         avgGain = (avgGain * (period - 1) + (change >= 0 ? change : 0)) / period;
//         avgLoss = (avgLoss * (period - 1) + (change < 0 ? -change : 0)) / period;

//         const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
//         const rsiVal = 100 - 100 / (1 + rs);
//         rsi.push({ time: data[i].time, value: rsiVal });
//     }

//     return rsi;
// };

// export const calculateMACD = (data, fastPeriod = 12, slowPeriod = 26, signalPeriod = 9) => {
//     const ema = (data, period) => {
//         const k = 2 / (period + 1);
//         let emaArray = [];
//         let prevEma = data[0].close;
//         data.forEach((d, i) => {
//             const price = d.close;
//             const nextEma = i === 0 ? price : price * k + prevEma * (1 - k);
//             emaArray.push(nextEma);
//             prevEma = nextEma;
//         });
//         return emaArray;
//     };

//     if (data.length < slowPeriod + signalPeriod) return { macd: [], signal: [], histogram: [] };

//     const emaFast = ema(data, fastPeriod);
//     const emaSlow = ema(data, slowPeriod);
//     const macdLine = emaFast.map((val, i) => val - emaSlow[i]);

//     const signalLine = ema(macdLine.map((v, i) => ({ close: v })), signalPeriod);
//     const histogram = macdLine.map((val, i) => val - signalLine[i]);

//     const macd = macdLine.map((val, i) => ({
//         time: data[i].time,
//         value: val,
//     }));

//     const signal = signalLine.map((val, i) => ({
//         time: data[i].time,
//         value: val,
//     }));

//     const hist = histogram.map((val, i) => ({
//         time: data[i].time,
//         value: val,
//         color: val >= 0 ? 'rgba(38, 166, 154, 0.5)' : 'rgba(239, 83, 80, 0.5)',
//     }));

//     return {
//         macd,
//         signal,
//         histogram: hist,
//     };
// };

// export const calculateOBV = (candles) => {
//     if (!candles || candles.length === 0) return [];

//     let obv = 0;
//     const result = [];

//     for (let i = 1; i < candles.length; i++) {
//         const prevClose = candles[i - 1].close;
//         const currentClose = candles[i].close;
//         const volume = candles[i].volume || 0;

//         if (currentClose > prevClose) {
//             obv += volume;
//         } else if (currentClose < prevClose) {
//             obv -= volume;
//         }
//         // Same price = OBV ไม่เปลี่ยน

//         result.push({
//             time: candles[i].time,
//             value: obv
//         });
//     }

//     return result;
// };
// EMA (Exponential Moving Average)
export const calculateEMA = (data, period = 10) => {
    const ema = [];
    const multiplier = 2 / (period + 1);
    let prevEMA = data[0]?.close;

    data.forEach((d, i) => {
        if (i === 0) {
            ema.push({ time: d.time, value: d.close }); // เริ่มจากราคาปิดวันแรก
        } else {
            const currentEMA = (d.close - prevEMA) * multiplier + prevEMA;
            ema.push({ time: d.time, value: currentEMA });
            prevEMA = currentEMA;
        }
    });

    return ema;
};

// MACD (Moving Average Convergence Divergence)
// MACD = EMA(12) - EMA(26)
// Signal = EMA(9) ของ MACD
// Histogram = MACD - Signal
export const calculateMACD = (data, fastPeriod = 12, slowPeriod = 26, signalPeriod = 9) => {
    const calcEMA = (src, period) => {
        const k = 2 / (period + 1);
        let emaArr = [];
        let prev = src[0].close;

        src.forEach((d, i) => {
            const price = d.close;
            const emaVal = i === 0 ? price : (price - prev) * k + prev;
            emaArr.push(emaVal);
            prev = emaVal;
        });

        return emaArr;
    };

    if (data.length < slowPeriod + signalPeriod) return { macd: [], signal: [], histogram: [] };

    const emaFast = calcEMA(data, fastPeriod);
    const emaSlow = calcEMA(data, slowPeriod);
    const macdLine = emaFast.map((val, i) => val - emaSlow[i]);

    const macdObjects = macdLine.map((val, i) => ({
        time: data[i].time,
        value: val,
    }));

    const signalLine = calcEMA(macdObjects.map((v) => ({ close: v.value })), signalPeriod);
    const signal = signalLine.map((val, i) => ({
        time: data[i].time,
        value: val,
    }));

    const histogram = macdLine.map((val, i) => ({
        time: data[i].time,
        value: val - signalLine[i],
        color: val - signalLine[i] >= 0 ? 'rgba(38,166,154,0.5)' : 'rgba(239,83,80,0.5)'
    }));

    return { macd: macdObjects, signal, histogram };
};

// RSI (Relative Strength Index)
// ใช้สูตร RSI = 100 - (100 / (1 + RS)), RS = AvgGain / AvgLoss
export const calculateRSI = (data, period = 14) => {
    const rsi = [];
    let gains = 0, losses = 0;

    // คำนวณช่วงแรก
    for (let i = 1; i <= period; i++) {
        const change = data[i].close - data[i - 1].close;
        if (change > 0) gains += change;
        else losses -= change;
    }

    let avgGain = gains / period;
    let avgLoss = losses / period;

    for (let i = period + 1; i < data.length; i++) {
        const change = data[i].close - data[i - 1].close;
        const gain = change > 0 ? change : 0;
        const loss = change < 0 ? -change : 0;

        avgGain = (avgGain * (period - 1) + gain) / period;
        avgLoss = (avgLoss * (period - 1) + loss) / period;

        const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
        const rsiValue = 100 - 100 / (1 + rs);

        rsi.push({
            time: data[i].time,
            value: rsiValue
        });
    }

    return rsi;
};

// OBV (On-Balance Volume)
// ใช้ราคาและ volume เพื่อสะสมการเคลื่อนไหว
export const calculateOBV = (data) => {
    let obv = 0;
    const result = [];

    for (let i = 1; i < data.length; i++) {
        const prevClose = data[i - 1].close;
        const currClose = data[i].close;
        const volume = data[i].volume || 0;

        if (currClose > prevClose) obv += volume;
        else if (currClose < prevClose) obv -= volume;

        result.push({ time: data[i].time, value: obv });
    }

    return result;
};

// Volume (ใช้แสดงแรงของตลาด)
export const calculateVolume = (data) => {
    return data.map(d => ({
        time: d.time,
        value: d.volume,
        color: d.close > d.open
            ? 'rgba(38, 166, 154, 0.5)'  // เขียว
            : 'rgba(239, 83, 80, 0.5)'  // แดง
    }));
};