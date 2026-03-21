import MainLayout from "./(main)/layout";
import { HomePage } from "@/features/home/home-page";

/**
 * Root `/` — marketing home with Header/Footer (same as former app/(main)/page.tsx).
 * Full-screen price board lives at `/bang-gia-vang`.
 */
export default function Page() {
  return (
    <MainLayout>
      <HomePage />
    </MainLayout>
  );
}
