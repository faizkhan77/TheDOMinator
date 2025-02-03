import { card } from "../assets";
import styles, { layout } from "../style";
import Button from "./Button";

const CardDeal = () => (
  <section className={layout.section}>
    <div className={layout.sectionInfo}>
      <h2 className={styles.heading2}>
        Find the perfect collaborators <br className="sm:block hidden" /> in a few easy steps.
      </h2>
      <p className={`${styles.paragraph} max-w-[470px] mt-5`}>
        Whether you're looking for developers, designers, or project managers, our platform simplifies the process of finding the right people for your team. Collaborate, create, and succeed together.
      </p>

      <Button styles={`mt-10`} />
    </div>

    <div className={layout.sectionImg}>
      <img src={card} alt="collaboration" className="w-[100%] h-[100%]" />
    </div>
  </section>
);

export default CardDeal;
