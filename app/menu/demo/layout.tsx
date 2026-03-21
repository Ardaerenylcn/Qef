export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return (
    <html style={{ overflow: "hidden" }}>
      <body style={{ overflow: "hidden", margin: 0 }}>
        <div style={{
          position: "fixed",
          inset: 0,
          overflowY: "auto",
          overscrollBehavior: "contain",
          WebkitOverflowScrolling: "touch",
        } as React.CSSProperties}>
          {children}
        </div>
      </body>
    </html>
  );
}
