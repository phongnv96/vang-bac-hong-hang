import styles from "./styles.module.css";

const HEADERS = ["Loại Vàng", "Mua Vào", "Bán Ra"] as const;
const POSITION_STYLES = [styles.thFirst, styles.thMiddle, styles.thLast];

export function PriceTableHeader() {
  return (
    <thead>
      <tr>
        {HEADERS.map((h, i) => (
          <th key={h} className={`uppercase font-bold text-th ${styles.tvTh} ${styles.th} ${POSITION_STYLES[i]}`}>
            {h}
          </th>
        ))}
      </tr>
    </thead>
  );
}
