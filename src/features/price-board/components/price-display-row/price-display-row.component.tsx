import { type PriceRow } from "@/types/prices";
import { formatVND } from "@/lib/utils";
import styles from "./styles.module.css";

interface PriceDisplayRowProps {
  row: PriceRow;
  index: number;
}

export function PriceDisplayRow({ row, index }: PriceDisplayRowProps) {
  return (
    <tr className="animate-row-slide"
        style={{ animationDelay: `${index * 0.1 + 0.05}s` }}>
      <td className={`text-name ${styles.tvTd} ${styles.nameCell}`}>
        {row.name}
      </td>
      <td className={`${styles.tvTd} ${styles.priceCell} ${row.buy ? "text-price text-[#fff176]" : `text-sub ${styles.empty}`}`}>
        {row.buy ? `${formatVND(row.buy)}đ` : "—"}
      </td>
      <td className={`${styles.tvTd} ${styles.priceCellLast} ${row.sell ? "text-price text-[#66ff99]" : `text-sub ${styles.empty}`}`}>
        {row.sell ? `${formatVND(row.sell)}đ` : "—"}
      </td>
    </tr>
  );
}
