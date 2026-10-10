export interface CollectionItem {
  id: string;
  title: string;
  imageSrc: string;
  imageAlt: string;
  description?: string;
}

export interface CollectionsProps {
  heading?: string;
  items: CollectionItem[];
}

export default function Collections({ heading, items }: CollectionsProps) {
  return (
    <section className="tg-collections layout-section" aria-label={heading ?? "Collections"}>
      <div className="page-container">
        {heading && <h2 className="tg-collections__heading type-section">{heading}</h2>}
        <ul className="tg-collections__list">
          {items.map(({ id, title, imageSrc, imageAlt, description }) => (
            <li className="tg-collections__item" key={id}>
              <article>
                <div className="tg-collections__media">
                  <img src={imageSrc} alt={imageAlt} loading="lazy" decoding="async" />
                </div>
                <h3 className="tg-collections__title type-section">{title}</h3>
                {description && <p className="type-body">{description}</p>}
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
