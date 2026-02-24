import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Bảng Giá Vàng - Vàng Bạc Hồng Hằng";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #8B0000 0%, #3d0000 40%, #1a0000 100%)",
          fontFamily: "serif",
          position: "relative",
        }}
      >
        {/* Gold border */}
        <div
          style={{
            position: "absolute",
            top: 20,
            left: 20,
            right: 20,
            bottom: 20,
            border: "3px solid #c9a84c",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 32,
            left: 32,
            right: 32,
            bottom: 32,
            border: "1px solid rgba(201,168,76,0.4)",
            display: "flex",
          }}
        />

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
          }}
        >
          {/* Diamond */}
          <div
            style={{
              width: 16,
              height: 16,
              background: "#c9a84c",
              transform: "rotate(45deg)",
              display: "flex",
            }}
          />

          {/* Shop name */}
          <div
            style={{
              fontSize: 72,
              fontWeight: 900,
              color: "#f5d27a",
              letterSpacing: "0.1em",
              textShadow: "0 0 30px rgba(245,210,122,0.5), 2px 2px 0 #7a3800",
              textTransform: "uppercase",
              display: "flex",
            }}
          >
            Vàng Bạc Hồng Hằng
          </div>

          {/* Divider */}
          <div
            style={{
              width: 400,
              height: 2,
              background: "linear-gradient(90deg, transparent, #c9a84c, transparent)",
              display: "flex",
            }}
          />

          {/* Subtitle */}
          <div
            style={{
              fontSize: 32,
              color: "#c9a84c",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              display: "flex",
            }}
          >
            ✦ Bảng Giá Vàng Cập Nhật ✦
          </div>

          {/* Contact */}
          <div
            style={{
              fontSize: 24,
              color: "rgba(201,168,76,0.7)",
              letterSpacing: "0.1em",
              marginTop: 20,
              display: "flex",
            }}
          >
            Liên hệ: 0977975626 • xã Hải Lựu, tỉnh Phú Thọ
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
