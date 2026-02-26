import styles from "./styles.module.css";

export function ContactInfo() {
  return (
    <div className={`flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-[3vw] uppercase font-bold text-contact ${styles.root}`}>
      <div>
        Liên hệ:{" "}
        <span className={`font-black text-contact-val ${styles.value}`}>
          0977975626
        </span>
      </div>
      <div className={`font-normal hidden sm:block ${styles.separator}`}>|</div>
      <div>
        Địa chỉ:{" "}
        <span className={`font-black text-contact-val ${styles.value}`}>
          xã Hải Lựu, tỉnh Phú Thọ
        </span>
      </div>
    </div>
  );
}
