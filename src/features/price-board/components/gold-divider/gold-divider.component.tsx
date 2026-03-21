import styles from "./styles.module.css";

export function GoldDivider() {
  return (
    <div className="flex items-center gap-4 w-[90%] md:w-3/4 mb-2 md:mb-[1vh]">
      <div className={`flex-1 h-px ${styles.line}`} />
      <div className={`w-2 h-2 md:w-2.5 md:h-2.5 rotate-45 shrink-0 ${styles.diamond}`} />
      <div className={`flex-1 h-px ${styles.line}`} />
    </div>
  );
}
