import Ruler from "@scena/react-ruler";
import { useEffect, useRef, useState } from "react";

type TimeLineData = {
  id: number;
  colNo: number;
  name: string;
  start: number;
  duration: number;
};

const ScaleValues = [0.1, 0.2, 0.5, 1, 2, 5, 10, 20, 50, 100, 200];

const Timeline = () => {
  const [timeline, setTimeline] = useState<TimeLineData[]>([
    {
      id: 0,
      colNo: 0,
      name: "test",
      start: 0,
      duration: 2000,
    },
  ]);
  const [numberOfColmun, setNumberOfColmun] = useState<number>(0);
  const [zoom, setZoom] = useState<number>(1);
  const [valueZoom, setValueZoom] = useState<number>(3);
  const timelineRef = useRef<HTMLDivElement>(null);
  const rulerRef = useRef<Ruler>(null);

  useEffect(() => {
    let resizeEventId: NodeJS.Timeout;

    const handleResize = () => {
      if (resizeEventId) clearTimeout(resizeEventId);

      resizeEventId = setTimeout(() => {
        const height = timelineRef.current!.offsetHeight;
        setNumberOfColmun(Math.floor(height / 30));
        console.log(height);

        rulerRef.current!.resize();
      }, 100);
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const convertTimeToText = (scale: number) => {
    scale = Math.floor(scale * 100);
    const milliseconds = scale % 1000;
    const seconds = Math.floor(scale / 1000) % 60;
    const minutes = Math.floor(scale / (1000 * 60)) % 60;
    const hours = Math.floor(scale / (1000 * 60 * 60));

    const formattedMilliseconds = milliseconds.toString().padStart(3, "0");
    const formattedSeconds = seconds.toString().padStart(2, "0");
    const formattedMinutes = minutes.toString().padStart(2, "0");
    const formattedHours = hours.toString().padStart(2, "0");

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}.${formattedMilliseconds}`;
  };

  return (
    <div className="w-full h-screen flex flex-col">
      <div>
        <input
          type="range"
          min={0}
          max={ScaleValues.length - 1}
          value={zoom}
          className="range"
          step={1}
          onChange={(e) => {
            setValueZoom(parseInt(e.target.value));
            setZoom(ScaleValues[parseInt(e.target.value)]);
            console.log(e.target.value);
          }}
        />
      </div>
      <div className="h-[30px]">
        <Ruler
          type="horizontal"
          ref={rulerRef}
          textFormat={convertTimeToText}
          unit={100 / zoom}
          zoom={zoom}
        />
      </div>
      <div ref={timelineRef} className="grow">
        {new Array(numberOfColmun).fill(0).map((_, i) => (
          <div className="h-[30px] border-b relative" key={i}>
            {
              timeline
                .filter((t) => t.colNo === i)
                .map((t) => (
                  <div
                    className="absolute bg-blue-400 h-full"
                    key={t.id}
                    style={{
                      width: `${(t.duration / 100) * zoom}px`,
                    }}
                  >
                    {/* {t.name} */}
                  </div>
                ))[0]
            }
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;
