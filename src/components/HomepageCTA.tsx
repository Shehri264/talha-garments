import { useId } from "react";

export interface HomepageCTAProps {
  eyebrow?: string;
  title: string;
  description?: string;
  actionLabel: string;
  href?: string;
  className?: string;
}

export default function HomepageCTA({
  eyebrow,
  title,
  description,
  actionLabel,
  href,
  className,
}: HomepageCTAProps) {
  const titleId = useId();
  const sectionClassName = ["tg-homepage-cta layout-section", className]
    .filter(Boolean)
    .join(" ");
  const actionContent = (
    <>
      {actionLabel}
      <svg
        aria-hidden="true"
        className="tg-homepage-cta__arrow"
        viewBox="0 0 20 20"
        fill="none"
        focusable="false"
      >
        <path
          d="M3.5 10h12m-5-5 5 5-5 5"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
      </svg>
    </>
  );

  return (
    <section className={sectionClassName} aria-labelledby={titleId}>
      <div className="tg-homepage-cta__container page-container">
        <div className="tg-homepage-cta__content">
          {eyebrow && (
            <p className="tg-homepage-cta__eyebrow type-label">{eyebrow}</p>
          )}
          <h2 id={titleId} className="tg-homepage-cta__heading type-section">
            {title}
          </h2>
          {description && (
            <p className="tg-homepage-cta__description type-body">
              {description}
            </p>
          )}
          {href ? (
            <a className="tg-homepage-cta__button tg-button tg-button--primary" href={href}>
              {actionContent}
            </a>
          ) : (
            <button
              className="tg-homepage-cta__button tg-button tg-button--primary"
              type="button"
            >
              {actionContent}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
