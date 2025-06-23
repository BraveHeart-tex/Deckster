const FormField = ({
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className="flex flex-col space-y-2" {...props}>
      {children}
    </div>
  );
};

export default FormField;
