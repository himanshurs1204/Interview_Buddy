const SpinnerLoader = ({ size = '16px', color = 'currentColor' }) => {
  return (
    <div
      className="inline-block shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent"
      role="status"
      aria-label="Loading"
      style={{
        width: size,
        height: size,
        color,
      }}
    />
  );
};

export default SpinnerLoader;
