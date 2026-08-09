import { PortfolioExperience } from "./_components/portfolio/PortfolioExperience";
import { StaticPortfolio } from "./_components/portfolio/StaticPortfolio";
import styles from "./_components/portfolio/portfolio.module.css";

export default function Home() {
  return (
    <>
      <PortfolioExperience />
      <noscript>
        <div className={styles.fallbackStage}>
          <StaticPortfolio />
        </div>
      </noscript>
    </>
  );
}
