import { useEffect } from "react";
import s from "./empty.module.scss";

const Index = () => {
  useEffect(() => {
    const animateCircles = () => {
      const circles = document.querySelectorAll(`.${s.circle}`);
      circles.forEach((circle, index) => {
        setTimeout(() => {
          circle.style.animationPlayState = "running";
          setTimeout(() => {
            circle.style.animationPlayState = "paused";
          }, 1500); // duration of the animation
        }, index * 300); // delay for each circle
      });
    };

    animateCircles();
    const interval = setInterval(animateCircles, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={s.empty}>
      <img src="./img/empty.svg" alt="Empty" />
      <div className={s.loader}>
        <p>Empty</p>
        <div className={s.circle} id="a"></div>
        <div className={s.circle} id="b"></div>
        <div className={s.circle} id="c"></div>
      </div>
    </div>
  );
};

export default Index;
