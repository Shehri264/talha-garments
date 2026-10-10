export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterProps {
  brandName?: string;
  description?: string;
  shopLinks?: FooterLink[];
  companyLinks?: FooterLink[];
  contactLinks?: FooterLink[];
  className?: string;
}

const DEFAULT_SHOP_LINKS: FooterLink[] = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Collections", href: "/collections" },
];

const DEFAULT_COMPANY_LINKS: FooterLink[] = [{ label: "About", href: "/about" }];

const DEFAULT_CONTACT_LINKS: FooterLink[] = [
  { label: "Contact", href: "/contact" },
];

export default function Footer({
  brandName = "Talha Garments",
  description = "Refined men's and boys' fashion for every occasion.",
  shopLinks = DEFAULT_SHOP_LINKS,
  companyLinks = DEFAULT_COMPANY_LINKS,
  contactLinks = DEFAULT_CONTACT_LINKS,
  className,
}: FooterProps) {
  const footerClassName = [
    "border-t border-[var(--color-border-subtle)] bg-[var(--color-background)] text-[var(--color-text-primary)]",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <footer className={footerClassName}>
      <div className="page-container py-8 sm:py-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex max-w-sm flex-col items-start gap-2">
            <a
              className="font-[var(--font-editorial)] text-2xl font-medium tracking-[var(--tracking-display)] text-[var(--color-text-primary)] no-underline transition-colors hover:text-[var(--color-accent)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-accent)]"
              href="/"
            >
              {brandName}
            </a>
            {description && (
              <p className="max-w-xs text-sm leading-relaxed text-[var(--color-text-secondary)]">
                {description}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-10">
            {shopLinks.length > 0 && (
              <nav aria-label="Shop links">
                <h2 className="text-xs font-semibold uppercase tracking-[var(--tracking-label)] text-[var(--color-text-secondary)]">
                  Shop
                </h2>
                <ul className="m-0 mt-2 flex list-none flex-col gap-1 p-0">
                  {shopLinks.map(({ label, href }) => (
                    <li key={`${href}-${label}`}>
                      <a
                        className="inline-flex min-h-11 items-center py-2 text-sm tracking-[var(--tracking-navigation)] text-[var(--color-text-secondary)] no-underline transition-colors hover:text-[var(--color-text-primary)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-accent)]"
                        href={href}
                      >
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
            {companyLinks.length > 0 && (
              <nav aria-label="Company links">
                <h2 className="text-xs font-semibold uppercase tracking-[var(--tracking-label)] text-[var(--color-text-secondary)]">
                  Company
                </h2>
                <ul className="m-0 mt-2 flex list-none flex-col gap-1 p-0">
                  {companyLinks.map(({ label, href }) => (
                    <li key={`${href}-${label}`}>
                      <a
                        className="inline-flex min-h-11 items-center py-2 text-sm tracking-[var(--tracking-navigation)] text-[var(--color-text-secondary)] no-underline transition-colors hover:text-[var(--color-text-primary)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-accent)]"
                        href={href}
                      >
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
            {contactLinks.length > 0 && (
              <nav aria-label="Contact links">
                <h2 className="text-xs font-semibold uppercase tracking-[var(--tracking-label)] text-[var(--color-text-secondary)]">
                  Contact
                </h2>
                <ul className="m-0 mt-2 flex list-none flex-col gap-1 p-0">
                  {contactLinks.map(({ label, href }) => (
                    <li key={`${href}-${label}`}>
                      <a
                        className="inline-flex min-h-11 items-center py-2 text-sm tracking-[var(--tracking-navigation)] text-[var(--color-text-secondary)] no-underline transition-colors hover:text-[var(--color-text-primary)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-accent)]"
                        href={href}
                      >
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
          </div>
        </div>
        <div className="mt-6 border-t border-[var(--color-border-subtle)] pt-4 sm:mt-8 sm:pt-5">
          <p className="text-xs tracking-[0.04em] text-[var(--color-text-secondary)]">
            © {brandName}
          </p>
        </div>
      </div>
    </footer>
  );
}
