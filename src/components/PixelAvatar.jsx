export default function PixelAvatar({ grid, pixelSize = 6 }) {
  if (!grid || grid.length === 0) return null;

  const rows = grid.length;
  const cols = grid[0].length;
  const width = cols * pixelSize;
  const height = rows * pixelSize;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      shapeRendering="crispEdges"
      style={{ imageRendering: 'pixelated', display: 'block' }}
    >
      {grid.map((row, rowIdx) =>
        row.map((color, colIdx) => {
          if (!color) return null;
          return (
            <rect
              key={`${rowIdx}-${colIdx}`}
              x={colIdx * pixelSize}
              y={rowIdx * pixelSize}
              width={pixelSize}
              height={pixelSize}
              fill={color}
            />
          );
        })
      )}
    </svg>
  );
}
