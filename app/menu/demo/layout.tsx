export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return (
    <html style={{ height: "100%", overflow: "hidden" }}>
      <body style={{ height: "100%", overflow: "hidden", margin: 0 }}>
        <div style={{ height: "100%", overflowY: "auto", overscrollBehavior: "contain" }}>
          {children}
        </div>
      </body>
    </html>
  );
}
