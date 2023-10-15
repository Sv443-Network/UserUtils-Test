import { SelectorObserver } from "@sv443-network/userutils";

export async function selectorObserverTest() {
  const bodyObs = new SelectorObserver(document.body);

  bodyObs.addListener("#selector-observer-cont", {
    listener: (cont1) => {
      console.log("container 1 available");

      const subcont1Obs = new SelectorObserver(cont1);

      subcont1Obs.addListener("#selector-observer-subcont1", {
        listener: (subcont1) => {
          console.log("subcontainer 1 available");

          const subcont1ItemsObs = new SelectorObserver(subcont1);

          subcont1ItemsObs.addListener(".selector-observer-subcont", {
            all: true,
            continuous: true,
            listener: (subcont1Items) => {
              console.log("subcontainer 1 items:", subcont1Items);
            },
          });
        },
      });
    },
  });
}
