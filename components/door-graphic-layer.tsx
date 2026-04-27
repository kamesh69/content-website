import type { DoorGraphic } from "@/lib/types";

import styles from "./door-graphic-layer.module.scss";

type DoorGraphicLayerProps = {
  doors: DoorGraphic[];
};

export function DoorGraphicLayer({ doors }: DoorGraphicLayerProps) {
  return (
    <div className={styles.layer} aria-hidden="true">
      {doors.map((door) => (
        <div
          key={door.id}
          className={styles.door}
          style={{ top: door.top, left: door.left, height: door.height }}
        >
          <span className={styles.frame} />
          <span className={styles.panel} />
          <span className={styles.knob} />
          <span className="sr-only">{door.label}</span>
        </div>
      ))}
    </div>
  );
}
