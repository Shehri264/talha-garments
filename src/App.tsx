import Header from "./components/Header";
import Hero from "./components/Hero";
import Collections from "./components/Collections";
import HomepageCTA from "./components/HomepageCTA";
import Footer from "./components/Footer";
import ProductGrid from "./components/ProductGrid";
import { DEMO_PRODUCTS } from "./data/demoProducts";
import ShopPage from "./pages/ShopPage";
import CartPage from "./pages/CartPage";
import AccountPage from "./pages/AccountPage";

export default function App() {
  const currentPath =
    typeof window === "undefined" ? "/" : window.location.pathname.replace(/\/+$/, "") || "/";
  const isShopPage = currentPath === "/shop";
  const isCartPage = currentPath === "/cart";
  const isAccountPage = currentPath === "/account";

  return (
    <>
      <Header />
      <main>
        {isShopPage ? (
          <ShopPage />
        ) : isCartPage ? (
          <CartPage />
        ) : isAccountPage ? (
          <AccountPage />
        ) : (
          <>
            <Hero />
            <Collections
              heading="THE COLLECTION"
              items={[
                {
                  id: "t-shirts",
                  title: "T-Shirts",
                  imageSrc: "/images/collections/t-shirts.jpg",
                  imageAlt: "Man wearing a charcoal crew-neck T-shirt",
                },
                {
                  id: "polo-shirts",
                  title: "Polo Shirts",
                  imageSrc: "/images/collections/polo-shirts.jpg",
                  imageAlt: "Man wearing a dark olive knit polo shirt",
                },
                {
                  id: "denim",
                  title: "Denim",
                  imageSrc: "/images/collections/denim.jpg",
                  imageAlt: "Dark indigo men's denim jeans",
                },
                {
                  id: "dress-shirts",
                  title: "Dress Shirts",
                  imageSrc: "/images/collections/dress-shirts.jpg",
                  imageAlt: "Man wearing an ivory formal dress shirt",
                },
                {
                  id: "trousers",
                  title: "Trousers",
                  imageSrc: "/images/collections/trousers.jpg",
                  imageAlt: "Men's tailored charcoal trousers",
                },
                {
                  id: "jackets",
                  title: "Jackets",
                  imageSrc: "/images/collections/jackets.jpg",
                  imageAlt: "Man wearing a graphite wool jacket",
                },
              ]}
            />
            <section className="layout-section" aria-labelledby="demo-products-heading">
              <div className="page-container">
                <h2 id="demo-products-heading" className="type-section mb-8">
                  Demo Products
                </h2>
                <ProductGrid products={DEMO_PRODUCTS} />
              </div>
            </section>
            <HomepageCTA
              eyebrow="DISCOVER YOUR STYLE"
              title="FIND YOUR NEXT LOOK."
              description="Talha Garments brings refined men's fashion to every occasion."
              actionLabel="Shop Now"
            />
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
