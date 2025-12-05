export default function Footer() {
  return (
    <footer
      style={{
        padding: "0.5rem 2rem",
        borderTop: "1px solid #ddd",
        marginTop: "2rem",
        textAlign: "center",
        fontSize: "0.9rem",
      }}
    >
      © {new Date().getFullYear()} E-Commerce App
    </footer>
  );
}
