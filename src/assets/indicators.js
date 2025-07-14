export const calculateEMA = (data, period = 10) => {
    // EMA 10 เป็นค่าเฉลี่ยเคลื่อนที่ที่ไม่สั้นเกินไป (ซึ่งจะไวเกิน ทำให้สัญญาณเยอะและเสียงรบกวนมาก)
    // และไม่ยาวเกินไป (ซึ่งจะตอบสนองช้า ไม่ทันกับการเปลี่ยนแปลงของราคาล่าสุด)
    // ช่วยให้เห็นแนวโน้มระยะสั้นถึงกลางได้อย่างชัดเจน
    let ema = [];
    let multiplier = 2 / (period + 1);
    let prevEMA = data[0]?.close;

    data.forEach((d, i) => {
        if (i === 0) {
            ema.push({ time: d.time, value: d.close });
        } else {
            const currentEMA = (d.close - prevEMA) * multiplier + prevEMA;
            ema.push({ time: d.time, value: currentEMA });
            prevEMA = currentEMA;
        }
    });

    return ema;
};

// EMA บอกอะไร?
// EMA (Exponential Moving Average) คือเส้นค่าเฉลี่ยเคลื่อนที่แบบถ่วงน้ำหนักเชิงลึกที่ใช้วิเคราะห์แนวโน้มราคาหุ้นหรือสินทรัพย์ในตลาดการเงินครับ
// บอกแนวโน้มราคา ว่าในช่วงเวลาที่กำหนด (เช่น 10 วัน) ราคากำลังมีทิศทางขึ้นหรือลง
// โดยเน้นให้ น้ำหนักกับราคาล่าสุดมากกว่าราคาที่เก่ากว่า ทำให้ EMA ตอบสนองต่อการเปลี่ยนแปลงราคาล่าสุดได้ไวกว่า SMA (Simple Moving Average)
// ใช้ช่วยตัดสินใจว่า “ตลาดกำลังเป็นขาขึ้น (bullish)” หรือ “ขาลง (bearish)”

export const calculateVolume = (data) => {
    // Volume บอกอะไร?
    //     ความแรงของตลาด:
    //      Volume สูงหมายความว่ามีการซื้อขายกันมาก แสดงว่าการเคลื่อนไหวราคานั้นน่าเชื่อถือและมีแรงสนับสนุน
    //     ยืนยันแนวโน้ม:
    //      ราคาขึ้นพร้อม Volume สูง = แนวโน้มขึ้นน่าจะต่อเนื่อง
    //      ราคาขึ้นแต่ Volume ต่ำ = อาจเป็นการขึ้นแบบอ่อนแอ หรือหลอก
    //     สัญญาณกลับตัว:
    //      Volume พุ่งสูงในช่วงราคากลับตัว อาจบอกว่าผู้เล่นตลาดกำลังเปลี่ยนใจ
    return data.map(d => ({
        time: d.time,
        value: d.volume || Math.floor(Math.random() * 1000) + 100, // ใช้ volume จริง หรือสุ่มถ้ายังไม่มี
        color: d.close > d.open
            ? 'rgba(38, 166, 154, 0.5)'   // '#26a69a' 50% transparent
            : 'rgba(239, 83, 80, 0.5)',   // '#ef5350' 50% transparent
    }));
};

export const calculateRSI = (data, period = 14) => {
    let rsi = [];
    let gains = 0;
    let losses = 0;
    // เหตุผลเชิงปฏิบัติ
    // 14 วัน คือช่วงเวลาที่ช่วยกรอง “noise” หรือความผันผวนราคาที่เกิดขึ้นแบบสุ่มได้ดี
    // ไม่สั้นเกินไปจนทำให้ RSI กระโดดขึ้นลงรุนแรงเกินควร
    // ไม่ยาวเกินไปจนทำให้ RSI ตอบสนองต่อการเปลี่ยนแปลงราคาได้ช้า

    for (let i = 1; i <= period; i++) {
        const change = data[i].close - data[i - 1].close;
        if (change >= 0) gains += change;
        else losses -= change;
    }

    let avgGain = gains / period;
    let avgLoss = losses / period;

    for (let i = period + 1; i < data.length; i++) {
        const change = data[i].close - data[i - 1].close;
        avgGain = (avgGain * (period - 1) + (change >= 0 ? change : 0)) / period;
        avgLoss = (avgLoss * (period - 1) + (change < 0 ? -change : 0)) / period;

        const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
        const rsiVal = 100 - 100 / (1 + rs);
        rsi.push({ time: data[i].time, value: rsiVal });
    }

    return rsi;
};

export const calculateMACD = (data, fastPeriod = 12, slowPeriod = 26, signalPeriod = 9) => {
    const ema = (data, period) => {
        const k = 2 / (period + 1);
        let emaArray = [];
        let prevEma = data[0].close;
        data.forEach((d, i) => {
            const price = d.close;
            const nextEma = i === 0 ? price : price * k + prevEma * (1 - k);
            emaArray.push(nextEma);
            prevEma = nextEma;
        });
        return emaArray;
    };

    if (data.length < slowPeriod + signalPeriod) return { macd: [], signal: [], histogram: [] };

    const emaFast = ema(data, fastPeriod);
    const emaSlow = ema(data, slowPeriod);
    const macdLine = emaFast.map((val, i) => val - emaSlow[i]);

    const signalLine = ema(macdLine.map((v, i) => ({ close: v })), signalPeriod);
    const histogram = macdLine.map((val, i) => val - signalLine[i]);

    const macd = macdLine.map((val, i) => ({
        time: data[i].time,
        value: val,
    }));

    const signal = signalLine.map((val, i) => ({
        time: data[i].time,
        value: val,
    }));

    const hist = histogram.map((val, i) => ({
        time: data[i].time,
        value: val,
        color: val >= 0 ? 'rgba(38, 166, 154, 0.5)' : 'rgba(239, 83, 80, 0.5)',
    }));

    return {
        macd,
        signal,
        histogram: hist,
    };
};
