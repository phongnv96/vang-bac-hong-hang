"use client";

import { usePrices } from "../../hooks/use-prices";
import { useClock } from "../../hooks/use-clock";
import { ShopTitle } from "../../components/shop-title";
import { GoldDivider } from "../../components/gold-divider";
import { PriceTableHeader } from "../../components/price-table-header";
import { PriceDisplayRow } from "../../components/price-display-row";
import { ContactInfo } from "../../components/contact-info";
import styles from "./styles.module.css";

export function PriceBoardPage() {
  const prices = usePrices();
  const dateTime = useClock();

  return (
    <div className={`${styles.tvDisplay} bg-theme w-screen h-screen flex flex-col items-center justify-center relative overflow-hidden`}>

      {/* Double border frame */}
      <div className={`absolute pointer-events-none z-[1] ${styles.frameOuter}`} />
      <div className={`absolute pointer-events-none z-[1] ${styles.frameInner}`} />

      {/* Corner decorations */}
      {[
        { pos: "top-[2.8vh] left-[2.8vh]", transform: "" },
        { pos: "top-[2.8vh] right-[2.8vh]", transform: "scaleX(-1)" },
        { pos: "bottom-[2.8vh] left-[2.8vh]", transform: "scaleY(-1)" },
        { pos: "bottom-[2.8vh] right-[2.8vh]", transform: "scale(-1)" },
      ].map((c, i) => (
        <div key={i} className={`absolute w-[5vh] h-[5vh] z-[2] ${c.pos}`}
             style={{ transform: c.transform || undefined }}>
          <svg viewBox="0 0 60 60" fill="none" className="w-full h-full">
            <path d="M5 55 L5 5 L55 5" stroke="#c9a84c" strokeWidth="2" fill="none" />
            <circle cx="5" cy="5" r="4" fill="#c9a84c" />
          </svg>
        </div>
      ))}

      {/* Main content */}
      <div className={`relative z-[3] w-full min-h-screen flex flex-col items-center justify-center text-center gap-2 md:gap-[1vh] ${styles.tvContent}`}>

        <ShopTitle />

        {/* Responsive Header */}
        <div className="flex flex-col md:flex-row items-center justify-between w-full px-2 mt-2 gap-y-1 xl:gap-y-0">
          <div className={`uppercase text-sub mb-1 xl:mb-0 ${styles.subtitle}`}>
            ✦ Bảng Giá Vàng ✦
          </div>
          <div className={`font-bold text-white mb-2 xl:mb-0 md:mb-[1vh] text-clock ${styles.clock}`}>
            {dateTime || "--/--/---- | --:--:--"}
          </div>
        </div>

        <GoldDivider />

        {/* Price Table */}
        <table className={`w-full ${styles.priceTable}`}>
          <PriceTableHeader />
          <tbody>
            {prices.map((row, idx) => (
              <PriceDisplayRow key={idx} row={row} index={idx} />
            ))}
          </tbody>
        </table>

        <ContactInfo />

        {/* Footer */}
        <div className={`text-footer ${styles.footer}`}>
          <i>Giá có thể thay đổi theo thị trường • Vui lòng liên hệ để biết chi tiết</i>
        </div>
      </div>
    </div>
  );
}
