import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/brand/logo";
import { RESTAURANT_ADDRESS, RESTAURANT_PHONE } from "@/data/types";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-ink text-cream">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 md:grid-cols-12 md:px-8">
        <div className="md:col-span-5">
          <Logo size="footer" onDark />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-cream/70">
            Real Food. Real Satisfaction. Our online-first Nigerian kitchen is preparing to serve selected areas of Lekki and Ajah. Orders are not yet available.
          </p>
        </div>
        <div className="md:col-span-3">
          <p className="text-[11px] font-semibold tracking-label text-cream/50">Launch status</p>
          <p className="mt-3 text-sm leading-relaxed">Launch delivery area: selected parts of Lekki and Ajah. Kitchen address to be announced</p>
          
          <p className="mt-2 text-sm text-cream/70">Not yet accepting orders or reservations</p>
        </div>
        <div className="md:col-span-2">
          <p className="text-[11px] font-semibold tracking-label text-cream/50">Kitchen</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link to="/menu" className="hover:text-brand">
                Menu
              </Link>
            </li>
            <li>
              <Link to="/build" className="hover:text-brand">
                Build your plate
              </Link>
            </li>
            <li>
              <Link to="/reservations" className="hover:text-brand">
                Reservations
              </Link>
            </li>
            <li>
              <Link to="/catering" className="hover:text-brand">
                Catering
              </Link>
            </li>
            <li>
              <Link to="/story" className="hover:text-brand">
                Our story
              </Link>
            </li>
          </ul>
        </div>
        <div className="md:col-span-2">
          <p className="text-[11px] font-semibold tracking-label text-cream/50">House</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link to="/pass" className="hover:text-brand">
                The pass
              </Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-brand">
                Sign in
              </Link>
            </li>
            <li>
              <Link to="/loyalty" className="hover:text-brand">
                The Circle
              </Link>
            </li>
            <li>
              <Link to="/gallery" className="hover:text-brand">
                Gallery
              </Link>
            </li>
            <li>
              <Link to="/faq" className="hover:text-brand">
                Questions
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-brand">
                Visit & contact
              </Link>
            </li>
            <li>
              <Link to="/legal" className="hover:text-brand">
                Terms & privacy
              </Link>
            </li>
            <li>
              <Link to="/admin" className="hover:text-brand">
                Order board
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-6 text-center text-[11px] tracking-label text-cream/40">
        RealMeal · Preview website · Coming soon
      </div>
    </footer>
  );
}
