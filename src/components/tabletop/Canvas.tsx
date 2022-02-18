import React, {
  FC,
  MouseEvent,
  MutableRefObject,
  useEffect,
  useRef,
  useState,
} from 'react';
import PropTypes, { InferProps } from 'prop-types';

const CanvasPropTypes = {
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
};

type CanvasTypes = InferProps<typeof CanvasPropTypes>;
const Canvas: FC<CanvasTypes> = (props) => {
  const canvasDOM: MutableRefObject<HTMLCanvasElement | null> = useRef(null);
  const [context, setContext] = useState<
    CanvasRenderingContext2D | null | undefined
  >(null);
  const [painting, setPainting] = useState<boolean>(false);

  useEffect(() => {
    setContext(canvasDOM.current?.getContext('2d'));
  }, [context]);

  /**
   * Sets painting to true and starts drawing on declared point.
   * @param {MouseEvent} e Mouse event needed to draw.
   */
  const handleMouseDown = (e: MouseEvent) => {
    handleDraw(e);
  };

  /**
   * Sets painting to false and resets draw path.
   */
  const handleMouseUp = () => {
    context?.beginPath();
  };

  /**
   * Draws a stroke with clientY and clientX.
   *
   * @param {MouseEvent} e The event returned by 'mousemove'.
   */
  const handleDraw = (e: MouseEvent) => {
    if (!painting) return;

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    context!.lineWidth = 20;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    context!.lineCap = 'round';

    context?.lineTo(e.clientX, e.clientY);
    context?.stroke();
    context?.beginPath();
    context?.moveTo(e.clientX, e.clientY);
  };

  return (
    <canvas
      onMouseDown={(e) => {
        setPainting(true);
        handleMouseDown(e);
      }}
      onMouseUp={() => {
        setPainting(false);
        handleMouseUp();
      }}
      onMouseMove={handleDraw}
      width={props.width}
      height={props.height}
      ref={canvasDOM}
    ></canvas>
  );
};

Canvas.propTypes = CanvasPropTypes;

export default Canvas;
