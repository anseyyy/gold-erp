"use client";

import React, { useState } from "react";
import CalculaterDesign from "./CalculaterDesign";

function CalculatorLogic() {
    const [rate, setRate] = useState("");
    const [usdt, setUsdt] = useState("");
    const [idr, setIdr] = useState("");

    const [quantity, setQuantity] = useState("");
    const [buyRate, setBuyRate] = useState("");
    const [sellRate, setSellRate] = useState("");

    // USDT → IDR
    const handleUsdtChange = (value) => {
        setUsdt(value);

        if (value && rate) {
            setIdr(Number(value) * Number(rate));
        } else {
            setIdr("");
        }
    };

    // IDR → USDT
    const handleIdrChange = (value) => {
        setIdr(value);

        if (value && rate) {
            setUsdt(Number(value) / Number(rate));
        } else {
            setUsdt("");
        }
    };

    const handleRateChange = (value) => {
        setRate(value);

        if (usdt && value) {
            setIdr(Number(usdt) * Number(value));
        } else if (idr && value) {
            setUsdt(Number(idr) / Number(value));
        }
    };

    // Profit calculation
    const buyCost =
        Number(quantity || 0) * Number(buyRate || 0);

    const sellRevenue =
        Number(quantity || 0) * Number(sellRate || 0);

    const profit = sellRevenue - buyCost;

    return (
        <CalculaterDesign
            rate={rate}
            usdt={usdt}
            idr={idr}
            quantity={quantity}
            buyRate={buyRate}
            sellRate={sellRate}
            buyCost={buyCost}
            sellRevenue={sellRevenue}
            profit={profit}
            onRateChange={handleRateChange}
            onUsdtChange={handleUsdtChange}
            onIdrChange={handleIdrChange}
            onQuantityChange={setQuantity}
            onBuyRateChange={setBuyRate}
            onSellRateChange={setSellRate}
        />
    );
}

export default CalculatorLogic;