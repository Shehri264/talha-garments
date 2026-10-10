import Button from "./Button";

export interface HeroProps {
  eyebrow?: string;
  title?: string;
  description?: string;
}

export default function Hero({
  eyebrow = "TALHA GARMENTS",
  title = "STYLE, REDEFINED.",
  description = "Premium men's and boys' fashion for formal, casual, and everyday style.",
}: HeroProps) {
  return (
    <section className="tg-hero layout-section">
      <div className="page-container">
        {eyebrow && <p className="type-label">{eyebrow}</p>}
        <h1 className="type-display">{title}</h1>
        {description && <p className="type-body">{description}</p>}
        <Button className="tg-hero__button" variant="primary" type="button">
          Explore Collection
        </Button>
        <div className="tg-hero__image-area">
          <img
            src="/images/mens-fashion-hero.jpg"
            alt="Model wearing a charcoal wool coat over black knitwear"
          />
        </div>
      </div>
    </section>
  );
}
