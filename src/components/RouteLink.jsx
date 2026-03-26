export default function RouteLink({ to, onOpenRoute, children, ...props }) {
  return (
    <a
      {...props}
      href={to}
      onClick={(event) => {
        if (
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey ||
          props.target === "_blank"
        ) {
          return;
        }

        event.preventDefault();
        onOpenRoute(to);
      }}
    >
      {children}
    </a>
  );
}
