import ForceLightAppearance from "@/components/ForceLightAppearance";

export const metadata = {
  title: "Admin | Thai Migrant Watch",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      noarchive: true,
      nosnippet: true,
    },
  },
};

export default function AdminLayout({ children }) {
  return (
    <>
      <ForceLightAppearance />
      {children}
    </>
  );
}
