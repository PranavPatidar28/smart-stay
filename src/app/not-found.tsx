import Link from "next/link";

export default function NotFound() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
        fontFamily: "system-ui, sans-serif",
        padding: "2rem",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>404</h1>
      <p style={{ color: "#555", marginBottom: "1.5rem" }}>
        We couldn&apos;t find the page you were looking for.
      </p>
      <Link
        href="/"
        style={{
          padding: "0.6rem 1.2rem",
          borderRadius: "8px",
          background: "#667eea",
          color: "white",
          textDecoration: "none",
          fontSize: "1rem",
        }}
      >
        Go home
      </Link>
    </div>
  );
}
