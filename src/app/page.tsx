
export default function HomePage() {
  // Retornar null permite que o AuthProvider e o ProtectedLayout gerenciem o redirecionamento,
  // evitando o aviso "params are being enumerated" do Next.js.
  return null;
}
