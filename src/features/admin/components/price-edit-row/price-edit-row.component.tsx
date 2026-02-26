import { type PriceRow } from "@/types/prices";
import styles from "./styles.module.css";

interface PriceEditRowProps {
  row: PriceRow;
  index: number;
  onUpdateField: (index: number, field: keyof PriceRow, value: string) => void;
}

export function PriceEditRow({ row, index, onUpdateField }: PriceEditRowProps) {
  return (
    <tr className="animate-row-slide"
        style={{ animationDelay: `${index * 0.1 + 0.05}s` }}>
      <td className={`text-name color-gold-light ${styles.tvTd} ${styles.nameCell}`}>
        {row.name}
      </td>
      <td className={`${styles.tvTd} ${styles.priceCell}`}>
        <input
          type="text"
          inputMode="numeric"
          value={row.buy}
          onChange={(e) => onUpdateField(index, "buy", e.target.value)}
          placeholder="—"
          className={`${styles.inputPrice} text-price color-buy w-full text-center`}
        />
      </td>
      <td className={`${styles.tvTd} ${styles.priceCellLast}`}>
        <input
          type="text"
          inputMode="numeric"
          value={row.sell}
          onChange={(e) => onUpdateField(index, "sell", e.target.value)}
          placeholder="—"
          className={`${styles.inputPrice} text-price color-sell w-full text-center`}
        />
      </td>
    </tr>
  );
}
